type Either<R, E extends Error = Error> =
	| { type: "success"; value: R }
	| { type: "failure"; error: E };

export function runCatching<C extends (...args: any[]) => any>(callback: C): Either<ReturnType<C>> {
	try {
		const value = callback();
		return { type: "success", value };
	} catch (error) {
		return { type: "failure", error: new Error("runCatching error", { cause: error }) };
	}
}
