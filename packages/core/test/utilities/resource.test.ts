import { describe, expect, it, mock } from "bun:test";

import { ResourceGraph } from "~/utilities/resource";

describe("resourceGraph", () => {
	it("should correctly create a resource graph instance", () => {
		const globSync = mock();
		mock.module("glob", () => ({
			globSync: globSync
				.mockReturnValueOnce(["/src/locales/en/common.json", "/src/locales/en/other.json"])
				.mockReturnValueOnce(["/src/locales/pt/common.json", "/src/locales/pt/other.json"]),
		}));

		const languages = ["en", "pt"];
		const resources = ["/src/locales/{{language}}/*.json"];

		const resourceGraph = new ResourceGraph(languages, resources);

		expect(globSync).toHaveBeenCalledTimes(2);

		expect(resourceGraph.allFiles()).toStrictEqual([
			"/src/locales/en/common.json",
			"/src/locales/en/other.json",
			"/src/locales/pt/common.json",
			"/src/locales/pt/other.json",
		]);

		expect(resourceGraph.allEntriesForLanguage("en")).toStrictEqual({
			common: ["/src/locales/en/common.json"],
			other: ["/src/locales/en/other.json"],
		});

		expect(resourceGraph.allEntriesForLanguageAndNamespace("en", "common")).toStrictEqual([
			"/src/locales/en/common.json",
		]);
	});
});
