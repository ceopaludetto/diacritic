import { describe, expect, it } from "vitest";

import { extractLanguageAndNamespace, isTranslationPath, normalizeTranslationPath, resourceWithoutPrefix } from "~/utilities/loader";

describe("isTranslationPath", () => {
	it("should return true for valid translation paths", () => {
		expect(isTranslationPath("/~translations/en")).toBe(true);
		expect(isTranslationPath("~translations/en")).toBe(true);
		expect(isTranslationPath("virtual:translations/en")).toBe(true);
		expect(isTranslationPath("virtual/translations/en")).toBe(true);

		expect(isTranslationPath("/~translations/pt/common")).toBe(true);
		expect(isTranslationPath("~translations/pt/other")).toBe(true);
		expect(isTranslationPath("virtual:translations/pt/zod")).toBe(true);
		expect(isTranslationPath("virtual/translations/pt/error")).toBe(true);
	});
});

describe("normalizeTranslationPath", () => {
	it("should normalize translation paths", () => {
		expect(normalizeTranslationPath("/~translations/en")).toBe("/~translations/en");
		expect(normalizeTranslationPath("~translations/en")).toBe("/~translations/en");
		expect(normalizeTranslationPath("virtual:translations/en")).toBe("/~translations/en");
		expect(normalizeTranslationPath("virtual/translations/en")).toBe("/~translations/en");
	});
});

describe("resourceWithoutPrefix", () => {
	it("should remove the prefix from the path", () => {
		expect(resourceWithoutPrefix("/~translations/en")).toBe("en");
		expect(resourceWithoutPrefix("/~translations/common")).toBe("common");
		expect(resourceWithoutPrefix("/~translations/en/common")).toBe("en/common");
	});
});

describe("extractLanguageAndNamespace", () => {
	it("should extract the language and namespace from the path", () => {
		const languages = ["en", "pt"];

		expect(extractLanguageAndNamespace(languages, "/~translations/en"))
			.toStrictEqual({ language: "en", mode: "languageOnly" });

		expect(extractLanguageAndNamespace(languages, "/~translations/en/common"))
			.toStrictEqual({ language: "en", namespace: "common", mode: "languageAndNamespace" });

		expect(extractLanguageAndNamespace(languages, "/~translations/registry"))
			.toStrictEqual({ mode: "registry" });
	});
});
