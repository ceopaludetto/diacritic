import diacritic from "@diacritic/core/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		diacritic({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			resources: ["./src/locales/{{language}}/{{namespace}}.json"],
			generation: { outFile: "./src/types/translations.d.ts" },
		}),
		react(),
	],
});
