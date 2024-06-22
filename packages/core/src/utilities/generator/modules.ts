import type { Entry } from "../types";

import { EOL } from "node:os";

import { prefixes } from "../loader";

function toUnion(arr: string[]) {
	return arr.map(item => `"${item}"`).join(" | ");
}

export function createFunctionFromEntry(entry: Entry) {
	const r = Array.isArray(entry.return)
		? "[" + entry.return.map(item => `\`${item}\``).join(", ") + "]"
		: `\`${entry.return}\``;

	return [
		`export function ${entry.name}(${entry.args.map(item => item.name + ": " + item.type)}) {`,
		`\treturn ${r};`,
		`}`,
	].join(EOL);
}

export function createExportFromLanguageAndNamespace(language: string, namespace: string) {
	return `export * as ${namespace} from "${prefixes[0]}${language}/${namespace}";`;
}

export function createRegistry(
	defaultLanguage: string,
	languages: string[],
	namespaces: string[],
	prefix = prefixes[0],
) {
	return [
		`export const defaultLanguage: ${JSON.stringify(defaultLanguage)} = ${JSON.stringify(defaultLanguage)};`,
		`export const languages: (${toUnion(languages)})[] = ${JSON.stringify(languages)};`,
		`export const namespaces: (${toUnion(namespaces)})[] = ${JSON.stringify(namespaces)};`,
		"",
		`const modules = {`,
		languages.flatMap(language => [
			`\t${language}: {`,
			namespaces
				.map(namespace => `\t\t${namespace}: async () => import("${prefix}${language}/${namespace}"),`)
				.join(EOL),
			`\t},`,
		]).join(EOL),
		`} as const;`,
		"",
		`export async function importTranslationModule(`,
		`\tlanguage: (typeof languages)[number],`,
		`\tnamespace: (typeof namespaces)[number]`,
		`) {`,
		`\treturn modules[language][namespace]();`,
		`}`,
	].join(EOL);
}
