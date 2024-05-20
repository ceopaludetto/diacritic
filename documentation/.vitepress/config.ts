import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";

export default defineConfig({
	title: "Diacritic",
	description: "Stupid Simple i18n Solution",
	markdown: {
		codeTransformers: [transformerTwoslash()],
	},
	srcDir: "src",
	/// keep-sorted
	themeConfig: {
		nav: [
			{ text: "Guides", link: "/guides", activeMatch: "/guides/" },
			{ text: "Integrations", link: "/integrations", activeMatch: "/integrations/" },
		],
		search: {
			provider: "local",
		},
		sidebar: [
			{
				text: "Guides",
				items: [
					{ text: "Getting started", link: "/guides/" },
					{ text: "Why Diacritic?", link: "/guides/why" },
				],
			},
			{
				text: "Integrations",
				items: [
					{ text: "React", link: "/integrations/react" },
				],
			},
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/ceopaludetto/diacritic" },
		],
	},
});
