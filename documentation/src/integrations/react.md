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

To use the Diacritic React integration, you will need to import the `useTranslation` and `useTranslationContext` hooks:

```ts twoslash
import { useTranslation, useTranslationContext } from "@diacritic/react";
```

### `useTranslation`

In order to make the language change be reactive, you will need to wrap the imported translation into the `useTranslation` hook:

```tsx twoslash
// @jsx: react-jsx
import { useTranslation } from "@diacritic/react";
import * as common from "virtual:translations/common";

export function Component() {
	const t = useTranslation(common);

	return <p>{t.hello()}</p>;
}
// ---cut-after---
// @filename: translations.d.ts
declare module "virtual:translations/common" {
	export function hello(): string;
}
```

This guarantees that the component will re-render when the language changes.

### `useTranslationContext`

You can also use the `useTranslationContext` hook to access the current language and change it:

```tsx twoslash
// @jsx: react-jsx
import { useTranslationContext } from "@diacritic/react";

function Component() {
	const { languages, language, setLanguage } = useTranslationContext();

	return (
		<div>
			<p>
				All available languages:
				{languages.join(", ")}
			</p>
			<p>
				Your current language is
				{language}
			</p>
			<button onClick={() => setLanguage("pt")}>Change to PT</button>
		</div>
	);
}
```
