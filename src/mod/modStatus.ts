export const MOD_STATUSES = {
  1: "New",
  2: "ChangesRequired",
  3: "UnderSoftReview",
  4: "Approved",
  5: "Rejected",
  6: "ChangesMade",
  7: "Inactive",
  8: "Abandoned",
  9: "Deleted",
  10: "UnderReview",
} as const;

type T = typeof MOD_STATUSES;

export type ModStatus = T[keyof T];
