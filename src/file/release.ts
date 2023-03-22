export const RELEASE_TYPE_NAMES = {
  1: "Release",
  2: "Beta",
  3: "Alpha",
} as const;

type T = typeof RELEASE_TYPE_NAMES;

export type ReleaseTypeName = T[keyof T];
