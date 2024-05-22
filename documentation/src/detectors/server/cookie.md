# Cookie Detector

Use the cookie detector to detect the language of the HTML content of a webpage. The detector uses the `Cookies` header of the HTTP request to determine the language of the content.

## Installation

To install the cookie detector, use the following command:

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

To use the cookie detector, import the `cookieDetector` function from the package and call it with the HTML content of the webpage. The function returns the detected language of the content.

```ts twoslash
// @module: preserve
import { detect } from "@diacritic/detector";
import { cookieDetector } from "@diacritic/detector/server";

const cookies = request.headers.get("Cookie") ?? "";

const language = detect(cookieDetector(cookies, "cookie-name"));
diacritic.setLanguage(language);
// ---cut-after---
declare const request: Request;
declare const diacritic: import("@diacritic/runtime").Diacritic;
```
