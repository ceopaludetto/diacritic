import type { ResourceGraph } from "./resource";
import type { diacriticGenerationOptions, Entry, Parser } from "./types";

import { readFileSync, writeFileSync } from "node:fs";
import { EOL } from "node:os";

import { prefixes } from "./loader";

export function createFunctionFromEntry(interpolation: Parser["interpolation"], entry: Entry) {
	const interpolators = interpolation.map(side => side.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const regex = new RegExp(`${interpolators[0]}\\s*(\\w+)\\s*\\|\\s*[\\w\\s]*\\s*${interpolators[1]}`, "g");

	return [
		`export function ${entry.name}(${entry.args.map(item => item.name + ": " + item.type)}) {`,
		`\treturn \`${entry.return.replace(regex, (_, content) => `\${${content}}`)}\`;`,
		`}`,
	].join(EOL);
}

export function createExportFromLanguageAndNamespace(language: string, namespace: string) {
	return `export * as ${namespace} from "${prefixes[0]}${language}/${namespace}";`;
}

export function createImportFromLanguageAndNamespace(language: string, namespace: string) {
	return `import * as ${language} from "${prefixes[0]}${language}/${namespace}";`;
}

export function createConditionalFunctionFromEntry(defaultLanguage: string, languages: string[], entry: Entry) {
	const cases = languages
		.flatMap((language, index) => {
			const fallback = language !== defaultLanguage
				? `?? ${defaultLanguage}?.${entry.name}?.(${entry.args.map(item => item.name).join(", ")})`
				: "";

			return [
				index === 0 ? `\t\tcase "${language}":` : `\t\tcase "${language}":`,
				`\t\t\treturn ${language}?.${entry.name}?.(${entry.args.map(item => item.name).join(", ")})${fallback}`,
			];
		})
		.join(EOL);

	return [
		`export function ${entry.name}(${entry.args.map(item => item.name + ": " + item.type)}) {`,
		`\tswitch (r.language()) {`,
		`${cases}`,
		`\t}`,
		`}`,
	].join(EOL);
}

export function createImportExport(imports: string[], exports: string[]) {
	return [...imports, "", ...exports].join(EOL);
}

export function createTypesFromEntry(entry: Entry) {
	return `export function ${entry.name}(${entry.args.map(item => item.name + ": " + item.type).join(", ")}): string;`;
}

export function createRegistry(defaultLanguage: string, languages: string[]) {
	return [
		`export const defaultLanguage: string = ${JSON.stringify(defaultLanguage)};`,
		`export const languages: string[] = ${JSON.stringify(languages)};`,
	].join(EOL);
}

/// keep-sorted
type GenerateTypesOptions = {
	defaultLanguage: string;
	generation: diacriticGenerationOptions;
	parser: Parser;
	resourceGraph: ResourceGraph;
};

export function generateTypes({ defaultLanguage, generation, parser, resourceGraph }: GenerateTypesOptions) {
	const entries = resourceGraph.allEntries();
	const declarations: string[] = generation?.banner ?? [];

	for (const [language, namespaces] of Object.entries(entries)) {
		for (const [namespace, files] of Object.entries(namespaces)) {
			const content = files.map(file => readFileSync(file, "utf-8"));

			const functions = content.flatMap(item => parser.convertFile(item)).map(item => "\t" + createTypesFromEntry(item));

			declarations.push(
				`declare module "${prefixes[1]}${language}/${namespace}" {`,
				`${functions.join(EOL)}`,
				`}`,
				`declare module "${prefixes[2]}${language}/${namespace}" {`,
				`\texport * from "${prefixes[1]}${language}/${namespace}";`,
				`}`,
			);

			if (language === defaultLanguage) {
				declarations.push(
					`declare module "${prefixes[1]}${namespace}" {`,
					`\texport * from "${prefixes[1]}${language}/${namespace}";`,
					`}`,
					`declare module "${prefixes[2]}${namespace}" {`,
					`\texport * from "${prefixes[1]}${namespace}";`,
					`}`,
				);
			}
		}

		const exports = Object.keys(namespaces).map(namespace => `\texport * as ${namespace} from "${prefixes[1]}${language}/${namespace}";`);
		declarations.push(
			`declare module "${prefixes[1]}${language}" {`,
			`${exports.join(EOL)}`,
			`}`,
			`declare module "${prefixes[2]}${language}" {`,
			`\texport * from "${prefixes[1]}${language}";`,
			`}`,
		);
	}

	writeFileSync(generation.outFile, declarations.join(EOL), "utf-8");
}
