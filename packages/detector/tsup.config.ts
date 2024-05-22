import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/*.ts"],
	format: ["cjs", "esm"],
	external: ["~translations/registry"],
	splitting: true,
	clean: true,
	dts: true,
});
