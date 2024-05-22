import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.tsx"],
	format: ["cjs", "esm"],
	splitting: true,
	clean: true,
	dts: true,
});
