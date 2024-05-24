import { resolve } from "node:path";

import { toCamelCase } from "@diacritic/utilities";
import { globSync } from "glob";

export class ResourceGraph {
	private graph: Record<string, Record<string, string[]>> = {};

	public constructor(languages: string[], resources: string[]) {
		for (const language of languages) {
			for (const resource of resources) {
				const pattern = resolve(resource).replaceAll("{{language}}", language);
				const files = globSync(pattern);

				const regex = new RegExp(pattern.replace("*", "(.*)"));
				for (const file of files) {
					const namespace = toCamelCase(file.match(regex)![1]!);

					if (!this.graph[language]) this.graph[language] = {};
					if (!this.graph[language]![namespace]) this.graph[language]![namespace] = [];
					this.graph[language]![namespace]!.push(file);
				}
			}
		}
	}

	public allFiles() {
		return Object.values(this.graph).flatMap(value => Object.values(value)).flat();
	}

	public allEntries() {
		return this.graph;
	}

	public allEntriesForLanguage(language: string) {
		return this.graph[language] ?? {};
	}

	public allEntriesForLanguageAndNamespace(language: string, namespace: string) {
		return this.graph[language]?.[namespace] ?? [];
	}

	public allNamespaces() {
		return [...new Set(Object.values(this.graph).flatMap(value => Object.keys(value)).flat())];
	}

	public hasFile(file: string) {
		return this.allFiles().includes(file);
	}

	public addFile(file: string, resources: string[]) {
		const { language, namespace } = this.determineLanguageAndNamespaceFromResources(file, resources);

		if (!this.graph[language]) this.graph[language] = {};
		if (!this.graph[language]![namespace]) this.graph[language]![namespace] = [];

		this.graph[language]![namespace]!.push(file);
	}

	public removeFile(file: string, resources: string[]) {
		const { language, namespace } = this.determineLanguageAndNamespaceFromResources(file, resources);
		this.graph[language]![namespace] = this.graph[language]![namespace]!.filter(f => f !== file);
	}

	private determineLanguageAndNamespaceFromResources(file: string, resources: string[]) {
		for (const resource of resources) {
			const regex = new RegExp(resource.replaceAll("*", "(.*)").replace("{{language}}", "(.*)"));
			const match = file.match(regex);

			if (match) return { language: match[1]!, namespace: toCamelCase(match[2]!) };
		}

		throw new Error(`Could not determine language and namespace from file: ${file}`);
	}
}
