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

for await (const dependency of curseForge.dependencies({ file, ...options })) {
  // do something with dependency
}

curseForge.dependencies({ file, ...options }).toEntries()
curseForge.dependencies({ file, ...options }).toObject()
curseForge.dependencies({ file, ...options }).toMap()
curseForge.dependencies({ file, ...options }).toGraph()
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

## Complete Example

In this example, we get the popular mod [Quark](https://www.curseforge.com/minecraft/mc-mods/quark), find its newest file for our targeted Minecraft version and mod loader, then fetch all of its dependencies. At each stage we check to ensure that the previous operation was successful before proceeding - in this exact example it's not necessary, but if you copy this script and modify the mod slug, mod loader, or minecraft version, these checks will save you!

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.4.0/mod.ts";

const curseForge = new CurseForge("YOUR_API_KEY");
const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";

const mod = await curseForge.getMod("quark");

if (!mod) {
  console.log("Couldn't find a mod with that slug!");
  Deno.exit(1);
}

const file = await curseForge
  .getNewestFile(mod.id, { minecraftVersion, modLoader });

if (!file) {
  console.log("Couldn't find a file for this mod loader and MC version!");
  Deno.exit(1);
}

curseForge
  .dependencies({ file, minecraftVersion, modLoader })
  .toFiles()
  .then((depFiles) =>
    depFiles.forEach((depFile) => console.log(depFile.displayName))
  );
```
