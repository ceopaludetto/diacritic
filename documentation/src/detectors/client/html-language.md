# HTML Language Attribute Detector

Use the HTML language attribute detector to detect the language of the HTML content of a webpage. The detector uses the `lang` attribute of the `<html>` tag to determine the language of the content.

## Installation

To install the HTML language attribute detector, use the following command:

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

To use the HTML language attribute detector, import the `htmlLangAttributeDetector` function from the package and call it with the HTML content of the webpage. The function returns the detected language of the content.

```ts twoslash
// @moduleResolution: bundler
import { detect } from "@diacritic/detector";
import { htmlLangAttributeDetector } from "@diacritic/detector/client";
import * as registry from "virtual:translations/registry";

const language = detect(registry, htmlLangAttributeDetector);
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
