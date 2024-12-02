# React

Diacritic provides a [React](https://react.dev) integration that allows you to use the translations in your React components.

## Installation

To install the Diacritic React integration, you will need to add the `@diacritic/react` package to your project:

::: code-group

```sh [NPM]
$ npm add @diacritic/react
```

```sh [PNPM]
$ pnpm add @diacritic/react
```

```sh [Yarn]
$ yarn add @diacritic/react
```

```sh [Bun]
$ bun add @diacritic/react
```

:::

## Usage

To use the Diacritic React integration, you will need to import the `DiacriticProvider` component and the `useTranslation` hook:

```tsx twoslash
// @jsx: react-jsx
// @moduleResolution: bundler
// @filename: index.tsx
// ---cut-before---
import { detect } from "@diacritic/detector";
import { htmlLangAttributeDetector } from "@diacritic/detector/client";
import { Diacritic, DiacriticProvider, useTranslation } from "@diacritic/react";
import { createRoot } from "react-dom/client";
import * as registry from "virtual:translations/registry";

function Component() {
	const { t } = useTranslation(["common"]);

	return <p>{t.common.hello()}</p>;
}

async function main() {
	const language = detect(registry, htmlLangAttributeDetector);
	const diacritic = new Diacritic(registry, language);

	await diacritic.loadModules([language], ["common"]);

	createRoot(document.getElementById("root")!).render(
		<DiacriticProvider diacritic={diacritic}>
			<Component />
		</DiacriticProvider>
	);
}
// ---cut-after---
// @filename: translations.d.ts
declare module "~translations/registry" {
	export const defaultLanguage: "en";
	export const languages: ("en" | "pt")[];
	export const namespaces: ("common")[];

	export type SupportedLanguages = typeof languages;
	export type SupportedNamespaces = typeof namespaces;
}
declare module "virtual:translations/registry" {
	export * from "~translations/registry";
}
declare module "~translations/proxy" {
	type Proxy = {
		common: { hello: () => string };
	};
}
```
