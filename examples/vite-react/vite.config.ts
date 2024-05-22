import diacritic from "@diacritic/core/vite";
import json from "@diacritic/parser/json";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		diacritic({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			parser: json(),
			resources: ["./src/locales/{{language}}/*.json"],
			generation: { outFile: "./src/types/translations.d.ts" },
		}),
		react(),
	],
});
