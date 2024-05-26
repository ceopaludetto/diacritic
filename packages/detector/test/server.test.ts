import { describe, expect, it } from "vitest";

import { acceptLanguageHeaderDetector, cookieDetector, hostnameDetector } from "~/server";

const supported = ["en-US", "pt-BR"];

describe("acceptLanguageHeaderDetector", () => {
	it("should return the first supported locale from the Accept-Language header", () => {
		const detector = acceptLanguageHeaderDetector("en-US,pt-BR;q=0.9");

		expect(detector(supported)).toStrictEqual(["en-US"]);
		expect(detector(["en", "pt"])).toStrictEqual(["en"]);
	});
});

describe("hostnameDetector", () => {
	it("should return the locale from the hostname", () => {
		expect(hostnameDetector("subdomain.example.com")(supported)).toStrictEqual([]);
		expect(hostnameDetector("en.example.com")(supported)).toStrictEqual(["en"]);
		expect(hostnameDetector("en-US.example.com")(supported)).toStrictEqual(["en-US"]);
		expect(hostnameDetector("es-419.example.com")(supported)).toStrictEqual(["es-419"]);
	});
});

describe("cookieDetector", () => {
	it("should return the locale from the specified cookie", () => {
		expect(cookieDetector("locale=en", "locale")(supported)).toStrictEqual(["en"]);
		expect(cookieDetector("locale=en-US", "locale")(supported)).toStrictEqual(["en-US"]);
	});
});
