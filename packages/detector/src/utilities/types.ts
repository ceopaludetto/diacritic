type Registry = typeof import("~translations/registry");

export type LocaleDetector = (supported: Registry["languages"]) => Registry["languages"];
