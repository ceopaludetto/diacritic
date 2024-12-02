#!/bin/env node
import type { DiacriticOptions } from "@diacritic/core";
import type { TypeOf } from "@drizzle-team/brocli";

import { existsSync, readFileSync } from "node:fs";
import { EOL } from "node:os";
import { dirname, resolve } from "node:path";

import {
	convertBasedOnFileExtension,
	createFolderAndFile,
	createFunctionFromEntry,
	createRegistry,
	generateTypes,
	loadConfiguration,
	ResourceGraph,
	watchResources,
} from "@diacritic/core";
import { command, run, string } from "@drizzle-team/brocli";

import { version } from "../package.json";

const options = {
	outFile: string().desc("output file for the generated registry").required().alias("o"),
	banner: string().desc("banner to prepend to the generated registry").alias("b"),
} as const;

async function generate(
	{ defaultLanguage, generation, languages }: DiacriticOptions,
	{ banner, outFile }: TypeOf<typeof options>,
	resourceGraph: ResourceGraph,
	shouldCreateRegistry: boolean,
) {
	await generateTypes({ defaultLanguage, generation, languages, resourceGraph });

	if (shouldCreateRegistry) {
		const registry = createRegistry(defaultLanguage, languages, resourceGraph.namespaces, "./");
		await createFolderAndFile(outFile, registry);
	}

	for (const language of languages) {
		for (const namespace of resourceGraph.namespaces) {
			const file = resourceGraph.entryForLanguageAndNamespace(language, namespace);
			if (!file || !existsSync(file)) continue;

			const contents = readFileSync(file, "utf-8");
			const entries = convertBasedOnFileExtension(contents, file);

			const functions = entries.map(item => createFunctionFromEntry(item));

			if (banner) functions.unshift(banner, "");

			functions.unshift(
				`import type { Proxy } from "@diacritic/runtime"`,
				"",
			);

			const dir = dirname(outFile);
			const out = resolve(dir, `${language}/${namespace}.ts`);

			await createFolderAndFile(out, functions.join(EOL));
		}
	}
}

const build = command({
	name: "build",
	aliases: ["b"],
	options,
	handler: async (options) => {
		const configuration = await loadConfiguration();
		const resourceGraph = new ResourceGraph(configuration.languages, configuration.resources);

		await generate(configuration, options, resourceGraph, true);
	},
});

const watch = command({
	name: "watch",
	aliases: ["w"],
	options,
	handler: async (options) => {
		const configuration = await loadConfiguration();
		const resourceGraph = new ResourceGraph(configuration.languages, configuration.resources);

		const unsubscribe = await watchResources({
			resourceGraph,
			resources: configuration.resources,
			onChange: async (event) => {
				const shouldCreateRegistry = !event || event.type === "create" || event.type === "delete";

				await generate(configuration, options, resourceGraph, shouldCreateRegistry);
			},
		});

		process.on("SIGINT", async () => {
			await unsubscribe?.();
			process.exit(0);
		});

		process.on("SIGTERM", async () => {
			await unsubscribe?.();
			process.exit(0);
		});

		process.on("exit", async () => {
			await unsubscribe?.();
		});
	},
});

run([build, watch], {
	name: "diacritic",
	description: "Dead simple i18n solution",
	version,
});
