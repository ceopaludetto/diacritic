import type { DiacriticGenerationOptions, DiacriticOptions } from "./utilities/types";

import { existsSync, readFileSync } from "node:fs";
import { EOL } from "node:os";
import { dirname, resolve } from "node:path";

import { createFunctionFromEntry, createRegistry, generateTypes } from "./utilities/generator";
import { createFolderAndFile } from "./utilities/loader";
import { ResourceGraph } from "./utilities/resource";
import { watchResources } from "./utilities/watcher";

type StartDiacriticOptions = DiacriticOptions & {
	runtimeGeneration: DiacriticGenerationOptions;
};

export async function startDiacritic({
	defaultLanguage,
	generation,
	languages,
	parser,
	resources,
	runtimeGeneration,
}: StartDiacriticOptions) {
	const resourceGraph = new ResourceGraph(languages, resources);

	const unsubscribe = await watchResources({
		resourceGraph,
		resources,
		onChange: async (event) => {
			const shouldCreateRegistry = !event || event.type === "create" || event.type === "delete";

			await generateTypes({ defaultLanguage, generation, languages, parser, resourceGraph });

			if (shouldCreateRegistry) {
				const registry = createRegistry(defaultLanguage, languages, resourceGraph.allNamespaces(), "./");
				await createFolderAndFile(runtimeGeneration.outFile, registry);
			}

			for (const language of languages) {
				for (const namespace of resourceGraph.allNamespaces()) {
					const files = resourceGraph.allEntriesForLanguageAndNamespace(language, namespace)
						.filter(file => existsSync(file))
						.map(file => readFileSync(file, "utf-8"));

					const entries = files.flatMap(item => parser.convertFile(item));
					const functions = entries.map(item => createFunctionFromEntry(item));

					functions.unshift(
						...(runtimeGeneration?.banner ?? []),
						`import type { Proxy } from "@diacritic/runtime"`,
						"",
					);

					const dir = dirname(runtimeGeneration.outFile);
					const out = resolve(dir, `${language}/${namespace}.ts`);

					await createFolderAndFile(out, functions.join(EOL));
				}
			}
		},
	});

	process.on("SIGINT", async () => unsubscribe());
	process.on("SIGTERM", async () => unsubscribe());
}
