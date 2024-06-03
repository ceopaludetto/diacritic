import type { MetroDiacriticOptions } from "./utilities/metro/transformer";
import type { IntermediateConfigT, TransformerConfigT } from "metro-config";

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";

import { generateTypes } from "./utilities/generator";
import { isTranslationPath, normalizeTranslationPath } from "./utilities/loader";
import { ResourceGraph } from "./utilities/resource";

export type ComposableTransformerConfigT = TransformerConfigT & {
	transformerPath?: string;
	diacriticOptions?: MetroDiacriticOptions;
} & Record<string, unknown>;

export type ComposableIntermediateConfigT = IntermediateConfigT & {
	transformer: ComposableTransformerConfigT;
};

export function withDiacritic(
	configuration: ComposableIntermediateConfigT,
	options: Omit<MetroDiacriticOptions, "resourceGraph">,
): ComposableIntermediateConfigT {
	const tmp = resolve(tmpdir(), "metro-virtual-modules-diacritic");
	const resourceGraph = new ResourceGraph(options.languages, options.resources);

	generateTypes({
		defaultLanguage: options.defaultLanguage,
		generation: options.generation,
		languages: options.languages,
		// eslint-disable-next-line ts/no-var-requires, ts/no-require-imports
		parser: require(options.parserPath).default(),
		resourceGraph,
	});

	const nextResolveRequest = configuration.resolver?.resolveRequest;
	const resolveRequest: IntermediateConfigT["resolver"]["resolveRequest"] = (context, moduleName, platform) => {
		if (isTranslationPath(moduleName)) {
			const normalized = normalizeTranslationPath(moduleName) + ".ts";
			const modulePath = resolve(tmp, "." + normalized);

			const folder = dirname(modulePath);
			if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
			if (!existsSync(modulePath)) writeFileSync(modulePath, "{}");

			return { filePath: modulePath, type: "sourceFile" };
		}

		return (nextResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
	};

	return {
		...configuration,
		resolver: {
			...configuration.resolver,
			resolveRequest,
		},
		transformerPath: new URL("./utilities/metro/transformer.ts", import.meta.url).pathname,
		transformer: {
			...configuration.transformer,
			diacriticOptions: { reactNative: true, ...options, resourceGraph: resourceGraph.allEntries() },
			transformerPath: configuration.transformerPath,
		},
	};
}
