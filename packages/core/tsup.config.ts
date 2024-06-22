import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/*.ts"],
	format: ["cjs", "esm"],
	splitting: true,
	clean: true,
	shims: true,
	dts: true,
});
