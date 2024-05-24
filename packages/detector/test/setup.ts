import { vi } from "vitest";

vi.mock("@diacritic/runtime", () => ({
	defaultLanguage: "en-US",
	languages: ["en-US", "pt-BR"],
}));
