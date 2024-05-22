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
// @module: preserve
import { detect } from "@diacritic/detector";
import { htmlLangAttributeDetector } from "@diacritic/detector/client";

const language = detect(htmlLangAttributeDetector);
diacritic.setLanguage(language);
// ---cut-after---
declare const diacritic: import("@diacritic/runtime").Diacritic;
```
