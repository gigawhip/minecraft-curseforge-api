import { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Pagination, VersionAndModLoader } from "./common/types.ts";
import type { File } from "./file/File.ts";
import type { Mod } from "./mod/Mod.ts";
import type { MinecraftVersion } from "./common/minecraftVersion.ts";
import type { ModLoader } from "./common/modLoader.ts";

import { getDependenciesDeep } from "./dependencies/getDependenciesDeep.ts";
import { getDependencyGraph } from "./dependencies/getDependencyGraph.ts";
import { getFiles } from "./file/getFiles.ts";
import { getNewestFile } from "./file/getNewestFile.ts";
import { getMod } from "./mod/getMod.ts";
import { searchMods } from "./mod/searchMods.ts";

export declare namespace CurseForge {
  export {
    File,
    getDependenciesDeep,
    getDependencyGraph,
    getFiles,
    getNewestFile,
    // getMod, // doesn't have a namespace
    MinecraftVersion,
    Mod,
    ModLoader,
    searchMods,
  };
}

export class CurseForge {
  #client: CurseForgeClient;

  constructor(apiKey: string) {
    this.#client = new CurseForgeClient(apiKey);
  }

  async getMod(slugOrID: string | number) {
    return await getMod(this.#client, slugOrID);
  }

  /** Find mods by full text search of mod name and author name. */
  async searchMods(
    query: string,
    options?: CurseForge.searchMods.Options,
  ) {
    const result = await searchMods(this.#client, query, options);

    return result;
  }

  async getFiles(
    modID: number,
    options?: Pagination & VersionAndModLoader,
  ) {
    const result = await getFiles(this.#client, modID, options);

    return result;
  }

  async getNewestFile(modID: number, options?: VersionAndModLoader) {
    return await getNewestFile(this.#client, modID, options);
  }

  /**
   * Constructs a complete dependency graph in a normalized structure, which has
   * no circular references and so can be safely serialized and iterated over.
   *
   * Dependency graphs require both `File` and `Mod` objects - it is advisable to
   * provide both, otherwise one will be retrieved using information from the
   * other.
   *
   * @returns `undefined` if an appropriate file cannot be found for your mod loader and Minecraft version, or if both `File` and `Mod` are provided but their mod IDs don't match.
   */
  async getDependenciesDeep(options: CurseForge.getDependenciesDeep.Options) {
    return await getDependenciesDeep(this.#client, options);
  }

  /**
   * Constructs a complete dependency graph. Unlike
   * `getDependenciesDeep()`, the returned data structure may contain
   * circular references and so cannot be safely serialized or iterated over.
   *
   * Dependency graphs require both `File` and `Mod` objects - it is advisable to
   * provide both, otherwise one will be retrieved using information from the
   * other.
   *
   * @returns `undefined` if an appropriate file cannot be found for your mod loader and Minecraft version, or if both `File` and `Mod` are provided but their mod IDs don't match.
   */
  async getDependencyGraph(options: CurseForge.getDependencyGraph.Options) {
    return await getDependencyGraph(this.#client, options);
  }
}
