export const RELEASE_TYPES = {
  1: "Release",
  2: "Beta",
  3: "Alpha",
} as const;

type T = typeof RELEASE_TYPES;

export type ReleaseType = T[keyof T];
