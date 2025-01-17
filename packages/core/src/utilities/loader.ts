import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import invariant from "tiny-invariant";

export const prefixes = ["/~translations/", "~translations/", "virtual:translations/",	"virtual/translations/"];

const translationPathRegex = new RegExp(prefixes.map(prefix => "^" + prefix).join("|"));
const languageAndNamespaceRegex = new RegExp(prefixes[0]! + "([\\w]+)\\/?([\\w]*)");

export function isTranslationPath(path: string) {
	return translationPathRegex.test(path);
}

export function normalizeTranslationPath(path: string) {
	return path.replace(translationPathRegex, prefixes[0]!);
}

export function extractLanguageAndNamespace(languages: string[], path: string) {
	const match = path.match(languageAndNamespaceRegex);
	invariant(Array.isArray(match), "Invalid supplied path");

	const [, first, second] = match;
	invariant(first, "At least one sub path should be available");

	if (first === "registry") return { mode: "registry" } as const;

	if (languages.includes(first)) {
		if (second) return { language: first, namespace: second, mode: "languageAndNamespace" } as const;
		return { language: first, mode: "languageOnly" } as const;
	}

	throw new Error(`Language ${first} is not supported`);
}

export function resourceWithoutPrefix(path: string) {
	return path.replace(prefixes[0]!, "");
}

export async function createFolderAndFile(path: string, content: string) {
	const folder = dirname(path);
	if (!existsSync(folder)) await mkdir(folder, { recursive: true });

	await writeFile(path, content, "utf-8");
}
