import typecript from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
	plugins: [typecript()],
	test: { setupFiles: ["./test/setup.ts"], environment: "happy-dom" },
});
