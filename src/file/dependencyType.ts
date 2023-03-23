export const DEPENDENCY_TYPE_NAMES = {
  1: "embeddedLibrary",
  2: "optional",
  3: "required",
  4: "tool",
  5: "incompatible",
  6: "include",
} as const;

type T = typeof DEPENDENCY_TYPE_NAMES;

export type DependencyTypeName = T[keyof T];
