import equal from "fast-deep-equal";

type CacheEntry = {
	promise: Promise<void>;
	inputs: Array<any>;
	response?: any;
	error?: Error;
};

const cache: CacheEntry[] = [];

// This hook can be replaced by `use` when react 19 releases
export function usePromise<A extends any[], R>(
	promise: (...inputs: A) => Promise<R>,
	...inputs: A
): R {
	for (const entry of cache) {
		if (equal(inputs, entry.inputs)) {
			// If an error occurred,
			if (Object.prototype.hasOwnProperty.call(entry, "error"))
				throw entry.error;

			// If a response was successful,
			else if (Object.prototype.hasOwnProperty.call(entry, "response"))
				return entry.response;

			throw entry.promise;
		}
	}

	const entry: CacheEntry = {
		promise: promise(...inputs)
			.then((response: R) => {
				entry.response = response;
			})
			.catch((e: Error) => {
				entry.error = e;
			}),
		inputs,
	};

	cache.push(entry);
	throw promise;
}
