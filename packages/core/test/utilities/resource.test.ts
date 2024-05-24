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

		expect(resourceGraph.allNamespaces()).toStrictEqual(["common", "other"]);
		expect(resourceGraph.hasFile("/src/locales/en/common.json")).toBe(true);

		resourceGraph.addFile("/src/locales/en/another.json", resources);
		expect(resourceGraph.allEntriesForLanguageAndNamespace("en", "another")).toStrictEqual([
			"/src/locales/en/another.json",
		]);

		resourceGraph.removeFile("/src/locales/en/another.json", resources);
		expect(resourceGraph.allEntriesForLanguageAndNamespace("en", "another")).toStrictEqual([]);
	});
});
