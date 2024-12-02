import { describe, expect, it, vi } from "vitest";

import { convertBasedOnFileExtension } from "~/parsers";

vi.mock("~/parsers/json", () => ({
	parseJSON: vi.fn().mockReturnValueOnce([]),
}));

describe("convertBasedOnFileExtension", () => {
	it("should correctly convert based on file extension", async () => {
		const { parseJSON } = await import("~/parsers/json");

		const contents = "{}";
		const path = "file.json";

		const entries = convertBasedOnFileExtension(contents, path);

		expect(entries).toStrictEqual([]);
		expect(parseJSON).toHaveBeenCalledTimes(1);
	});

	it("should throw if the file extension is not supported", () => {
		const contents = "{}";
		const path = "file.txt";

		expect(() => convertBasedOnFileExtension(contents, path))
			.toThrow("Unsupported file extension [.txt]");
	});
});
