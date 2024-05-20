import { describe, expect, it } from "bun:test";

import { capitalizeFirst } from "~/string";

describe("capitalizeFirst", () => {
	it("should correctly capitalize the first letter", () => {
		expect(capitalizeFirst("carlos")).toBe("Carlos");
	});
});
