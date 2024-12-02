export type DiacriticGenerationOptions = {
	/**
	 * Additional lines on top of the file. Usually, you want to add lint disable comments
	 */
	banner?: string[];

	/**
	 * Where to put the generated typescript declaration file (.d.ts)
	 *
	 * @example "./src/types/translation.d.ts"
	 */
	outFile: string;

};

export type DiacriticOptions = {
	/**
	 * Which of the supported languages will be the default language (fallback)
	 *
	 * @example "en"
	 */
	defaultLanguage: string;

	/**
	 * Generation specific options
	 */
	generation: DiacriticGenerationOptions;

	/**
	 * Which languages your application will support
	 *
	 * @example ["en", "pt"]
	 */
	languages: string[];

	/**
	 * Glob containing all resources (translation files).
	 * You may also want to specify `language` replacers
	 *
	 * @example ["src/locales/{{language}}.json", "src/locales/{{language}}/{{namespace}}.json"]
	 */
	resources: string[];
};

export type Entry = {
	/**
	 * The function name
	 * @example "screenMetaTitle"
	 */
	name: string;

	/**
	 * The function arguments
	 */
	args: { name: string; type: string }[];

	/**
	 * The function path
	 * @example "screen.meta.title"
	 */
	path: string;

	/**
	 * The function return
	 * @example "Title"
	 */
	return: string | string[];
};
