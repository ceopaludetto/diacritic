import type { Entry } from "~/utilities/types";

import { runCatching, toCamelCase } from "@diacritic/utilities";

import { extractArgumentsFromString, functionName, transformReturnFromString } from "~/utilities/parser";

function parseContent(content: unknown, parent: string[] = []): Entry[] {
	if (typeof content !== "object" || content === null) return [];

	return Object.entries(content)
		.reduce<Entry[]>((acc, [key, value]) => {
			if (typeof value === "object") {
				if (Array.isArray(value)) {
					const onlyStrings = value.filter(item => typeof item === "string");

					const name = functionName(parent, key);
					const args = onlyStrings.flatMap(extractArgumentsFromString);

					const proxyName = "_root";
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

				const proxyName = "_root";
				args.unshift({ name: proxyName, type: "Proxy" });

				const str = transformReturnFromString(proxyName, value);
				const fn = { name, path: [...parent, toCamelCase(key)].join("."), args, return: str };

				return [...acc, fn];
			}

			return acc;
		}, []);
}

export function parseJSON(content: string): Entry[] {
	const res = runCatching(() => JSON.parse(content));
	if (res.type === "failure") return [];

	return parseContent(res.value);
}
