import eslint from "@antfu/eslint-config";

export default eslint(
	{
		stylistic: {
			indent: "tab",
			quotes: "double",
			semi: true,
			overrides: {
				"style/brace-style": ["error", "1tbs"],
				"style/max-len": ["error", { code: 120, tabWidth: 2, ignoreStrings: true }],
				"style/jsx-sort-props": [
					"warn",
					{
						shorthandFirst: true,
						reservedFirst: true,
						callbacksLast: true,
					},
				],
			},
		},
		isInEditor: false,
		typescript: {
			overrides: {
				"ts/consistent-type-imports": "off",
				"ts/consistent-type-definitions": ["error", "type"],
				"ts/explicit-member-accessibility": [
					"warn",
					{ accessibility: "explicit" },
				],
				"ts/no-floating-promises": "off",
				"ts/no-misused-promises": "off",
				"ts/no-use-before-define": "off",
			},
		},
		formatters: {
			css: true,
			markdown: "prettier",
		},
		vue: false,
	},
	{
		rules: {
			"antfu/if-newline": "off",

			"prefer-template": "off",

			"node/prefer-global/buffer": "off",
			"node/prefer-global/process": "off",

			"perfectionist/sort-imports": [
				"warn",
				{
					type: "alphabetical",
					order: "asc",
					ignoreCase: true,
					groups: ["side-effect", "type", "builtin", "external", "index", ["internal", "sibling", "parent"], "object"],
					internalPattern: ["^~/.*"],
					newlinesBetween: "always",
					environment: "bun",
				},
			],

			"import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
		},
	},
	{
		ignores: [
			// Build artifacts
			"**/dist/**/*",
			"**/.turbo/**/*",
			"**/.vite/**/*",

			// Modules
			"**/node_modules/**/*",
		],
	},
	{
		files: ["documentation/**/*.md"],
		rules: {
			"style/max-len": "off",
			"perfectionist/sort-imports": "off",
		},
	},
);
