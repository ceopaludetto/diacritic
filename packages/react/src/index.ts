import diacritic from "@diacritic/runtime";
import { useEffect, useState, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
	const dispose = diacritic.onLanguageChange(callback);
	return () => dispose();
}

function getSnapshot() {
	return diacritic.language();
}

export function useTranslationContext() {
	const language = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
	return { language, languages: diacritic.languages, setLanguage: diacritic.setLanguage	};
}

export function useTranslation<T extends object>(mod: T) {
	const language = useTranslationContext().language;
	const [state, setState] = useState<T>(() => ({ ...mod }));

	useEffect(() => setState({ ...mod }), [language]);

	return state;
}
