import type { Entry, Parser } from "@diacritic/core";

import { extractArgumentsFromString, functionName } from "./utilities/parser";

function parseContent(content: Record<string, any>, parent: string[] = []): Entry[] {
	return Object.entries(content)
		.reduce<Entry[]>((acc, [key, value]) => {
			if (typeof value !== "string" && (typeof value !== "object" || Array.isArray(value))) return acc;
			if (typeof value === "object") return [...acc, ...parseContent(value, [...parent, key])];

			const name = functionName(parent, key);
			const args = extractArgumentsFromString(value);

			const fn = { name, path: [...parent, key].join("."), args, return: value };

			return [...acc, fn];
		}, []);
}

function convertFile(file: string): Entry[] {
	try {
		const content = JSON.parse(file);
		return parseContent(content);
	} catch {
		return [];
	}
}

export default function parserJson(): Parser {
	return { name: "diacritic-json", interpolation: ["{", "}"], convertFile };
}
