import type { Entry, Parser } from "@diacritic/core";

import { toCamelCase } from "@diacritic/utilities";

import { nanoid } from "./utilities/nanoid";
import { extractArgumentsFromString, functionName, transformReturnFromString } from "./utilities/parser";

function parseContent(content: Record<string, any>, parent: string[] = []): Entry[] {
	return Object.entries(content)
		.reduce<Entry[]>((acc, [key, value]) => {
			if (typeof value === "object") {
				if (Array.isArray(value)) {
					const onlyStrings = value.filter(item => typeof item === "string");

					const name = functionName(parent, key);
					const args = onlyStrings.flatMap(extractArgumentsFromString);

					const proxyName = nanoid();
					args.unshift({ name: proxyName, type: "Proxy" });

					const strs = onlyStrings.map(item => transformReturnFromString(proxyName, item));
					const fn = { name, path: [...parent, toCamelCase(key)].join("."), args, return: strs };

					return [...acc, fn];
				}

				return [...acc, ...parseContent(value, [...parent, toCamelCase(key)])];
			}

			if (typeof value === "string") {
				const name = functionName(parent, key);
				const args = extractArgumentsFromString(value);

				const proxyName = nanoid();
				args.unshift({ name: proxyName, type: "Proxy" });

				const str = transformReturnFromString(proxyName, value);
				const fn = { name, path: [...parent, toCamelCase(key)].join("."), args, return: str };

				return [...acc, fn];
			}

			return acc;
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
