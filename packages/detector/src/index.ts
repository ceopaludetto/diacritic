import type { LocaleDetector } from "./utilities/types";

type Registry = typeof import("~translations/registry");

export function detect(registry: Registry, ...detectors: LocaleDetector[]): Registry["languages"][number] {
	for (const detector of detectors) {
		const locales = (detector(registry.languages) as string[])
			.flatMap(locale => [locale, locale.split("-")[0]!])
			.map(locale => locale.toLowerCase());

		const supported = (registry.languages as string[]).map(language => language.toLowerCase());
		const locale = locales.find(locale => supported.includes(locale));

		if (locale) return locale.replace(/-(\w+)/, match => match.toUpperCase());
	}

	return registry.defaultLanguage;
}

export type * from "./utilities/types";
