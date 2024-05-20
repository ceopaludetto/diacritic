import { resolve } from "node:path";

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
					const namespace = file.match(regex)?.[1] ?? "default";

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
}
