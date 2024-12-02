import type { DiacriticOptions } from "./types";

import { loadConfig } from "unconfig";

export async function loadConfiguration() {
	const { config } = await loadConfig({
		sources: [
			{
				files: "diacritic.config",
				extensions: ["ts", "mts", "cts", "js", "mjs", "cjs", "json", ""],
			},
		],
		merge: false,
	});

	return config as DiacriticOptions;
}
