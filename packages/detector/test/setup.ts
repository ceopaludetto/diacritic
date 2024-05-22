import { mock } from "bun:test";

mock.module("@diacritic/runtime", () => ({
	defaultLanguage: "en-US",
	languages: ["en-US", "pt-BR"],
}));
