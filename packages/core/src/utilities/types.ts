export type diacriticGenerationOptions = {
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

export type diacriticOptions = {
	/**
	 * Which of the supported languages will be the default language (fallback)
	 *
	 * @example "en"
	 */
	defaultLanguage: string;

	/**
	 * Generation specific options
	 */
	generation: diacriticGenerationOptions;

	/**
	 * Which languages your application will support
	 *
	 * @example ["en", "pt"]
	 */
	languages: string[];

	/**
	 * Parser to be used to convert translation files to typescript functions
	 */
	parser: Parser;

	/**
	 * Glob containing all resources (translation files).
	 * You may also want to specify `language` replacers
	 *
	 * @example ["src/locales/{{language}}.json", "src/locales/{{language}}/*.json"]
	 */
	resources: string[];
};

export type Entry = {
	/**
	 * The function name
	 */
	name: string;

	/**
	 * The function arguments
	 */
	args: { name: string; type: string }[];

	/**
	 * The function return
	 */
	return: string;
};

export type Parser = {
	/**
	 * Name of the parser
	 */
	name: string;

	/**
	 * Characters to be used to interpolate with variables
	 *
	 * @example ["{{", "}}"]
	 */
	interpolation: [left: string, right: string];

	/**
	 * Convert the given raw file to possible typescript functions
	 *
	 * @param content the raw content of the file
	 * @returns an array of entries (parsed functions)
	 */
	convertFile: (content: string) => Entry[];
};
