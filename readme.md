# Minecraft CurseForge API

An ergonomic Deno wrapper around the NPM package [curseforge-api](https://github.com/Smiley43210/curseforge-api/), tailored just for Minecraft.

## Table of Contents

- [Getting Started](#getting-started)
- [Type Definitions](#type-definitions)
- [Complete Example](#complete-example)
- [Local Development](#local-development)

## Getting Started

In a Deno project:

<!-- deno-fmt-ignore -->
```ts
import { CurseForge } from "TDB";

const curseForge = new CurseForge("YOUR_API_KEY");

curseForge.getMod("jei")                // get mod by slug or ID #
curseForge.searchMods("vazkii")         // search mod titles and authors

curseForge.getFiles(modID, options)     // get all files, paginated
curseForge.getNewestFile(modID, options)

curseForge.getDependenciesDeep(options) // recursively get deps
curseForge.getDependencyGraph(options)  // get deps in a graph structure
```

## Type Definitions

The package provides robust types specific to Minecraft, trimming out unused or irrelevant CurseForge fields, and altering the raw data to be more user-friendly and human-readable.

```ts
import type { File, MinecraftVersion, Mod, ModLoader } from "TDB";
```

Types are also re-exported under the `CurseForge` namespace, which is merged with the main `CurseForge` class. This allows you to keep your imports very clean, and in more complex files it contextualizes type names for ease of comprehension.

```ts
import { CurseForge } from "TDB";

const curseForge = new CurseForge("YOUR_API_KEY");

const modLoader: CurseForge.ModLoader = "Forge"; // easy access

let file: CurseForge.File; // disambiguated from browser File API or other File types
```

Additionally, the type of each method's options are nested under the `CurseForge` namespace:

```ts
import { CurseForge } from "TDB";

const searchOptions: CurseForge.searchMods.Options = {
  // in here, you'll get autocomplete and intellisense for this complex type
};
```

## Complete Example

In this example, we get the popular mod [Quark](https://www.curseforge.com/minecraft/mc-mods/quark), find its newest file for our targeted Minecraft version and mod loader, then fetch all of its dependencies.

```ts
import { CurseForge } from "TDB";

const curseForge = new CurseForge("YOUR_API_KEY");

const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";

const mod = await curseForge.getMod("quark");
const file = await curseForge.getNewestFile(
  quark.id,
  { minecraftVersion, modLoader },
);

const { dependencies } = await curseForge.getDependencyGraph(
  { file, mod, minecraftVersion, modLoader },
);
console.log(Object.keys(dependencies.required)); // ["autoreglib"]
console.log(dependencies.required.autoreglib);
// {
//    mod: Mod,
//    file?: newest file matching your criteria, if one was found
//    dependencies?: that file's dependencies, in the same shape as this
// }
```

## Local Development

With [Deno](https://deno.land/) installed:

```sh
deno run -A example/<pick one>  # run one of the example scripts; expects a .env file
deno test -A --watch .          # run unit tests (only tests for imports)
```

You'll probably want to get a CurseForge API key [here](https://docs.curseforge.com/#authentication), then create a `.env` file that exports it as `CF_API_KEY`:

```env
# .env at the root of the repo
CF_API_KEY = ABC123DEF567
```
