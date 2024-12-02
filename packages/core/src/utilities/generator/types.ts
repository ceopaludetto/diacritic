import type { ResourceGraph } from "../resource";
import type { DiacriticGenerationOptions, Entry } from "../types";

import { readFile } from "node:fs/promises";
import { EOL } from "node:os";

import { dset } from "dset";

import { createFolderAndFile, prefixes } from "../loader";
import { convertBasedOnFileExtension } from "~/parsers";

/// keep-sorted
type GenerateTypesOptions = {
	defaultLanguage: string;
	generation: DiacriticGenerationOptions;
	languages: string[];
	resourceGraph: ResourceGraph;
};

function toUnion(arr: string[]) {
	return arr.map(item => `"${item}"`).join(" | ");
}

function functionFromEntry(entry: Entry) {
	// explicit ignore Proxy argument
	const args = entry.args.filter(item => item.type !== "Proxy").map(item => item.name + ": " + item.type);
	return `(${args}) => ${Array.isArray(entry.return) ? "string[]" : "string"}`;
}

export async function generateTypes({
	defaultLanguage,
	generation,
	languages,
	resourceGraph,
}: GenerateTypesOptions) {
	const entries = resourceGraph.entriesForLanguage(defaultLanguage);
	const namespaces = resourceGraph.namespaces;

	const declarations: string[] = [...(generation?.banner ?? [])];

	declarations.push(
		`declare module "${prefixes[1]}registry" {`,
		`\texport const defaultLanguage: ${JSON.stringify(defaultLanguage)};`,
		`\texport const languages: (${toUnion(languages)})[];`,
		`\texport const namespaces: (${toUnion(namespaces)})[];`,
		"",
		`\texport type SupportedLanguages = typeof languages;`,
		`\texport type SupportedNamespaces = typeof namespaces;`,
		`}`,
		`declare module "${prefixes[2]}registry" {`,
		`\texport * from "${prefixes[1]}registry";`,
		`}`,
	);

	declarations.push(
		`declare module "${prefixes[1]}proxy" {`,
		`\ttype Proxy = {`,
	);

	for (const [namespace, file] of Object.entries(entries)) {
		const contents = await readFile(file, "utf-8");
		const entries = convertBasedOnFileExtension(contents, file);

		const structure = {};

		for (const entry of entries) dset(structure, entry.path, functionFromEntry(entry));

		declarations.push(
			`\t\t${namespace}: ${JSON.stringify(structure).replace(/"/g, "")};`,
		);
	}

	declarations.push(
		`\t};`,
		`}`,
		`declare module "${prefixes[2]}proxy" {`,
		`\texport * from "${prefixes[1]}proxy";`,
		`}`,
	);

	await createFolderAndFile(generation.outFile, declarations.join(EOL));
}
