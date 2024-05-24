import type { ResourceGraph } from "../resource";
import type { DiacriticGenerationOptions, Entry, Parser } from "../types";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { EOL } from "node:os";
import { dirname } from "node:path";

import { dset } from "dset";

import { prefixes } from "../loader";

/// keep-sorted
type GenerateTypesOptions = {
	defaultLanguage: string;
	generation: DiacriticGenerationOptions;
	languages: string[];
	namespaces: string[];
	parser: Parser;
	resourceGraph: ResourceGraph;
};

function toUnion(arr: string[]) {
	return arr.map(item => `"${item}"`).join(" | ");
}

function functionFromEntry(entry: Entry) {
	return `(${entry.args.map(item => item.name + ": " + item.type)}) => string`;
}

export function generateTypes({
	defaultLanguage,
	generation,
	languages,
	namespaces,
	parser,
	resourceGraph,
}: GenerateTypesOptions) {
	const entries = resourceGraph.allEntriesForLanguage(defaultLanguage);
	const declarations: string[] = generation?.banner ?? [];

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

	for (const [namespace, files] of Object.entries(entries)) {
		const contents = files.map(file => readFileSync(file, "utf-8")).flatMap(parser.convertFile);
		const structure = {};

		for (const entry of contents) dset(structure, entry.path, functionFromEntry(entry));

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

	const folder = dirname(generation.outFile);
	if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

	writeFileSync(generation.outFile, declarations.join(EOL), "utf-8");
}
