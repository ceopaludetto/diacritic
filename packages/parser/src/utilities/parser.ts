import type { Entry } from "@diacritic/core";

import { capitalizeFirst, toCamelCase } from "@diacritic/utilities";
import invariant from "tiny-invariant";

export function functionName(parent: string[], key: string) {
	return [...parent, key].reduce((acc, item, index) => {
		if (index === 0) return acc + toCamelCase(item);
		return acc + capitalizeFirst(toCamelCase(item));
	}, "");
}

// Match {name:type} or {name: type} or { name: type }
const argumentRegex = /\{\s*(\w+)\s*:\s*(\w+)\s*\}/g;

// Match $t.some.deep.random.name({name:type})
const expansionRegex = /\$t\.(\w+(?:\.\w+)*)(\(\s*(?:(\{[^{}:]*:[^{}]*\}(?:\s*,\s*\{[^{}:]*:[^{}]*\})*)+\s*)?\))/g;

export function extractArgumentsFromString(value: string): Entry["args"] {
	const matches = value.matchAll(argumentRegex);

	const args: Entry["args"] = [];
	for (const match of matches) {
		const [, name, type] = match;
		invariant(name && type, `Unknown name (${name}) or type (${type}) of variable`);

		args.push({ name: name.trim(), type: type.trim() });
	}

	return args;
}

export function transformReturnFromString(proxyName: string, value: string): string {
	let current = value;

	for (const match of value.matchAll(expansionRegex)) {
		const [content, path, , variables] = match;
		const args = variables ? extractArgumentsFromString(variables) : [];

		current = value.replace(content, `\${${proxyName}.${path}(${args.map(item => item.name).join(", ")})}`);
	}

	return current.replace(argumentRegex, (_, name) => `\${${name}}`);
}
