import type { LocaleDetector } from "./utilities/types";

import { pick } from "accept-language-parser";

import { parseCookie } from "./utilities/cookie";

const REGEX_HOST_LANG = /^(\w{2,3}(?:-\w{3})?(?:-\w{4})?(?:-\w{2}|-\d{3})?(?:-\w{5,8}|-\d\w{3})*)\./;

export function acceptLanguageHeaderDetector(header: string): LocaleDetector {
	return supported => [pick(supported, header, { loose: true })].filter(Boolean) as string[];
}

export function hostnameDetector(hostname: string): LocaleDetector {
	return () => {
		const match = hostname.match(REGEX_HOST_LANG);
		return match ? [match[1]!] : [];
	};
}

export function cookieDetector(cookies: string, key: string): LocaleDetector {
	return () => [parseCookie(cookies, key)].filter(Boolean) as string[];
}
