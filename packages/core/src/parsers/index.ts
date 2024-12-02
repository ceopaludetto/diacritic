import type { Entry } from "~/utilities/types";

import { extname } from "node:path";

import { parseJSON } from "./json";

export function convertBasedOnFileExtension(contents: string, path: string): Entry[] {
	const ext = extname(path);

	switch (ext) {
		case ".json":
			return parseJSON(contents);
		default:
			throw new Error(`Unsupported file extension [${ext}]`);
	}
}
