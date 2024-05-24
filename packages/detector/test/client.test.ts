import { describe, expect, it } from "vitest";

import { cookieDetector, htmlLangAttributeDetector, localStorageDetector, navigatorDetector, sessionStorageDetector } from "~/client";

const supported = ["en-US", "pt-BR"];

describe("htmlLangAttributeDetector", () => {
	it("should return the value of the lang attribute of the document element", () => {
		document.documentElement.lang = "en";
		expect(htmlLangAttributeDetector(supported)).toStrictEqual(["en"]);

		document.documentElement.lang = "en-US";
		expect(htmlLangAttributeDetector(supported)).toStrictEqual(["en-US"]);
	});
});

describe("navigatorDetector", () => {
	it("should return the value of the navigator language attribute", () => {
		Object.defineProperty(navigator, "language", { value: "en", writable: true });
		expect(navigatorDetector(supported)).toStrictEqual(["en"]);

		// @ts-expect-error navigator language is read-only
		navigator.language = "en-US";
		expect(navigatorDetector(supported)).toStrictEqual(["en-US"]);
	});
});

describe("localStorageDetector", () => {
	it("should return the value of the specified key in the local storage", () => {
		const detector = localStorageDetector("locale");

		window.localStorage.setItem("locale", "en");
		expect(detector(supported)).toStrictEqual(["en"]);

		window.localStorage.setItem("locale", "en-US");
		expect(detector(supported)).toStrictEqual(["en-US"]);
	});
});

describe("sessionStorageDetector", () => {
	it("should return the value of the specified key in the session storage", () => {
		const detector = sessionStorageDetector("locale");

		window.sessionStorage.setItem("locale", "en");
		expect(detector(supported)).toStrictEqual(["en"]);

		window.sessionStorage.setItem("locale", "en-US");
		expect(detector(supported)).toStrictEqual(["en-US"]);
	});
});

describe("cookieDetector", () => {
	it("should return the value of the specified key in the cookies", () => {
		const detector = cookieDetector("locale");

		document.cookie = "locale=en";
		expect(detector(supported)).toStrictEqual(["en"]);

		document.cookie = "locale=en-US";
		expect(detector(supported)).toStrictEqual(["en-US"]);
	});
});
