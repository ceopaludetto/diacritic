import type { Diacritic, Namespace } from "@diacritic/runtime";

export function useLoadModules(instance: Diacritic, namespaces: Namespace[]) {
	if (!instance.needToLoadModules([instance.language], namespaces)) return;
	throw instance.loadModules([instance.language], namespaces);
}
