/* eslint-disable no-template-curly-in-string */
import { describe, expect, it } from "vitest";

import { parseJSON } from "~/parsers/json";

describe("parseJSON", () => {
	it("should correctly parse JSON", () => {
		expect(parseJSON("")).toStrictEqual([]);
		expect(parseJSON("[]")).toStrictEqual([]);
		expect(parseJSON("{}")).toStrictEqual([]);
		expect(parseJSON("invalid json")).toStrictEqual([]);

		expect(parseJSON("{\"hello\": \"world\"}")).toStrictEqual([
			{ name: "hello", args: [{ name: "_root", type: "Proxy" }], path: "hello", return: "world" },
		]);

		expect(parseJSON("{ \"some\": { \"deep\": { \"nested\": \"with args {{a:number}}\" } } }")).toStrictEqual([
			{ name: "someDeepNested", args: [{ name: "_root", type: "Proxy" }, { name: "a", type: "number" }], path: "some.deep.nested", return: "with args ${a}" },
		]);

		expect(parseJSON("{ \"a\": [\"a\", \"b\"] }")).toStrictEqual([
			{ name: "a", args: [{ name: "_root", type: "Proxy" }], path: "a", return: ["a", "b"] },
		]);
	});
});
