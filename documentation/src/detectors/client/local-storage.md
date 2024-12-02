# Local Storage Detector

Use the local storage detector to detect the language of the HTML content of a webpage. The detector uses the `localStorage` API to determine the language of the content.

## Installation

To install the local storage detector, use the following command:

::: code-group

```sh [NPM]
$ npm add @diacritic/detector
```

```sh [PNPM]
$ pnpm add @diacritic/detector
```

```sh [Bun]
$ bun add @diacritic/detector
```

```sh [Yarn]
$ yarn add @diacritic/detector
```

:::

## Usage

To use the local storage detector, import the `localStorageDetector` function from the package and call it with the HTML content of the webpage. The function returns the detected language of the content.

```ts twoslash
// @moduleResolution: bundler
import { detect } from "@diacritic/detector";
import { localStorageDetector } from "@diacritic/detector/client";
import * as registry from "virtual:translations/registry";

const language = detect(registry, localStorageDetector("key"));
diacritic.setLanguage(language);
// ---cut-after---
// @filename: translations.d.ts
declare const diacritic: import("@diacritic/runtime").Diacritic;
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
```
