export const SORT_FIELD_NAMES = {
  1: "Featured",
  2: "Popularity",
  3: "LastUpdated",
  4: "Name",
  5: "Author",
  6: "TotalDownloads",
  7: "Category",
  8: "GameVersion",
} as const;

type T = typeof SORT_FIELD_NAMES;

export type SortFieldName = T[keyof T];
