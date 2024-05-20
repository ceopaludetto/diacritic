import eslint from "@antfu/eslint-config";

export default eslint(
	{
		stylistic: {
			indent: "tab",
			quotes: "double",
			semi: true,
			overrides: {
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
		vue: false,
	},
	{
		rules: {
			"antfu/if-newline": "off",

			"prefer-template": "off",

			"node/prefer-global/buffer": "off",
			"node/prefer-global/process": "off",

			"import/order": [
				"warn",
				{
					"alphabetize": { order: "asc", caseInsensitive: true },
					"groups": [
						"type",
						"builtin",
						"external",
						"index",
						["internal", "sibling", "parent"],
						"object",
					],
					"pathGroups": [
						{ pattern: "~/**", group: "internal" },
					],
					"pathGroupsExcludedImportTypes": [
						"builtin",
						"type",
						"external",
						"object",
					],
					"newlines-between": "always",
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
);
