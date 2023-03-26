import {
  CurseForgeClient,
  CurseForgeModLoaderType,
} from "https://esm.sh/curseforge-api@1.0.2";

import type { Pagination, VersionAndModLoader } from "../common/types.ts";
import type { SearchSortField } from "./sortField.ts";

import { CLASSES, MOD_CATEGORIES, ModCategory } from "../common/categories.ts";
import { GAME_ID } from "../common/constants.ts";
import { removeUndefinedProperties } from "../common/utils.ts";
import { mod } from "./Mod.ts";

export declare namespace searchMods {
  export type Options =
    & Pagination
    & VersionAndModLoader
    & {
      category?: ModCategory;
      sortField?: SearchSortField;
      sortOrder?: "asc" | "desc";
    };
}

/**
 * @private Use CurseForge.getMod() instead.
 *
 * Find mods by full text search of mod name and author name.
 */
export async function searchMods(
  curseForge: CurseForgeClient,
  query: string,
  { minecraftVersion, modLoader, category, ...options }: searchMods.Options =
    {},
) {
  const { pagination, data: _data } = await curseForge
    .searchMods(
      GAME_ID,
      removeUndefinedProperties({
        classId: CLASSES.Mods,
        gameVersion: minecraftVersion,
        categoryId: category && MOD_CATEGORIES[category],
        modLoaderType: modLoader && CurseForgeModLoaderType[modLoader],
        searchFilter: query,
        ...options,
      }),
    );

  return { pagination, data: _data.map(mod) };
}
