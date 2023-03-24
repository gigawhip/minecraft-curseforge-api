# Minecraft CurseForge API

An ergonomic Deno wrapper around the NPM package [curseforge-api](https://github.com/Smiley43210/curseforge-api/), tailored just for Minecraft.

## Table of Contents

- [Getting Started](#getting-started)
- [Type Definitions](#type-definitions)
- [Complete Example](#complete-example)

## Getting Started

In a Deno project:

<!-- deno-fmt-ignore -->
```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.3.0/mod.ts";

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
import type {
  File,
  MinecraftVersion,
  Mod,
  ModLoader,
} from "https://deno.land/x/minecraft_curseforge_api@0.3.0/mod.ts";
```

Types are also re-exported under the `CurseForge` namespace, which is merged with the main `CurseForge` class. This allows you to keep your imports very clean, and in more complex files it contextualizes type names for ease of comprehension.

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.3.0/mod.ts";

const curseForge = new CurseForge("YOUR_API_KEY");

const modLoader: CurseForge.ModLoader = "Forge"; // easy access

let file: CurseForge.File; // disambiguated from browser File API or other File types
```

Additionally, the type of each method's options are nested under the `CurseForge` namespace:

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.3.0/mod.ts";

const searchOptions: CurseForge.searchMods.Options = {
  // in here, you'll get autocomplete and intellisense for this complex type
};
```

## Complete Example

In this example, we get the popular mod [Quark](https://www.curseforge.com/minecraft/mc-mods/quark), find its newest file for our targeted Minecraft version and mod loader, then fetch all of its dependencies. At each stage we check to ensure that the previous operation was successful before proceeding - in this exact example it's not necessary, but if you copy this script and modify the mod slug, mod loader, or minecraft version, these checks will save you!

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.3.0/mod.ts";

const curseForge = new CurseForge("YOUR_API_KEY");

const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";

const mod = await curseForge.getMod("quark");

if (!mod) {
  console.log("Couldn't find a mod with that slug!");
  Deno.exit(1);
}

const file = await curseForge.getNewestFile(
  mod.id,
  { minecraftVersion, modLoader },
);

if (!file) {
  console.log("Couldn't find a file for this mod loader and MC version!");
  Deno.exit(1);
}

const graph = await curseForge.getDependencyGraph(
  { file, mod, minecraftVersion, modLoader },
);

if (!graph) {
  console.log("Couldn't make the dependency graph!");
  console.log(
    "When you provide both file and mod, this happens if file.modID !== mod.id",
  );
  Deno.exit(1);
}

const { dependencies } = graph;
console.log(dependencies.required && Object.keys(dependencies.required));
// [ "autoreglib" ]   Quark's only required dependency

console.log(dependencies.required?.autoreglib);
// {
//    mod: the AutoRegLib mod object,
//    file?: newest file matching your criteria, if one was found
//    dependencies?: that file's dependencies, in the same shape as this
// }
```
