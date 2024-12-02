import "@shikijs/vitepress-twoslash/style.css";
import "./index.css";

import type { EnhanceAppContext } from "vitepress";

import twoslash from "@shikijs/vitepress-twoslash/client";
import theme from "vitepress/theme";

export default {
	extends: theme,
	enhanceApp: ({ app }: EnhanceAppContext) => {
		app.use(twoslash);
	},
};
