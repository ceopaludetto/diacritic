import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Diacritic",
	description: "New approach to i18n",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Guides", link: "/guides", activeMatch: "/guides/" },
		],

		sidebar: [
			{
				text: "Guides",
				items: [
					{ text: "Getting started", link: "/guides/" },
				],
			},
		],

		socialLinks: [
			{ icon: "github", link: "https://github.com/ceopaludetto/diacritic" },
		],
	},
});
