/**
 * Central source of truth for membership plan types.
 * Import from here everywhere — never hardcode type strings in components.
 */

export const PLAN_TYPES = [
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY",
] as const;

export type PlanTypeKey = (typeof PLAN_TYPES)[number];

/** Human-readable labels */
export const PLAN_TYPE_LABELS: Record<PlanTypeKey, string> = {
  MONTHLY:    "Monthly",
  QUARTERLY:  "Quarterly",
  HALF_YEARLY: "Half-Yearly",
  YEARLY:     "Yearly",
};

/** Duration in days — used for display hints */
export const PLAN_TYPE_DURATION: Record<PlanTypeKey, number> = {
  MONTHLY:    30,
  QUARTERLY:  90,
  HALF_YEARLY: 180,
  YEARLY:     365,
};
