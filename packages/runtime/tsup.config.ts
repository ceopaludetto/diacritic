import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts"],
	format: ["cjs", "esm"],
	external: ["~translations/registry"],
	noExternal: ["proxy-deep"],
	splitting: true,
	clean: true,
	dts: true,
});
