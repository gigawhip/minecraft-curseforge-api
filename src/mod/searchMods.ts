import {
  CurseForgeClient,
  CurseForgeModLoaderType,
  CurseForgeModsSearchSortField,
  CurseForgeSortOrder,
} from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";
import type { Pagination, VersionAndModLoader } from "../common/types.ts";
import type { SearchSortField } from "./sortField.ts";

import { CLASSES, MOD_CATEGORIES, ModCategory } from "../common/categories.ts";
import { GAME_ID } from "../common/constants.ts";
import { removeUndefinedProperties } from "../common/utils.ts";
import { mod } from "./Mod.ts";

export type SearchModsOptions =
  & Pagination
  & VersionAndModLoader
  & {
    category?: ModCategory;
    sortField?: SearchSortField;
    sortOrder?: "asc" | "desc";
  };

/**
 * @private Use CurseForge.getMod() instead.
 *
 * Find mods by full text search of mod name and author name.
 *
 * @throws {CurseForgeResponseError} when the request fails.
 */
export async function searchMods(
  curseForge: CurseForgeClient,
  cache: Cache,
  searchString: string,
  options: SearchModsOptions = {},
) {
  const query = cache.queryString(searchString, options);
  if (cache.mods[query]) return cache.mods[query];

  const {
    minecraftVersion,
    modLoader,
    sortField,
    sortOrder,
    category,
    ...opts
  } = options;

  const { pagination, data: _data } = await curseForge.searchMods(
    GAME_ID,
    removeUndefinedProperties({
      classId: CLASSES.Mods,
      gameVersion: minecraftVersion,
      categoryId: category && MOD_CATEGORIES[category],
      modLoaderType: modLoader && CurseForgeModLoaderType[modLoader],
      searchFilter: searchString,
      sortField: sortField && CurseForgeModsSearchSortField[sortField],
      sortOrder: sortOrder as CurseForgeSortOrder,
      ...opts,
    }),
  );

  return cache.set("mods", query, { pagination, data: _data.map(mod) });
}
