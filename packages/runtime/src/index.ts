import type { Proxy } from "~translations/proxy";
import type { SupportedLanguages, SupportedNamespaces } from "~translations/registry";

import { capitalizeFirst } from "@diacritic/utilities";
import { DeepProxy } from "proxy-deep";

import { defaultLanguage, importTranslationModule, languages, namespaces } from "~translations/registry";

export type Language = SupportedLanguages[number];
export type Namespace = SupportedNamespaces[number];

function createProxy(language: Language,	modules: Record<Language, Record<Namespace, any>>) {
	return new DeepProxy({}, {
		get(_, property) {
			if (typeof property !== "string") return;

			return this.nest(() => {});
		},
		apply(_, __, args) {
			const [namespace, ...path] = this.path;

			if (!namespace) throw new Error("Namespace is not specified");

			if (!modules[language])
				throw new Error(`Language ${language} is not loaded`);

			if (!modules[language]![namespace as Language])
				throw new Error(`Namespace ${namespace} is not loaded`);

			const name = path.reduce((acc, item, index) => {
				if (index === 0) return item;
				return acc + capitalizeFirst(item);
			}, "");

			const fn: any = modules[language]![namespace as Namespace][name];
			return fn(...args);
		},
	});
}

/**
 * The Diacritic class is used to manage the translations and the current language.
 * It also provides a method to change the language and a method to listen to language changes.
 *
 * This class should be instantiated using the `createDiacritic` function.
 *
 * @example
 * ```ts
 * const diacritic = await createDiacritic("en", ["common"]);
 * ```
 */
class Diacritic {
	public readonly defaultLanguage: Language = defaultLanguage;
	public readonly languages: Language[] = languages;
	public readonly namespaces: Namespace[] = namespaces;

	#current: Language = defaultLanguage;
	#modules: Record<Language, Record<Namespace, any>> = {} as any;

	#listeners: Set<(language: Language) => void> = new Set();

	public t!: Proxy;

	public get language(): Language {
		return this.#current;
	};

	public setLanguage = (language: Language) => {
		this.#current = language;
		this.#listeners.forEach(listener => listener(language));

		this.t = createProxy(this.#current, this.#modules);
	};

	public onChange = (listener: (language: Language) => void) => {
		this.#listeners.add(listener);
		return () => this.#listeners.delete(listener);
	};

	public async loadModules(languages: Language[], namespaces: Namespace[]) {
		const promises = [];
		for (const language of languages) {
			for (const namespace of namespaces)
				promises.push(this.loadModule(language, namespace));
		}

		await Promise.all(promises);
		this.t = createProxy(this.#current, this.#modules);
	}

	private async loadModule(language: Language, namespace: Namespace) {
		const module = await importTranslationModule(language, namespace);

		if (!this.#modules[language]) this.#modules[language] = {} as any;
		this.#modules[language]![namespace] = module;
	}
}

/**
 * This function is used to create a new instance of the Diacritic class.
 *
 * @example
 * ```ts
 * const language = detect(htmlLangAttributeDetector); // Use the detector to get the initial language
 * const diacritic = await createDiacritic(language, ["common"]);
 * ```
 *
 * @param language the initial language
 * @param initialNamespaces the initial namespaces to load
 * @returns a new instance of the Diacritic class
 */
export async function createDiacritic(language: Language,	initialNamespaces: Namespace[]) {
	const diacritic = new Diacritic();

	diacritic.setLanguage(language);
	await diacritic.loadModules([language], initialNamespaces);

	return diacritic;
}

export { defaultLanguage, languages };

export type { Diacritic };
export type { Proxy };
