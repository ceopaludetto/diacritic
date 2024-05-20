declare module "~translations/registry" {
	export const defaultLanguage: string;
	export const languages: string[];
}

declare module "virtual:translations/registry" {
	export * from "~translations/registry";
}
