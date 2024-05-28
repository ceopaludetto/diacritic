import type { Proxy } from "~translations/proxy";

import { capitalizeFirst } from "@diacritic/utilities";
import { DeepProxy } from "proxy-deep";

type Registry = typeof import("~translations/registry");

export type Language = Registry["languages"][number];
export type Namespace = Registry["namespaces"][number];

function createProxy(language: Language,	modules: Record<Language, Record<Namespace, any>>) {
	const proxy: Proxy = new DeepProxy({}, {
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

			if (typeof fn !== "function")
				throw new Error(`Function ${name} is not defined in namespace ${namespace}`);

			return fn(proxy, ...args);
		},
	});

	return proxy;
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
export class Diacritic {
	public readonly registry!: Registry;
	public readonly languages!: Language[];
	public readonly namespaces!: Namespace[];

	private current!: Language;
	private modules: Record<Language, Record<Namespace, any>> = {} as any;

	private listeners: Set<(language: Language) => void> = new Set();

	public constructor(registry: Registry, initialLanguage: Language = registry.defaultLanguage) {
		this.registry = registry;
		this.current = initialLanguage;
	}

	public t!: Proxy;

	public get language(): Language {
		return this.current;
	};

	public setLanguage = (language: Language) => {
		this.current = language;
		this.listeners.forEach(listener => listener(language));

		this.t = createProxy(this.current, this.modules);
	};

	public onChange = (listener: (language: Language) => void) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};

	public loadModules = async (languages: Language[], namespaces: Namespace[]) => {
		const promises: Promise<void>[] = [];
		for (const language of languages) {
			for (const namespace of namespaces) {
				if (this.modules[language] && this.modules[language]![namespace]) continue;
				promises.push(this.loadModule(language, namespace));
			}
		}

		if (promises.length === 0) return;

		await Promise.all(promises);
		this.t = createProxy(this.current, this.modules);
	};

	public needToLoadModules = (languages: Language[], namespaces: Namespace[]) => {
		const missing = [];
		for (const language of languages) {
			for (const namespace of namespaces) {
				if (this.modules[language] && this.modules[language]![namespace]) continue;
				missing.push({ language, namespace });
			}
		}

		return missing.length > 0;
	};

	private async loadModule(language: Language, namespace: Namespace) {
		const module = await this.registry.importTranslationModule(language, namespace);

		if (!this.modules[language]) this.modules[language] = {} as any;
		this.modules[language]![namespace] = module;
	}
}

export type { Proxy };
