# Getting Started

## Overview

Diacritic is a build plugin that aims to provide a modern solution to internacionalization (i18n).
It consists of two main parts:

- A type generator to generate TypeScript types containing your translation strings
- A virtual module generator to generate simple functions containing your translation strings that later will be imported in your code

It aims to be highly configurable through different parsers and bundlers, allowing you to use the tools you are already familiar with.

## Installation

### Prerequisites

1. A project already configured in one of these bundlers:
   - [Esbuild](https://esbuild.github.io/)
   - [Farm](https://www.farmfe.org/)
   - [Rollup](https://rollupjs.org/)
   - [Vite](https://vitejs.dev/)
   - [Webpack](https://webpack.js.org/)

2. Plain JSON files containing your translations strings.

### Packages

To install Diacritic, you will need to add the `@diacritic/core` and a parser package to your project:

::: code-group

```sh [NPM]
$ npm add -D @diacritic/core @diacritic/parser-json
```

```sh [PNPM]
$ pnpm add -D @diacritic/core @diacritic/parser-json
```

```sh [Yarn]
$ yarn add -D @diacritic/core @diacritic/parser-json
```

```sh [Bun]
$ bun add -D @diacritic/core @diacritic/parser-json
```

:::

### Setup

The setup of Diacritic depends on the bundler you are using:

::: code-group

```js [Esbuild] {2-3,8-14}
// esbuild.config.js
import diacritic from "@diacritic/core/esbuild";
import json from "@diacritic/parser-json";
import { build } from "esbuild";

build({
	plugins: [
		diacritic({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			parser: json(),
			resources: ["./src/locales/{{language}}/*.json"],
			generation: { outFile: "./src/types/translations.d.ts" }
		})
	],
});
```

```js [Farm] {2-3,7-13}
// farm.config.ts
import diacritic from "@diacritic/core/farm";
import json from "@diacritic/parser-json";

export default defineConfig({
	plugins: [
		diacritic({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			parser: json(),
			resources: ["./src/locales/{{language}}/*.json"],
			generation: { outFile: "./src/types/translations.d.ts" }
		})
	],
});
```

```js [Rollup] {2-3,7-13}
// rollup.config.js
import diacritic from "@diacritic/core/rollup";
import json from "@diacritic/parser-json";

export default {
	plugins: [
		diacritic({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			parser: json(),
			resources: ["./src/locales/{{language}}/*.json"],
			generation: { outFile: "./src/types/translations.d.ts" }
		})
	],
};
```

```ts [Vite] {2-3,7-13}
// vite.config.ts
import diacritic from "@diacritic/core/vite";
import json from "@diacritic/parser-json";

export default defineConfig({
	plugins: [
		diacritic({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			parser: json(),
			resources: ["./src/locales/{{language}}/*.json"],
			generation: { outFile: "./src/types/translations.d.ts" }
		})
	],
});
```

```js [Webpack] {4-10}
// webpack.config.js
module.exports = {
	plugins: [
		require("@diacritic/core/webpack")({
			defaultLanguage: "en",
			languages: ["en", "pt"],
			parser: require("@diacritic/parser-json")(),
			resources: ["./src/locales/{{language}}/*.json"],
			generation: { outFile: "./src/types/translations.d.ts" }
		})
	],
};
```

:::

## Usage

To use the generated types and translations, you will need to create translations files in the JSON format:

```json
{
	"hello": "Hello world!",
	"nameAndAge": "My name is {{name|string}} and I'm {{age|number}} years old."
}
```

And import them in your code:

```ts twoslash
// @filename: index.ts
// ---cut-before---
import * as common from "virtual:translations/common";

console.log(common.hello());
console.log(common.nameAndAge("John", 25));
// ---cut-after---
// @filename: translations.d.ts
declare module "virtual:translations/common" {
	export function hello(): string;
	export function nameAndAge(name: string, age: number): string;
}
```

When you start the development server, Diacritic will generate the types and translations files, allowing you to use them in your code. If you follow the setup correctly, you should see the "Hello world!" string in your console and also a file named `translations.d.ts` in your project.
