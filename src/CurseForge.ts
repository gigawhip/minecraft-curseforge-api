import { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Category } from "./common/categories.ts";
import type { MinecraftVersion } from "./common/minecraftVersion.ts";
import type { ModLoader } from "./common/modLoader.ts";
import type {
  DependenciesOptions,
  DependencyGraphNode,
} from "./file/Dependencies.ts";
import type { DependencyType } from "./file/dependencyType.ts";
import type { File } from "./file/File.ts";
import type { GetFilesOptions } from "./file/getFiles.ts";
import type { GetNewestFileOptions } from "./file/getNewestFile.ts";
import type { Mod } from "./mod/Mod.ts";
import type { SearchModsOptions } from "./mod/searchMods.ts";
import type { SearchSortField } from "./mod/sortField.ts";

import { Dependencies } from "./file/Dependencies.ts";
import { getFiles } from "./file/getFiles.ts";
import { getNewestFile } from "./file/getNewestFile.ts";
import { getMod } from "./mod/getMod.ts";
import { searchMods } from "./mod/searchMods.ts";

export declare namespace CurseForge {
  export {
    Category,
    DependenciesOptions,
    DependencyGraphNode,
    DependencyType,
    File,
    GetFilesOptions,
    GetNewestFileOptions,
    MinecraftVersion,
    Mod,
    ModLoader,
    SearchModsOptions,
    SearchSortField,
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
  async searchMods(query: string, options?: SearchModsOptions) {
    return await searchMods(this.#client, query, options);
  }

  async getFiles(modID: number, options?: GetFilesOptions) {
    return await getFiles(this.#client, modID, options);
  }

  async getNewestFile(modID: number, options?: GetNewestFileOptions) {
    return await getNewestFile(this.#client, modID, options);
  }

  dependencies(options: DependenciesOptions) {
    return new Dependencies(this.#client, options);
  }
}
