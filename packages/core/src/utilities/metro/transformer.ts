/* eslint-disable ts/no-var-requires, ts/no-require-imports */
import type { DiacriticOptions, Parser } from "../types";
import type { JsTransformOptions, JsTransformerConfig, TransformResponse } from "metro-transform-worker";

import { existsSync, readFileSync } from "node:fs";
import { EOL } from "node:os";
import { fileURLToPath } from "node:url";

import worker from "metro-transform-worker";
import invariant from "tiny-invariant";

import { createExportFromLanguageAndNamespace, createFunctionFromEntry, createRegistry } from "../generator";
import { extractLanguageAndNamespace, isTranslationPath, resourceWithoutPrefix } from "../loader";

export type MetroDiacriticOptions = Omit<DiacriticOptions, "parser"> & {
	parserPath: string;
	resourceGraph: Record<string, Record<string, string[]>>;
};

export type DiacriticTransformerConfig = JsTransformerConfig & {
	transformerPath?: string;
	diacriticOptions: MetroDiacriticOptions;
};

export async function transform(
	configuration: DiacriticTransformerConfig,
	projectRoot: string,
	filename: string,
	data: Buffer | string,
	options: JsTransformOptions,
): Promise<TransformResponse> {
	const transformer = configuration.transformerPath && configuration.transformerPath !== fileURLToPath(import.meta.url)
		? require(configuration.transformerPath).transform
		: worker.transform;

	if (!filename.includes("metro-virtual-modules-diacritic"))
		return transformer(configuration, projectRoot, filename, data, options);

	const [, modulePath] = filename.split("metro-virtual-modules-diacritic");

	if (!isTranslationPath(modulePath!))
		return transformer(configuration, projectRoot, filename, data, options);

	const parser: Parser = (await import(configuration.diacriticOptions.parserPath)).default();
	const { diacriticOptions } = configuration;

	const extraction = extractLanguageAndNamespace(diacriticOptions.languages, modulePath!);
	const namespaces = [...new Set(Object.values(diacriticOptions.resourceGraph).flatMap(value => Object.keys(value)))];

	if (extraction.mode === "registry") {
		const data = createRegistry(
			diacriticOptions.defaultLanguage,
			diacriticOptions.languages,
			namespaces,
			diacriticOptions.reactNative,
		);

		return worker.transform(configuration, projectRoot, filename, Buffer.from(data), options);
	}

	if (extraction.mode === "languageOnly") {
		const { language } = extraction;
		const namespaces = Object.keys(diacriticOptions.resourceGraph[language] ?? {});

		const exports = namespaces.flatMap(item => createExportFromLanguageAndNamespace(language, item));
		return worker.transform(configuration, projectRoot, filename, Buffer.from(exports.join(EOL)), options);
	}

	if (extraction.mode === "languageAndNamespace") {
		const { language, namespace } = extraction;

		const files = (diacriticOptions.resourceGraph[language]?.[namespace] ?? [])
			.filter(file => existsSync(file))
			.map(file => readFileSync(file, "utf-8"));

		const resource = resourceWithoutPrefix(modulePath!);
		invariant(files.length > 0, `There's no language resource available [${resource}]`);

		const entries = files.flatMap(item => parser.convertFile(item));
		const functions = entries.map(item => createFunctionFromEntry(item));

		return worker.transform(configuration, projectRoot, filename, Buffer.from(functions.join(EOL)), options);
	}

	return transformer(configuration, projectRoot, filename, Buffer.from(data), options);
}
