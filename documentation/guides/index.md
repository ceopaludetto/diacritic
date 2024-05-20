# Getting Started

## Overview

diacritic is a build plugin that aims to provide a modern solution to internacionalization (i18n).
It consists of two major parts:

- A types generator that automatically generate types based on your translation files
- A virtual module generator to generate simple TypeScript functions containing your translation strings

It aims to be highly configurable through different parsers and generators

## Installation

### Prerequisites

A project already configured in one of these bundlers:

- [Esbuild](https://esbuild.github.io/)
- [Farm](https://www.farmfe.org/)
- [Rollup](https://rollupjs.org/)
- [Vite](https://vitejs.dev/)
- [Webpack](https://webpack.js.org/)

Plain JSON files containing your translations strings.

### Packages

For your project you will need the following packages:

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

The setup may differ based on the bundler chosen:

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

:::
