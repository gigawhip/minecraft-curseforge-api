import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import { GAME_ID } from "./constants.ts";

/** Generate the constant CLASSES exported below */
export async function getClasses(client: CurseForgeClient) {
  return Object.fromEntries(
    (await client.getCategories(GAME_ID))
      .filter((category) => category.isClass)
      .map(({ name, id }) => [name, id]),
  );
}

/**
 * CurseForge's term for top-level entity types like mod vs modpack vs
 * resource pack
 */
export const CLASSES = {
  Customization: 4546,
  Modpacks: 4471,
  "Bukkit Plugins": 5,
  "Resource Packs": 12,
  Addons: 4559,
  Worlds: 17,
  Mods: 6,
} as const;

export type Class = keyof typeof CLASSES;

async function _getCategoriesByClassName(
  client: CurseForgeClient,
  className: Class,
) {
  return Object.fromEntries(
    (await client.getCategories(GAME_ID, {
      classId: CLASSES[className],
    }))
      .map(({ name, id }) => [name, id]),
  );
}

/** Generate the constant MOD_CATEGORIES exported below */
export async function getModCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Mods");
}

export const MOD_CATEGORIES = {
  Buildcraft: 432,
  Galacticraft: 5232,
  "Tinker's Construct": 428,
  Structures: 409,
  Addons: 426,
  "Armor, Tools, and Weapons": 434,
  Genetics: 418,
  "Blood Magic": 4485,
  Miscellaneous: 425,
  Mobs: 411,
  "Map and Information": 423,
  Thaumcraft: 430,
  "Player Transport": 414,
  "Energy, Fluid, and Item Transport": 415,
  Automation: 4843,
  "World Gen": 406,
  Food: 436,
  CraftTweaker: 4773,
  KubeJS: 5314,
  Biomes: 407,
  Energy: 417,
  "Thermal Expansion": 427,
  "Industrial Craft": 429,
  "API and Library": 421,
  "Adventure and RPG": 422,
  "Utility & QoL": 5191,
  "Server Utility": 435,
  Farming: 416,
  Redstone: 4558,
  Magic: 419,
  Forestry: 433,
  Education: 5299,
  Cosmetic: 424,
  Technology: 412,
  "Twitch Integration": 4671,
  Storage: 420,
  Dimensions: 410,
  "Applied Energistics 2": 4545,
  "Ores and Resources": 408,
  Processing: 413,
  MCreator: 4906,
  Skyblock: 6145,
} as const;

export type ModCategory = keyof typeof MOD_CATEGORIES;

/** Generate the constant MODPACK_CATEGORIES exported below */
export async function getModpackCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Modpacks");
}

export const MODPACK_CATEGORIES = {
  "Sci-Fi": 4474,
  Multiplayer: 4484,
  "Mini Game": 4477,
  "Small / Light": 4481,
  "Adventure and RPG": 4475,
  Hardcore: 4479,
  "Combat / PvP": 4483,
  "Vanilla+": 5128,
  Skyblock: 4736,
  Quests: 4478,
  "Map Based": 4480,
  Tech: 4472,
  Magic: 4473,
  "Extra Large": 4482,
  Exploration: 4476,
  "FTB Official Pack": 4487,
} as const;

export type ModpackCategory = keyof typeof MODPACK_CATEGORIES;

/** Generate the constant RESOURCE_PACK_CATEGORIES exported below */
export async function getResourcePackCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Resource Packs");
}

export const RESOURCE_PACK_CATEGORIES = {
  "128x": 396,
  Miscellaneous: 405,
  "512x and Higher": 398,
  "64x": 395,
  Medieval: 402,
  Steampunk: 399,
  "Data Packs": 5193,
  Traditional: 403,
  "Font Packs": 5244,
  Animated: 404,
  "256x": 397,
  "Photo Realistic": 400,
  "Mod Support": 4465,
  "16x": 393,
  "32x": 394,
  Modern: 401,
} as const;

export type ResourcePackCategory = keyof typeof RESOURCE_PACK_CATEGORIES;

/** Generate the constant CUSTOMIZATION_CATEGORIES exported below */
export async function getCustomizationCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Customization");
}

export const CUSTOMIZATION_CATEGORIES = {
  "Lucky Blocks": 4548,
  "Building Gadgets": 4752,
  "Hardcore Questing Mode": 4551,
  Guidebook: 4549,
  FancyMenu: 5186,
  Progression: 4556,
  Recipes: 4554,
  Configuration: 4547,
  "World Gen": 4555,
  CraftTweaker: 4553,
  Quests: 4550,
  Scripts: 4552,
} as const;

export type CustomizationCategory = keyof typeof CUSTOMIZATION_CATEGORIES;

/** Generate the constant ADDON_CATEGORIES exported below */
export async function getAddonCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Addons");
}

export const ADDON_CATEGORIES = {
  Worlds: 4560,
  "Resource Packs": 4561,
  Scenarios: 4562,
} as const;

export type AddonCategory = keyof typeof ADDON_CATEGORIES;

/** Generate the constant BUKKIT_PLUGIN_CATEGORIES exported below */
export async function getBukkitPluginCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Bukkit Plugins");
}

export const BUKKIT_PLUGIN_CATEGORIES = {
  Teleportation: 134,
  "Role Playing": 132,
  "Admin Tools": 115,
  "World Generators": 131,
  Fun: 126,
  "Website Administration": 130,
  Miscellaneous: 133,
  "Developer Tools": 122,
  Mechanics: 129,
  "Chat Related": 117,
  "Anti-Griefing Tools": 116,
  "Twitch Integration": 4672,
  "World Editing and Management": 124,
  Fixes: 125,
  Economy: 123,
  General: 127,
  Informational: 128,
} as const;

export type BukkitPluginCategory = keyof typeof BUKKIT_PLUGIN_CATEGORIES;

/** Generate the constant WORLD_CATEGORIES exported below */
export async function getWorldCategories(client: CurseForgeClient) {
  return await _getCategoriesByClassName(client, "Worlds");
}

export const WORLD_CATEGORIES = {
  "Game Map": 250,
  Creation: 249,
  Adventure: 248,
  "Modded World": 4464,
  Survival: 253,
  Parkour: 251,
  Puzzle: 252,
} as const;

export type WorldCategory = keyof typeof WORLD_CATEGORIES;

export declare namespace Category {
  export type Mod = ModCategory;
  export type Modpack = ModpackCategory;
  export type ResourcePack = ResourcePackCategory;
  export type Customization = CustomizationCategory;
  export type Addon = AddonCategory;
  export type BukkitPlugin = BukkitPluginCategory;
  export type World = WorldCategory;
}
