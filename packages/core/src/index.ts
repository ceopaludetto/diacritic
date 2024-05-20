import type { diacriticOptions } from "./utilities/types";

import { existsSync, readFileSync } from "node:fs";
import { EOL } from "node:os";

import invariant from "tiny-invariant";
import { createUnplugin } from "unplugin";

import { createConditionalFunctionFromEntry, createExportFromLanguageAndNamespace, createFunctionFromEntry, createImportExport, createImportFromLanguageAndNamespace, createRegistry, generateTypes } from "./utilities/generator";
import {
	extractLanguageAndNamespace,
	isResource,
	isTranslationPath,
	normalizeTranslationPath,
	resourceWithoutPrefix,
} from "./utilities/loader";
import { ResourceGraph } from "./utilities/resource";

export const diacritic = createUnplugin<diacriticOptions>(({
	defaultLanguage,
	generation,
	languages,
	parser,
	resources,
}) => {
	const resourceGraph = new ResourceGraph(languages, resources);
	const processedIDs = new Set<string>();

	return {
		name: "diacritic",
		enforce: "pre",
		buildStart() {
			for (const file of resourceGraph.allFiles()) this.addWatchFile(file);
			generateTypes({ defaultLanguage, generation, parser, resourceGraph });
		},
		watchChange: (id) => {
			if (!isResource(id, resources)) return;
			generateTypes({ defaultLanguage, generation, parser, resourceGraph });
		},
		resolveId: (id) => {
			if (isTranslationPath(id)) return normalizeTranslationPath(id) + ".ts";
			return null;
		},
		loadInclude: id => isTranslationPath(id),
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
			if (extract.mode === "registry") return { code: createRegistry(defaultLanguage, languages) };

			// In the namespace only mode, we want to export a single namespace from all languages.
			// Example:
			// ```ts
			// import * as m from "virtual:translations/common";
			// ```
			if (extract.mode === "namespaceOnly") {
				const { namespace } = extract;

				const files = resourceGraph.allEntriesForLanguageAndNamespace(defaultLanguage, namespace)
					.filter(file => existsSync(file))
					.map(file => readFileSync(file, "utf-8"));

				invariant(files.length > 0, `There's no language resource available [${resource}]`);

				const imports = languages.map(language => createImportFromLanguageAndNamespace(language, namespace));
				imports.push(`import r from "@diacritic/runtime"`);

				const entries = files.flatMap(item => parser.convertFile(item));
				const functions = entries.map(item => createConditionalFunctionFromEntry(defaultLanguage, languages, item));

				return { code: createImportExport(imports, functions) };
			}

			// In the language only mode, we want to export all namespaces from that language.
			// Example:
			// ```ts
			// import * as en from "virtual:translations/en";
			// ```
			if (extract.mode === "languageOnly") {
				const { language } = extract;
				const namespaces = Object.keys(resourceGraph.allEntriesForLanguage(language));

				const exports = namespaces.flatMap(item => createExportFromLanguageAndNamespace(language, item));
				return { code: exports.join(EOL) };
			}

			// In the language and namespace mode, we want to export a single namespace from a language.
			// Example:
			// ```ts
			// import * as m from "virtual:translations/en/common";
			// ```
			if (extract.mode === "languageAndNamespace") {
				const { language, namespace } = extract;

				const files = resourceGraph.allEntriesForLanguageAndNamespace(language, namespace)
					.filter(file => existsSync(file))
					.map(file => readFileSync(file, "utf-8"));

				invariant(files.length > 0, `There's no language resource available [${resource}]`);

				const entries = files.flatMap(item => parser.convertFile(item));
				const functions = entries.map(item => createFunctionFromEntry(parser.interpolation, item));

				return { code: functions.join(EOL) };
			}
		},
		vite: {
			// Manually invalidate virtual module to trigger update on translation file change
			async handleHotUpdate({ server, file }) {
				if (!isResource(file, resources))	return;

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

export * from "./utilities/types";
