import { describe, expect, it, vi } from "vitest";

import { ResourceGraph } from "~/utilities/resource";

vi.mock("glob", () => ({
	globSync: vi.fn()
		.mockReturnValueOnce(["/src/locales/en/common.json", "/src/locales/en/other.json"])
		.mockReturnValueOnce(["/src/locales/pt/common.json", "/src/locales/pt/other.json"]),
}));

describe("resourceGraph", () => {
	it("should correctly create a resource graph instance", async () => {
		const { globSync } = await import("glob");

		const languages = ["en", "pt"];
		const resources = ["/src/locales/{{language}}/{{namespace}}.json"];

		const resourceGraph = new ResourceGraph(languages, resources);

		expect(globSync).toHaveBeenCalledTimes(2);

		expect(resourceGraph.files).toStrictEqual([
			"/src/locales/en/common.json",
			"/src/locales/en/other.json",
			"/src/locales/pt/common.json",
			"/src/locales/pt/other.json",
		]);

		expect(resourceGraph.entries).toStrictEqual({
			en: {
				common: "/src/locales/en/common.json",
				other: "/src/locales/en/other.json",
			},
			pt: {
				common: "/src/locales/pt/common.json",
				other: "/src/locales/pt/other.json",
			},
		});

		expect(resourceGraph.namespaces).toStrictEqual(["common", "other"]);

		expect(resourceGraph.folders).toStrictEqual([
			"/src/locales/en",
			"/src/locales/pt",
		]);

		expect(resourceGraph.entriesForLanguage("en")).toStrictEqual({
			common: "/src/locales/en/common.json",
			other: "/src/locales/en/other.json",
		});

		expect(resourceGraph.entryForLanguageAndNamespace("en", "common"))
			.toBe("/src/locales/en/common.json");

		expect(resourceGraph.hasFile("/src/locales/en/common.json"))
			.toBeTruthy();

		resourceGraph.addFile("/src/locales/en/another.json", resources);
		expect(resourceGraph.entryForLanguageAndNamespace("en", "another"))
			.toBe("/src/locales/en/another.json");

		resourceGraph.removeFile("/src/locales/en/another.json", resources);
		expect(resourceGraph.entryForLanguageAndNamespace("en", "another")).toBeUndefined();
	});
});
