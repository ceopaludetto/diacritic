import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";

export default defineConfig({
	title: "Diacritic",
	description: "Stupid Simple i18n Solution",
	srcDir: "src",
	cleanUrls: true,
	markdown: {
		codeTransformers: [transformerTwoslash()],
	},
	/// keep-sorted
	themeConfig: {
		nav: [
			{ text: "Guides", link: "/guides", activeMatch: "/guides/" },
			{ text: "Detectors", link: "/detectors", activeMatch: "/detectors/" },
			{ text: "Integrations", link: "/integrations", activeMatch: "/integrations/" },
		],
		search: {
			provider: "local",
		},
		sidebar: [
			{
				text: "Guides",
				items: [
					{ text: "Getting Started", link: "/guides/" },
					{ text: "Why Diacritic?", link: "/guides/why" },
				],
			},
			{
				text: "Detectors",
				link: "/detectors/",
				items: [
					{
						text: "Client",
						collapsed: true,
						items: [
							{ text: "HTML Language Attribute", link: "/detectors/client/html-language" },
							{ text: "Navigator", link: "/detectors/client/navigator" },
							{ text: "Local Storage", link: "/detectors/client/local-storage" },
							{ text: "Session Storage", link: "/detectors/client/session-storage" },
							{ text: "Cookie", link: "/detectors/client/cookie" },
						],
					},
					{
						text: "Server",
						collapsed: true,
						items: [
							{ text: "Accept Language Header", link: "/detectors/server/accept-language-header" },
							{ text: "Hostname", link: "/detectors/server/hostname" },
							{ text: "Cookie", link: "/detectors/server/cookie" },
						],
					},
				],
			},
			{
				text: "Integrations",
				link: "/integrations/",
				items: [
					{ text: "React", link: "/integrations/react" },
				],
			},
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/ceopaludetto/diacritic" },
		],
	},
	transformHead: ({ assets }) => {
		// adjust the regex accordingly to match your font
		const monaspaceWoff = assets.find(file => /MonaspaceNeon-\w+\.\w+\.woff$/.test(file));
		const monaspaceWoff2 = assets.find(file => /MonaspaceNeon-\w+\.\w+\.woff2$/.test(file));

		if (monaspaceWoff && monaspaceWoff2) {
			return [
				["link", { rel: "preload", href: monaspaceWoff, as: "font", type: "font/woff", crossorigin: "" }],
				["link", { rel: "preload", href: monaspaceWoff2, as: "font", type: "font/woff2", crossorigin: "" }],
			];
		}
	},
});
