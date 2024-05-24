import { describe, expect, it } from "vitest";

import { extractArgumentsFromString, functionName } from "~/utilities/parser";

describe("functionName", () => {
	it("should correctly create a function name based on keys", () => {
		expect(functionName([], "hello")).toBe("hello");
		expect(functionName(["hello"], "world")).toBe("helloWorld");
		expect(functionName(["hello", "another"], "world")).toBe("helloAnotherWorld");
	});
});

describe("extractArgumentsFromString", () => {
	it("should correctly extract arguments from string", () => {
		expect(extractArgumentsFromString("string with no args")).toStrictEqual([]);
		expect(extractArgumentsFromString("string with {one:number} arg"))
			.toStrictEqual([{ name: "one", type: "number" }]);

		// Array (maybe?) should not be supported
		expect(extractArgumentsFromString("{string:string } with {       various : number } { args:  string[] }"))
			.toStrictEqual([
				{ name: "string", type: "string" },
				{ name: "various", type: "number" },
			]);
	});
});
