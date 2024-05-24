/* eslint-disable no-template-curly-in-string */
import { describe, expect, it } from "bun:test";

import parserJson from "~/json";

const json = JSON.stringify({
	hello: "world",
	some: { deep: { nest: "content", interpolated: "{ a : number }" } },
	interpolator: "some { value : string }",
	ignore: 16,
	non: false,
	stringOrObject: [""],
});

describe("parseJson", () => {
	it("should correctly create a json parser", () => {
		const parser = parserJson();
		expect(parser).toStrictEqual({
			name: "diacritic-json",
			interpolation: ["{", "}"],
			convertFile: expect.anything(),
		});
	});

	it("should correctly parse a json content into function entries", () => {
		const parser = parserJson();
		expect(parser.convertFile(json)).toStrictEqual([
			{ name: "hello", path: "hello", args: [], return: "world" },
			{ name: "someDeepNest", path: "some.deep.nest", args: [], return: "content" },
			{ name: "someDeepInterpolated", path: "some.deep.interpolated", args: [{ name: "a", type: "number" }], return: "${a}" },
			{ name: "interpolator", path: "interpolator", args: [{ name: "value", type: "string" }], return: "some ${value}" },
		]);
	});
});
