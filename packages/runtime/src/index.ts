import type { Proxy } from "~translations/proxy";

import { toCamelCase } from "@diacritic/utilities";
import { DeepProxy } from "@qiwi/deep-proxy";

type Registry = typeof import("~translations/registry");

export type Language = Registry["languages"][number];
export type Namespace = Registry["namespaces"][number];

function emptyFn() {}

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

	#current!: Language;
	#modules: Record<Language, Record<Namespace, any>> = {} as any;

	#listeners: Set<(language: Language) => void> = new Set();

	public constructor(registry: Registry, initialLanguage: Language = registry.defaultLanguage) {
		this.registry = registry;
		this.#current = initialLanguage;
	}

	public get language(): Language {
		return this.#current;
	};

	public setLanguage = (language: Language) => {
		this.#current = language;
		this.#listeners.forEach(listener => listener(language));
	};

	public onChange = (listener: (language: Language) => void) => {
		this.#listeners.add(listener);
		return () => this.#listeners.delete(listener);
	};

	public loadModules = async (languages: Language[], namespaces: Namespace[]) => {
		const promises: Promise<void>[] = [];
		for (const language of languages) {
			for (const namespace of namespaces) {
				if (this.#modules[language] && this.#modules[language]![namespace]) continue;
				promises.push(this.#loadModule(language, namespace));
			}
		}

		if (promises.length === 0) return;
		await Promise.all(promises);
	};

	public needToLoadModules = (languages: Language[], namespaces: Namespace[]) => {
		const missing = [];
		for (const language of languages) {
			for (const namespace of namespaces) {
				if (this.#modules[language] && this.#modules[language]![namespace]) continue;
				missing.push({ language, namespace });
			}
		}

		return missing.length > 0;
	};

	async #loadModule(language: Language, namespace: Namespace) {
		const module = await this.registry.importTranslationModule(language, namespace);

		if (!this.#modules[language]) this.#modules[language] = {} as any;
		this.#modules[language]![namespace] = module;
	}

	public t: Proxy = new DeepProxy({}, ({ trapName, path, args, DEFAULT, PROXY }) => {
		if (trapName === "set") throw new TypeError("Cannot set properties on a Diacritic proxy object");

		if (trapName === "get") {
			if (path.length === 0 && !this.#modules[this.#current])
				console.warn(`[Diacritic] language ${this.#current} is not loaded`);

			const [namespace] = path;
			if (namespace && !this.#modules[this.#current]?.[namespace as Namespace])
				console.warn(`[Diacritic] namespace ${namespace} is not loaded in language ${this.#current}`);

			return PROXY(emptyFn);
		}

		if (trapName === "apply") {
			const [namespace, ...rest] = path;

			if (!namespace) throw new Error("Namespace is not specified");

			if (!this.#modules[this.#current])
				throw new Error(`Language ${this.#current} is not loaded`);

			if (!this.#modules[this.#current]![namespace as Language])
				throw new Error(`Namespace ${namespace} is not loaded`);

			const name = toCamelCase(rest.join("-"));
			const fn: any = this.#modules[this.#current]![namespace as Namespace][name];

			if (typeof fn !== "function")
				throw new Error(`Function ${name} is not defined in namespace ${namespace}`);

			return fn(this.t, ...args);
		}

		return DEFAULT;
	});
}

export type { Proxy };
