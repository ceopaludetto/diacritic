export function capitalizeFirst(str: string) {
	if (!str[0]) return str;
	return str[0].toUpperCase() + str.slice(1);
}

export function toCamelCase(str: string) {
	return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}
