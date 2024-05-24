import { expect, it } from "vitest";

import { localStorageDetector, sessionStorageDetector } from "~/client";
import { detect } from "~/index";

it("should combine detectors and return the first supported locale", () => {
	window.localStorage.setItem("locale", "en-us");
	window.sessionStorage.setItem("locale", "pt-br");

	expect(detect(localStorageDetector("locale"), sessionStorageDetector("locale"))).toBe("en-US");

	window.sessionStorage.setItem("locale", "en-us");
	window.localStorage.setItem("locale", "pt-br");

	expect(detect(localStorageDetector("locale"), sessionStorageDetector("locale"))).toBe("pt-BR");
});

it("should return the default language if no supported locale is found", () => {
	window.sessionStorage.setItem("locale", "de-de");
	window.localStorage.setItem("locale", "ja-jp");

	expect(detect(localStorageDetector("locale"), sessionStorageDetector("locale"))).toBe("en-US");
});
