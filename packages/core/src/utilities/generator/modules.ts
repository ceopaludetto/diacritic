import type { Entry } from "../types";

import { EOL } from "node:os";

import { prefixes } from "../loader";

export function createFunctionFromEntry(entry: Entry) {
	return [
		`export function ${entry.name}(${entry.args.map(item => item.name + ": " + item.type)}) {`,
		`\treturn \`${entry.return}\`;`,
		`}`,
	].join(EOL);
}

export function createExportFromLanguageAndNamespace(language: string, namespace: string) {
	return `export * as ${namespace} from "${prefixes[0]}${language}/${namespace}";`;
}

export function createRegistry(defaultLanguage: string, languages: string[], namespaces: string[]) {
	return [
		`export const defaultLanguage = ${JSON.stringify(defaultLanguage)} as const;`,
		`export const languages = ${JSON.stringify(languages)} as const;`,
		`export const namespaces = ${JSON.stringify(namespaces)} as const;`,
		"",
		`const modules = {`,
		languages.flatMap(language => [
			`\t${language}: {`,
			namespaces
				.map(namespace => `\t\t\t${namespace}: async () => import("${prefixes[1]}${language}/${namespace}"),`)
				.join(EOL),
			`\t},`,
		]).join(EOL),
		`}`,
		"",
		`export async function importTranslationModule(language: string, namespace: string) {`,
		`\treturn modules[language][namespace]();`,
		`}`,
	].join(EOL);
}
