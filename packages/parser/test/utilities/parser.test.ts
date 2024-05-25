/* eslint-disable no-template-curly-in-string */
import { describe, expect, it } from "vitest";

import { extractArgumentsFromString, functionName, transformReturnFromString } from "~/utilities/parser";

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

describe("transformReturnFromString", () => {
	it("should correctly transform return from string", () => {
		const proxyName = "proxy";

		expect(transformReturnFromString(proxyName, "string with no args")).toBe("string with no args");
		expect(transformReturnFromString(proxyName, "string with {one: arg}")).toBe("string with ${one}");
		expect(transformReturnFromString(proxyName, "string with $t.expansion()")).toBe("string with ${proxy.expansion()}");
		expect(transformReturnFromString(proxyName, "string with $t.expansion({some: arg}, {another: arg})")).toBe("string with ${proxy.expansion(some, another)}");
		expect(transformReturnFromString(proxyName, "$t.expansion")).toBe("$t.expansion");
		expect(transformReturnFromString(proxyName, "$t")).toBe("$t");
		expect(transformReturnFromString(proxyName, "$t()")).toBe("$t()");
		expect(transformReturnFromString(proxyName, "$t.")).toBe("$t.");
		expect(transformReturnFromString(proxyName, "$t.expansion({")).toBe("$t.expansion({");
		expect(transformReturnFromString(proxyName, "$t.expansion({})")).toBe("$t.expansion({})");
		expect(transformReturnFromString(proxyName, "$t.expansion({name})")).toBe("$t.expansion({name})");
		expect(transformReturnFromString(proxyName, "$t.expansion({name:})")).toBe("${proxy.expansion()}");
	});
});
