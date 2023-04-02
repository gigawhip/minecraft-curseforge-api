/**
 * Find more example scripts at https://github.com/gigawhip/minecraft-curseforge-api/tree/main/example
 *
 * @example
 * ```ts
 * import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.4.0/mod.ts";
 *
 * const modLoader: CurseForge.ModLoader = "Forge";
 * const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";
 * const curseForge = new CurseForge(API_KEY, { minecraftVersion, modLoader });
 *
 * const mod = await curseForge.getMod("quark");
 *
 * if (!mod) {
 *   console.log("Couldn't find a mod with that slug!");
 *   Deno.exit(1);
 * }
 *
 * const file = await curseForge.getNewestFile(mod.id);
 *
 * if (!file) {
 *   console.log("Couldn't find a file for this mod loader and MC version!");
 *   Deno.exit(1);
 * }
 *
 * curseForge
 *   .dependencies(file, { include: ["required"] })
 *   .toFiles()
 *   .then((depFiles) =>
 *     depFiles.forEach((depFile) => console.log(depFile.displayName))
 *   );
 * ```
 *
 * @module
 */

export { CurseForge } from "./CurseForge.ts";

export type { Category } from "./common/categories.ts";
export type { MinecraftVersion } from "./common/minecraftVersion.ts";
export type { ModLoader } from "./common/modLoader.ts";
export type {
  DependenciesOptions,
  DependencyGraphNode,
} from "./file/Dependencies.ts";
export type { DependencyType } from "./file/dependencyType.ts";
export type { File } from "./file/File.ts";
export type { GetFilesOptions } from "./file/getFiles.ts";
export type { GetNewestFileOptions } from "./file/getNewestFile.ts";
export type { Mod } from "./mod/Mod.ts";
export type { SearchModsOptions } from "./mod/searchMods.ts";
export type { SearchSortField } from "./mod/sortField.ts";
