import diacritic from "@diacritic/runtime";
import { useEffect, useState, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
	const dispose = diacritic.onLanguageChange(callback);
	return () => dispose();
}

function getSnapshot() {
	return diacritic.language();
}

/**
 * Thin wrapper around the diacritic runtime to be used in React components.
 *
 * @returns the current language, a function to change it and also the list of available languages
 */
export function useTranslationContext() {
	const language = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
	return { language, languages: diacritic.languages, setLanguage: diacritic.setLanguage	};
}

/**
 * This hook simply recreates an object every time the language changes.
 * This will trigger a re-render on the component that uses it.
 *
 * @param mod the module containing the translations
 * @returns the same module passed as argument, but reactive to language changes
 */
export function useTranslation<T extends object>(mod: T) {
	const language = useTranslationContext().language;
	const [state, setState] = useState<T>(() => ({ ...mod }));

	useEffect(() => setState({ ...mod }), [language]);

	return state;
}
