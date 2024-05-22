import type { Language } from "@diacritic/runtime";

export type LocaleDetector = (supported: Language[]) => Language[];
