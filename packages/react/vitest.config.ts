import react from "@vitejs/plugin-react";
import typecript from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
	plugins: [typecript(), react()],
	test: { environment: "happy-dom", setupFiles: ["./test/setup.ts"] },
});
