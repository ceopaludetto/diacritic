# Hostname Detector

Use the hostname detector to detect the language of a server. The detector uses the `request.hostname` property to determine the language of the content.

## Installation

To install the hostname detector, use the following command:

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

To use the hostname detector, import the `hostnameDetector` function from the package and call it with the HTTP request. The function returns the detected language of the server.

```ts twoslash
// @moduleResolution: bundler
import { detect } from "@diacritic/detector";
import { hostnameDetector } from "@diacritic/detector/server";
import * as registry from "virtual:translations/registry";

const hostname = new URL(request.url).hostname;

const language = detect(registry, hostnameDetector(hostname));
diacritic.setLanguage(language);
// ---cut-after---
declare const request: Request;
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
