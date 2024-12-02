import { dirname, resolve } from "node:path";

import { toCamelCase } from "@diacritic/utilities";
import { globSync } from "glob";

export class ResourceGraph {
	#graph: Record<string, Record<string, string>> = {};

	#determineLanguageAndNamespaceFromResources(file: string, resources: string[]) {
		for (const resource of resources) {
			const pattern = resource.replaceAll("{{namespace}}", "(.*)").replaceAll("{{language}}", "(.*)");

			const regex = new RegExp(pattern);
			const match = file.match(regex);

			if (match) return { language: match[1]!, namespace: toCamelCase(match[2]!) };
		}

		throw new Error(`Could not determine language and namespace from file ${file}`);
	}

	public constructor(languages: string[], resources: string[]) {
		for (const language of languages) {
			for (const resource of resources) {
				const pattern = resolve(resource)
					.replaceAll("{{language}}", language)
					.replaceAll("{{namespace}}", "*");

				for (const file of globSync(pattern)) {
					this.addFile(file, resources);
				}
			}
		}
	}

	public get files() {
		return Object.values(this.#graph).flatMap(value => Object.values(value));
	}

	public get entries() {
		return this.#graph;
	}

	public get namespaces() {
		return [...new Set(Object.values(this.#graph).flatMap(value => Object.keys(value)))];
	}

	public get folders() {
		return [
			...new Set(Object.values(this.#graph).flatMap(value => Object.values(value)).map(file => dirname(file))),
		];
	}

	public entriesForLanguage(language: string) {
		return this.#graph[language] ?? {};
	}

	public entryForLanguageAndNamespace(language: string, namespace: string) {
		return this.#graph[language]?.[namespace];
	}

	public hasFile(file: string) {
		return this.files.includes(file);
	}

	public addFile(file: string, resources: string[]) {
		const { language, namespace } = this.#determineLanguageAndNamespaceFromResources(file, resources);

		this.#graph[language] ??= {};

		if (this.#graph[language][namespace])
			throw new Error(`Duplicate namespace ${namespace} for language ${language} found`);

		this.#graph[language][namespace] = file;
	}

	public removeFile(file: string, resources: string[]) {
		const { language, namespace } = this.#determineLanguageAndNamespaceFromResources(file, resources);

		delete this.#graph[language]![namespace];
	}
}
