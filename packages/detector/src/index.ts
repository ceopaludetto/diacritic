import type { LocaleDetector } from "./utilities/types";
import type { Language } from "@diacritic/runtime";

import { defaultLanguage, languages } from "@diacritic/runtime";

export function detect(...detectors: LocaleDetector[]): Language {
	for (const detector of detectors) {
		const locales = (detector(languages) as string[])
			.flatMap(locale => [locale, locale.split("-")[0]!])
			.map(locale => locale.toLowerCase());

		const supported = (languages as string[]).map(language => language.toLowerCase());
		const locale = locales.find(locale => supported.includes(locale));

		if (locale) return locale.replace(/-(\w+)/, match => match.toUpperCase());
	}

	return defaultLanguage;
}

export type * from "./utilities/types";
