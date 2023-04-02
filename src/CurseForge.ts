import { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Category } from "./common/categories.ts";
import type { MinecraftVersion } from "./common/minecraftVersion.ts";
import type { ModLoader } from "./common/modLoader.ts";
import type { VersionAndModLoader } from "./common/types.ts";
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

import { Cache } from "./Cache.ts";
import { Dependencies } from "./file/Dependencies.ts";
import { getFiles } from "./file/getFiles.ts";
import { getNewestFile } from "./file/getNewestFile.ts";
import { getMod } from "./mod/getMod.ts";
import { searchMods } from "./mod/searchMods.ts";

type CurseForgeDefaultOptions = VersionAndModLoader;

export declare namespace CurseForge {
  export {
    Category,
    CurseForgeDefaultOptions,
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
  #cache: Cache;
  #defaultOptions: CurseForgeDefaultOptions;

  constructor(apiKey: string, defaultOptions: CurseForgeDefaultOptions = {}) {
    this.#client = new CurseForgeClient(apiKey);
    this.#cache = new Cache();
    this.#defaultOptions = defaultOptions;
  }

  async getMod(slugOrID: string | number) {
    return await getMod(this.#client, this.#cache, slugOrID);
  }

  /** Find mods by full text search of mod name and author name. */
  async searchMods(query: string, options?: SearchModsOptions) {
    const opts = Object.assign({}, this.#defaultOptions, options);

    return await searchMods(this.#client, this.#cache, query, opts);
  }

  async getFiles(modID: number, options?: GetFilesOptions) {
    const opts = Object.assign({}, this.#defaultOptions, options);

    return await getFiles(this.#client, this.#cache, modID, opts);
  }

  async getNewestFile(modID: number, options?: GetNewestFileOptions) {
    const opts = Object.assign({}, this.#defaultOptions, options);

    return await getNewestFile(this.#client, this.#cache, modID, opts);
  }

  dependencies(
    file: File,
    options: Partial<DependenciesOptions> = {},
  ) {
    options = Object.assign({}, this.#defaultOptions, options);

    if (!options.minecraftVersion) {
      throw new TypeError(
        "Missing minecraftVersion. Pass it as a default option to CurseForge " +
          "constructor or as an option to dependencies().",
      );
    }
    if (!options.modLoader) {
      throw new TypeError(
        "Missing modLoader. Pass it as a default option to CurseForge " +
          "constructor or as an option to dependencies().",
      );
    }

    return new Dependencies(
      this.#client,
      this.#cache,
      file,
      options as DependenciesOptions,
    );
  }

  clearCache() {
    this.#cache = new Cache();
  }
}
