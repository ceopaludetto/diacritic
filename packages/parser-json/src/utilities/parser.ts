import type { Entry } from "@diacritic/core";

import { capitalizeFirst } from "@diacritic/utilities";
import invariant from "tiny-invariant";

export function functionName(parent: string[], key: string) {
	return [...parent, key].reduce((acc, item, index) => {
		if (index === 0) return acc + item;
		return acc + capitalizeFirst(item);
	}, "");
}

const regex = /\{\{\s*(\w+)\s*\|\s*(\w+)\s*\}\}/g;

export function extractArgumentsFromString(value: string): Entry["args"] {
	const matches = value.matchAll(regex);

	const args: Entry["args"] = [];
	for (const match of matches) {
		const [, name, type] = match;
		invariant(name && type, `Unknown name (${name}) or type (${type}) of variable`);

		args.push({ name: name.trim(), type: type.trim() });
	}

	return args;
}
