import type {
  CurseForgePaginatedResponse,
} from "https://esm.sh/curseforge-api@1.0.2/v1/Client.js";

import type { File } from "./file/File.ts";
import type { Mod } from "./mod/Mod.ts";
import type { SearchModsOptions } from "./mod/searchMods.ts";

export class Cache {
  files: { [QueryString: string]: CurseForgePaginatedResponse<File> } = {};
  newestFile: { [QueryString: string]: File } = {};
  mod: { [SlugOrID: string | number]: Mod } = {};
  mods: { [QueryString: string]: CurseForgePaginatedResponse<Mod> } = {};

  constructor() {}

  queryString(root: number | string, options?: SearchModsOptions) {
    let query = String(root);

    if (options?.minecraftVersion) query += `:${options.minecraftVersion}`;
    if (options?.modLoader) query += `:${options.modLoader}`;
    if (options?.index !== undefined) query += `:I${options.index}`;
    if (options?.pageSize !== undefined) query += `:P${options.pageSize}`;
    if (options?.category) query += `:${options.category}`;
    if (options?.sortField) query += `:${options.sortField}`;
    if (options?.sortOrder) query += `:${options.sortOrder}`;

    return query;
  }
}
