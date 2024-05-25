import typecript from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
	plugins: [typecript()],
	test: { environment: "happy-dom" },
});
