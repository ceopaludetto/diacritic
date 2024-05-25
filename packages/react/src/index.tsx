import type { Diacritic, Namespace, Proxy } from "@diacritic/runtime";
import type { PropsWithChildren } from "react";

import { createContext, useContext, useEffect, useReducer } from "react";
import invariant from "tiny-invariant";

import { useLoadModules } from "./utilities/hooks";

const DiacriticContext = createContext<Diacritic | null>(null);

/**
 * This component is used to provide the Diacritic object to the children components.
 *
 * @param props the props
 * @param props.diacritic the Diacritic object
 * @param props.children the children
 *
 * @returns the DiacriticProvider component
 */
export function DiacriticProvider({ diacritic, children }: PropsWithChildren<{ diacritic: Diacritic }>) {
	return (
		<DiacriticContext.Provider value={diacritic}>
			{children}
		</DiacriticContext.Provider>
	);
}

export type UseTranslationReturn<N extends Namespace> = Omit<Diacritic, "t"> & {
	t: Pick<Proxy, N>;
};

/**
 * This hook is used to access the translation functions and the current language.
 * It also triggers a re-render when the language changes.
 *
 * If some namespaces are not loaded yet, it will trigger a load by throwing a promise.
 *
 * @example
 * ```tsx
 * import { useTranslation } from "@diacritic/react";
 *
 * function Component() {
 * 	const { t, language, setLanguage } = useTranslation(["common"]);
 *
 * 	return (
 * 		<div>
 * 			<h1>{t.common.hello()}</h1>
 * 			<button onClick={() => setLanguage(language === "en" ? "pt" : "en")}>
 * 				{t.common.actions.switch()}
 * 			</button>
 * 		</div>
 * 	);
 * }
 *
 * export function Application() {
 * 	return (
 * 		<Suspense fallback={<p>loading...</p>}>
 * 			<Component />
 * 		</Suspense>
 * 	)
 * }
 * ```
 *
 * @param namespaces the namespaces to use
 * @returns the diacritic object with the translation functions and the current language
 */
export function useTranslation<const N extends Namespace>(namespaces: N[]): UseTranslationReturn<N> {
	const context = useContext(DiacriticContext);
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	invariant(!!context, "useTranslation must be wrapped by a DiacriticProvider");
	useLoadModules(context, namespaces);

	useEffect(() => {
		const dispose = context.onChange(forceUpdate);

		return () => {
			dispose();
		};
	}, [context]);

	return context;
}

export { createDiacritic, defaultLanguage, languages } from "@diacritic/runtime";
