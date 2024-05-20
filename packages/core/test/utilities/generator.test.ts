import type { Entry } from "~/utilities/types";

import { describe, expect, it } from "bun:test";

import { createConditionalFunctionFromEntry, createExportFromLanguageAndNamespace, createFunctionFromEntry, createImportExport, createImportFromLanguageAndNamespace } from "~/utilities/generator";

describe("createFunctionFromEntry", () => {
	it("should create a function from an entry correctly", () => {
		const entry: Entry = {
			name: "hello",
			args: [{ name: "name", type: "string" }],
			return: "Hello, {{ name | string }}!",
		};

		expect(createFunctionFromEntry(["{{", "}}"], entry)).toMatchSnapshot();
	});
});

describe("createExportFromLanguageAndNamespace", () => {
	it("should create a export from language and namespace correctly", () => {
		expect(createExportFromLanguageAndNamespace("en", "common")).toMatchSnapshot();
	});
});

describe("createImportFromLanguageAndNamespace", () => {
	it("should create a import from language and namespace correctly", () => {
		expect(createImportFromLanguageAndNamespace("en", "common")).toMatchSnapshot();
	});
});

describe("createConditionalFunctionFromEntry", () => {
	it("should create a conditional function from an entry correctly", () => {
		const entry: Entry = {
			name: "hello",
			args: [{ name: "name", type: "string" }],
			return: "Hello, {{ name | string }}!",
		};

		expect(createConditionalFunctionFromEntry("en", ["en", "pt"], entry)).toMatchSnapshot();
	});
});

describe("createImportExport", () => {
	it("should create a import/export correctly", () => {
		expect(createImportExport(["import * as m from 'module';"], ["export * from 'module';"])).toMatchSnapshot();
	});
});
