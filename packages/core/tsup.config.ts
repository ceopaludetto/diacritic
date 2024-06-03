import metaUrl from "@chialab/esbuild-plugin-meta-url";
import { defineConfig } from "tsup";

export default defineConfig({
	esbuildPlugins: [metaUrl()],
	entry: ["./src/*.ts"],
	format: ["cjs", "esm"],
	splitting: true,
	clean: true,
	shims: true,
	dts: true,
});
