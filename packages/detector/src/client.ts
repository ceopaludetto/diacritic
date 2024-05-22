import type { LocaleDetector } from "./utilities/types";

import { parseCookie } from "./utilities/cookie";

export const htmlLangAttributeDetector: LocaleDetector = () => {
	return [document?.documentElement?.lang].filter(Boolean) as string[];
};

export const navigatorDetector: LocaleDetector = () => {
	return [navigator?.language].filter(Boolean) as string[];
};

export function localStorageDetector(key: string): LocaleDetector {
	return () => [window?.localStorage?.getItem(key)].filter(Boolean) as string[];
}

export function sessionStorageDetector(key: string): LocaleDetector {
	return () => [window?.sessionStorage?.getItem(key)].filter(Boolean) as string[];
}

export function cookieDetector(key: string): LocaleDetector {
	return () => [parseCookie(document.cookie, key)].filter(Boolean) as string[];
}
