import { describe, expect, it } from "bun:test";

import { capitalizeFirst, toCamelCase } from "~/string";

describe("capitalizeFirst", () => {
	it("should correctly capitalize the first letter", () => {
		expect(capitalizeFirst("carlos")).toBe("Carlos");
	});
});

describe("toCamelCase", () => {
	it("should correctly convert a string to camel case", () => {
		expect(toCamelCase("carlos-eduardo")).toBe("carlosEduardo");
		expect(toCamelCase("carlos_eduardo")).toBe("carlosEduardo");
		expect(toCamelCase("carlosEduardo")).toBe("carlosEduardo");
	});
});
