import { describe, expect, it } from "vitest";

import { runCatching } from "~/function";

describe("runCacthing", () => {
	it("should correctly return type success when does not throw", () => {
		const fn = runCatching(() => 10);

		expect(fn).toStrictEqual({
			type: "success",
			value: 10,
		});
	});

	it("should correctly return type failure when does throw", () => {
		const fn = runCatching(() => {
			throw new Error("error");
		});

		expect(fn).toStrictEqual({
			type: "failure",
			error: new Error("runCatching error", { cause: new Error("error") }),
		});
	});
});
