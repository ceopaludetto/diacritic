/**
 * This file is used to declare stub types for the translations module.
 * Since the translation module get their types from the build plugin, we just declare some look alike types here.
 */

declare module "~translations/registry" {
	export type SupportedLanguages = string[];
	export type SupportedNamespaces = string[];

	export const defaultLanguage: SupportedLanguages[number];
	export const languages: SupportedLanguages;
	export const namespaces: SupportedNamespaces;

	export function importTranslationModule(
		language: SupportedLanguages[number],
		namespace: SupportedNamespaces[number]
	): Promise<Record<string, any>>;
}
