import { defaultLanguage, languages } from "~translations/registry";

class diacritic {
	public readonly languages: string[] = languages;

	private current: string = defaultLanguage;
	private listeners: Set<(language: string) => void> = new Set();

	public language = () => {
		return this.current;
	};

	public setLanguage = (language: string) => {
		this.current = language;
		this.listeners.forEach(listener => listener(language));
	};

	public onLanguageChange = (listener: (language: string) => void) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};
}

export default new diacritic();
