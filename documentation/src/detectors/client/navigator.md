# Navigator Detector

Use the navigator detector to detect the language of the HTML content of a webpage. The detector uses the `navigator.language` property to determine the language of the content.

## Installation

To install the navigator detector, use the following command:

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

To use the navigator detector, import the `navigatorDetector` function from the package and call it with the HTML content of the webpage. The function returns the detected language of the content.

```ts twoslash
// @module: preserve
import { detect } from "@diacritic/detector";
import { navigatorDetector } from "@diacritic/detector/client";

const language = detect(navigatorDetector);
diacritic.setLanguage(language);
// ---cut-after---
declare const diacritic: import("@diacritic/runtime").Diacritic;
```
