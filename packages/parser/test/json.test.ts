/* eslint-disable no-template-curly-in-string */
import { describe, expect, it } from "vitest";

import parserJson from "~/json";

const json = JSON.stringify({
	hello: "world",
	some: { deep: { nest: "content", interpolated: "{ a : number }" } },
	interpolator: "some { value : string }",
	ignore: 16,
	non: false,
	stringOrObject: Symbol.for("abuble"),
	butKeepArrays: [1, false, "string", "another"],
	expansion: "some $t.deep.expansion({ a : number })",
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
			{ name: "hello", path: "hello", args: [{ name: expect.any(String), type: "Proxy" }], return: "world" },
			{ name: "someDeepNest", path: "some.deep.nest", args: [{ name: expect.any(String), type: "Proxy" }], return: "content" },
			{ name: "someDeepInterpolated", path: "some.deep.interpolated", args: [{ name: expect.any(String), type: "Proxy" }, { name: "a", type: "number" }], return: "${a}" },
			{ name: "interpolator", path: "interpolator", args: [{ name: expect.any(String), type: "Proxy" }, { name: "value", type: "string" }], return: "some ${value}" },
			{ name: "butKeepArrays", path: "butKeepArrays", args: [{ name: expect.any(String), type: "Proxy" }], return: ["string", "another"] },
			{ name: "expansion", path: "expansion", args: [{ name: expect.any(String), type: "Proxy" }, { name: "a", type: "number" }], return: expect.stringContaining("deep.expansion(a)") },
		]);
	});
});
