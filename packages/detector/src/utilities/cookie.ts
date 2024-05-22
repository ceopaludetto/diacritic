export function parseCookie(cookies: string, key: string): string | undefined {
	const value = cookies
		?.split(";")
		.map(cookie => cookie.trim())
		.find(cookie => cookie.startsWith(key))
		?.split("=")[1];

	return value;
}
