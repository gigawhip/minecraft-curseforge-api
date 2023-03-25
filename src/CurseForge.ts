import { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { MinecraftVersion } from "./common/minecraftVersion.ts";
import type { ModLoader } from "./common/modLoader.ts";
import type { Pagination, VersionAndModLoader } from "./common/types.ts";
import type { File } from "./file/File.ts";
import type { Mod } from "./mod/Mod.ts";

import { Dependencies } from "./file/Dependencies.ts";
import { getFiles } from "./file/getFiles.ts";
import { getNewestFile } from "./file/getNewestFile.ts";
import { getMod } from "./mod/getMod.ts";
import { searchMods } from "./mod/searchMods.ts";

export declare namespace CurseForge {
  export {
    Dependencies,
    File,
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

  dependencies(
    options: VersionAndModLoader & CurseForge.Dependencies.Options,
  ) {
    return new Dependencies(this.#client, options);
  }
}
