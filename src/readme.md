# Minecraft CurseForge API

An ergonomic Deno wrapper around the NPM package [curseforge-api](https://github.com/Smiley43210/curseforge-api/), tailored just for Minecraft.

## Table of Contents

- [Getting Started](#getting-started)
- [Type Definitions](#type-definitions)
- [Errors](#errors)
- [Cache](#cache)
- [Complete Example](#complete-example)

## Getting Started

In a Deno project:

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";

const curseForge = new CurseForge("YOUR_API_KEY", defaultOptions);

await curseForge.getMod(slugOrID);
await curseForge.searchMods(nameOrAuthor, options);
await curseForge.getFiles(modID, options);
await curseForge.getNewestFile(modID, options);

const dependencies = curseForge.dependencies(file, options);

for await (const [modID, file] of dependencies) {
  // do something with dependency
}

// helper methods
await dependencies.toEntries();
await dependencies.toObject();
await dependencies.toFiles();
await dependencies.toMap();
await dependencies.toGraph();
```

## Type Definitions

The package provides robust types specific to Minecraft, trimming out unused or irrelevant CurseForge fields, and altering the raw data to be more user-friendly and human-readable.

```ts
import type {
  File,
  MinecraftVersion,
  Mod,
  ModLoader,
} from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";
```

Types are also re-exported under the `CurseForge` namespace, which is merged with the main `CurseForge` class. This allows you to keep your imports very clean, and in more complex files it contextualizes type names for ease of comprehension.

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";

const curseForge = new CurseForge("YOUR_API_KEY");

const modLoader: CurseForge.ModLoader = "Forge"; // easy access

let file: CurseForge.File; // disambiguated from browser File API or other File types
```

## Errors

Errors are thrown in the following circumstances:

- A `CurseForgeResponseError` is thrown when an error happens while fetching data.

- A `NotFoundError` is thrown when a mod or file is not found by `CurseForge.prototype.getMod()` or `CurseForge.prototype.getNewestFile()`.

- A `TypeError` is thrown when `CurseForge.prototype.dependencies()` is called without a minecraft version or mod loader registered.

The custom errors are exported from both `mod.ts` and the `CurseForge` namespace for convenience:

```ts
import {
  CurseForge,
  NotFoundError,
} from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";

CurseForge.errors.NotFound; // mirrors Deno.errors API

CurseForge.errors.NotFound === NotFoundError; // true
```

Example usage:

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";

new CurseForge("YOUR_API_KEY")
  .getMod("definitely not a mod,.,.,.,.,.")
  .catch((error) => {
    if (error instanceof CurseForge.errors.NotFound) {
      console.log("Mod not found!");
    } else {
      console.log("Something else went wrong!");
    }
  });
```

## Cache

API calls are cached in-memory to avoid duplicate lookups.

```ts
await curseForge.getMod("jei");
await curseForge.getMod("jei"); // cached; doesn't make a network request
```

The cache is cleared when the `CurseForge` instance is garbage collected, or when the `clearCache()` method is called.

```ts
curseForge.clearCache();
```

## Complete Example

In this example, we get the popular mod [Quark](https://www.curseforge.com/minecraft/mc-mods/quark), find its newest file for our targeted Minecraft version and mod loader, then fetch all of its required dependencies. At each stage we check to ensure that the previous operation was successful before proceeding - in this exact example it's not necessary, but if you copy this script and modify the mod slug, mod loader, or minecraft version, these checks will save you!

```ts
import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";

const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";

const curseForge = new CurseForge(API_KEY, { minecraftVersion, modLoader });
const mod = await curseForge.getMod("quark");
const file = await curseForge.getNewestFile(mod.id);

curseForge.dependencies(file, { include: ["required"] })
  .toFiles()
  .then((depFiles) =>
    depFiles.forEach((depFile) => console.log(depFile.displayName))
  );
```
