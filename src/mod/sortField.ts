export const SEARCH_SORT_FIELDS = {
  1: "Featured",
  2: "Popularity",
  3: "LastUpdated",
  4: "Name",
  5: "Author",
  6: "TotalDownloads",
  7: "Category",
  8: "GameVersion",
} as const;

type T = typeof SEARCH_SORT_FIELDS;

export type SearchSortField = T[keyof T];
