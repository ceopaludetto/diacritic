import { render, renderHook } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it, vi } from "vitest";

import { DiacriticContext, DiacriticProvider, createDiacritic, useTranslation } from "~/index";

const importTranslationModule = vi.fn().mockResolvedValue({});

const registry = {
	defaultLanguage: "en",
	languages: ["en", "pt"],
	namespaces: ["common"],
	importTranslationModule,
};

describe("<DiacriticProvider/>", () => {
	it("should render correctly", async () => {
		const instance = await createDiacritic(registry, "en", ["common"]);

		const { getByText } = render(
			<DiacriticProvider diacritic={instance}>
				<div>test</div>
			</DiacriticProvider>,
		);

		expect(getByText(/test/i)).toBeInTheDocument();
	});

	it("should provide diacritic instance correctly", async () => {
		const instance = await createDiacritic(registry, "en", ["common"]);

		function useDiacriticContext() {
			return useContext(DiacriticContext);
		}

		const { result } = renderHook(() => useDiacriticContext(), {
			wrapper: ({ children }) => (
				<DiacriticProvider diacritic={instance}>
					{children}
				</DiacriticProvider>
			),
		});

		expect(result.current).toStrictEqual(instance);
	});
});

describe("useTranslation()", () => {
	it("should return the diacritic instance", async () => {
		const instance = await createDiacritic(registry, "en", ["common"]);

		const { result } = renderHook(() => useTranslation(["common"]), {
			wrapper: ({ children }) => (
				<DiacriticProvider diacritic={instance}>
					{children}
				</DiacriticProvider>
			),
		});

		expect(result.current).toStrictEqual(instance);
	});

	it("should rerender on language change", async () => {
		const instance = await createDiacritic(registry, "en", ["common"]);

		const { result } = renderHook(() => useTranslation(["common"]), {
			wrapper: ({ children }) => (
				<DiacriticProvider diacritic={instance}>
					{children}
				</DiacriticProvider>
			),
		});

		const newLanguage = "pt";
		instance.setLanguage(newLanguage);

		expect(result.current.language).toBe(newLanguage);
	});
});
