import { afterEach, expect, it, vi } from "vitest";

import { Diacritic } from "~/index";

const importTranslationModule = vi.fn();

const registry = {
	defaultLanguage: "en",
	languages: ["en", "pt"],
	namespaces: ["common"],
	importTranslationModule,
};

afterEach(() => {
	importTranslationModule.mockClear();
});

it("should create a diacritic runtime correctly", async () => {
	const runtime = new Diacritic(registry, "en");
	await runtime.loadModules(["en"], ["common"]);

	expect(runtime).not.toBeUndefined();
	expect(runtime.language).toBe("en");
	expect(runtime.t).not.toBeUndefined();
});

it("should change language correctly", async () => {
	const runtime = new Diacritic(registry, "en");
	await runtime.loadModules(["en"], ["common"]);

	expect(runtime.language).toBe("en");
	runtime.setLanguage("pt");
	expect(runtime.language).toBe("pt");
});

it("should listen to language change correctly", async () => {
	const runtime = new Diacritic(registry, "en");
	await runtime.loadModules(["en"], ["common"]);

	const onChange = vi.fn();

	const dispose = runtime.onChange(onChange);
	runtime.setLanguage("pt");

	expect(onChange).toHaveBeenCalledWith("pt");

	dispose();
	runtime.setLanguage("en");

	expect(onChange).toHaveBeenCalledTimes(1);
});

it("should load new modules correctly", async () => {
	importTranslationModule.mockResolvedValue({});

	const runtime = new Diacritic(registry, "en");
	await runtime.loadModules(["en"], ["common"]);

	expect(runtime.needToLoadModules(["pt"], ["common"])).toBe(true);
	expect(runtime.needToLoadModules(["en"], ["common"])).toBe(false);

	await runtime.loadModules(["en", "pt"], ["common"]);

	expect(importTranslationModule).toHaveBeenCalledWith("pt", "common");

	expect(runtime.needToLoadModules(["pt"], ["common"])).toBe(false);
});

it("should call translation functions correctly", async () => {
	importTranslationModule.mockResolvedValue({
		hello: () => "world",
	});

	const runtime = new Diacritic(registry, "en");
	await runtime.loadModules(["en"], ["common"]);

	expect((runtime.t as any).another).toThrow("Namespace another is not loaded");
	expect((runtime.t as any).common.nonExistent).toThrow("Function nonExistent is not defined in namespace common");

	runtime.setLanguage("pt");

	expect((runtime.t as any).common.hello).toThrow("Language pt is not loaded");

	runtime.setLanguage("en");

	expect((runtime.t as any).common.hello()).toBe("world");
});
