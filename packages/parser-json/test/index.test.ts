import { describe, expect, it } from "bun:test";

import parserJson from "~/index";

const json = JSON.stringify({
	hello: "world",
	some: { deep: { nest: "content", interpolated: "{{ a | number }}" } },
	interpolator: "some {{ value | string }}",
	ignore: 16,
	non: false,
	stringOrObject: [""],
});

describe("parseJson", () => {
	it("should correctly create a json parser", () => {
		const parser = parserJson();
		expect(parser).toStrictEqual({
			name: "diacritic-json",
			interpolation: ["{{", "}}"],
			convertFile: expect.anything(),
		});
	});

	it("should correctly parse a json content into function entries", () => {
		const parser = parserJson();
		expect(parser.convertFile(json)).toStrictEqual([
			{ name: "hello", args: [], return: "world" },
			{ name: "someDeepNest", args: [], return: "content" },
			{ name: "someDeepInterpolated", args: [{ name: "a", type: "number" }], return: "{{ a | number }}" },
			{ name: "interpolator", args: [{ name: "value", type: "string" }], return: "some {{ value | string }}" },
		]);
	});

	it("should throw if json is invalid", () => {
		const parser = parserJson();
		expect(() => parser.convertFile("random shit")).toThrow("JSON Parse error: Unexpected identifier \"random\"");
	});
});
