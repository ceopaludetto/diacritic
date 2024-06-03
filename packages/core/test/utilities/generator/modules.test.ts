/* eslint-disable no-template-curly-in-string */
import type { Entry } from "~/utilities/types";

import { describe, expect, it } from "vitest";

import { createExportFromLanguageAndNamespace, createFunctionFromEntry, createRegistry } from "~/utilities/generator/modules";

describe("createFunctionFromEntry", () => {
	it("should create a function from an entry correctly", () => {
		const entry: Entry = {
			name: "hello",
			path: "hello",
			args: [{ name: "name", type: "string" }],
			return: "Hello, ${name}!",
		};

		expect(createFunctionFromEntry(entry)).toMatchSnapshot();
	});
});

describe("createExportFromLanguageAndNamespace", () => {
	it("should create a export from language and namespace correctly", () => {
		expect(createExportFromLanguageAndNamespace("en", "common")).toMatchSnapshot();
	});
});

describe("createRegistry", () => {
	it("should create a registry correctly", () => {
		expect(createRegistry("en", ["en", "pt"], ["common", "zod"])).toMatchSnapshot();
	});

	it("should create a registry for react-native correctly", () => {
		expect(createRegistry("en", ["en", "pt"], ["common", "zod"], true)).toMatchSnapshot();
	});
});
