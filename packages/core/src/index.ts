import type { DiacriticOptions } from "./utilities/types";

import { existsSync, readFileSync } from "node:fs";
import { EOL } from "node:os";

import invariant from "tiny-invariant";
import { createUnplugin } from "unplugin";

import { convertBasedOnFileExtension } from "./parsers";
import { createExportFromLanguageAndNamespace, createFunctionFromEntry, createRegistry, generateTypes } from "./utilities/generator";
import {
	extractLanguageAndNamespace,
	isTranslationPath,
	normalizeTranslationPath,
	resourceWithoutPrefix,
} from "./utilities/loader";
import { ResourceGraph } from "./utilities/resource";
import { watchResources } from "./utilities/watcher";

export const diacritic = createUnplugin<DiacriticOptions>(({
	defaultLanguage,
	generation,
	languages,
	resources,
}, meta) => {
	const resourceGraph = new ResourceGraph(languages, resources);
	const processedIDs = new Set<string>();

	let unsubscribe!: () => Promise<void[]>;

	return {
		name: "diacritic",
		enforce: "pre",
		async buildStart() {
			if (meta.framework !== "esbuild") {
				for (const file of resourceGraph.files) this.addWatchFile(file);
			}

			unsubscribe = await watchResources({
				resourceGraph,
				resources,
				onChange: async () => generateTypes({ defaultLanguage, generation, languages, resourceGraph }),
			});
		},
		async buildEnd() {
			await unsubscribe?.();
		},
		resolveId: (id) => {
			if (isTranslationPath(id)) return normalizeTranslationPath(id) + ".ts";
			return null;
		},
		loadInclude: (id) => {
			return isTranslationPath(id);
		},
		load: (id) => {
			// Keep track of processed ids to use below
			processedIDs.add(id);

			const resource = resourceWithoutPrefix(id);
			const extract = extractLanguageAndNamespace(languages, id);

			// In the registry mode, we want to export the default language as well the supported languages.
			// Example:
			// ```ts
			// import { defaultLanguage, languages } from "virtual:translations/registry";
			// ```
			if (extract.mode === "registry")
				return { code: createRegistry(defaultLanguage, languages, resourceGraph.namespaces) };

			// In the language only mode, we want to export all namespaces from that language.
			// Example:
			// ```ts
			// import * as en from "virtual:translations/en";
			// ```
			if (extract.mode === "languageOnly") {
				const { language } = extract;
				const namespaces = Object.keys(resourceGraph.entriesForLanguage(language));

				const exports = namespaces.flatMap(item => createExportFromLanguageAndNamespace(language, item));
				return { code: exports.join(EOL) };
			}

			// In the language and namespace mode, we want to export a single namespace from a language.
			// Example:
			// ```ts
			// import * as t from "virtual:translations/en/common";
			// ```
			if (extract.mode === "languageAndNamespace") {
				const { language, namespace } = extract;

				const file = resourceGraph.entryForLanguageAndNamespace(language, namespace);

				invariant(!!file && existsSync(file), `There's no language resource available [${resource}]`);
				const content = readFileSync(file, "utf-8");

				const entries = convertBasedOnFileExtension(content, file);
				const functions = entries.map(item => createFunctionFromEntry(item));

				return { code: functions.join(EOL) };
			}
		},
		vite: {
			// Manually invalidate virtual module to trigger update on translation file change
			async handleHotUpdate({ server, file }) {
				if (!resourceGraph.hasFile(file))	return;

				for (const id of processedIDs) {
					const module = server.moduleGraph.getModuleById(id);
					server.moduleGraph.invalidateModule(module!);
				}

				server.hot.send({ type: "full-reload" });

				return [];
			},
		},
	};
});

export * from "./parsers";

export * from "./utilities/configuration";
export * from "./utilities/generator";
export * from "./utilities/loader";
export * from "./utilities/resource";
export * from "./utilities/types";
export * from "./utilities/watcher";
