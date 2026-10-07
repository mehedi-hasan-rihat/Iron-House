import { PlanType } from "../../src/generated/prisma/client";

export type PlanSeed = {
  name:         string;
  description:  string;
  durationDays: number;
  price:        number;
  type:         PlanType;
  features: {
    gymAccess:       boolean;
    groupClasses:    boolean;
    personalTrainer: boolean;
    locker:          boolean;
    dietConsult:     boolean;
  };
};

export const PLANS: PlanSeed[] = [
  {
    name:         "Daily",
    description:  "Single day full gym access",
    durationDays: 1,
    price:        200,
    type:         "DAY_PASS",
    features:     { gymAccess: true,  groupClasses: false, personalTrainer: false, locker: false, dietConsult: false },
  },
  {
    name:         "Monthly",
    description:  "Full gym access for one month",
    durationDays: 30,
    price:        1500,
    type:         "MONTHLY",
    features:     { gymAccess: true,  groupClasses: true,  personalTrainer: false, locker: true,  dietConsult: false },
  },
  {
    name:         "Quarterly",
    description:  "Full access for 3 months",
    durationDays: 90,
    price:        4000,
    type:         "QUARTERLY",
    features:     { gymAccess: true,  groupClasses: true,  personalTrainer: false, locker: true,  dietConsult: false },
  },
  {
    name:         "Half-Yearly",
    description:  "Best value — 6 months full access",
    durationDays: 180,
    price:        7000,
    type:         "HALF_YEARLY",
    features:     { gymAccess: true,  groupClasses: true,  personalTrainer: true,  locker: true,  dietConsult: true  },
  },
  {
    name:         "Annual",
    description:  "12 months full access + priority booking",
    durationDays: 365,
    price:        12000,
    type:         "YEARLY",
    features:     { gymAccess: true,  groupClasses: true,  personalTrainer: true,  locker: true,  dietConsult: true  },
  },
  {
    name:         "Personal Training",
    description:  "Monthly plan with dedicated personal trainer",
    durationDays: 30,
    price:        5000,
    type:         "PERSONAL_TRAINING",
    features:     { gymAccess: true,  groupClasses: true,  personalTrainer: true,  locker: true,  dietConsult: true  },
  },
  {
    name:         "Free Trial",
    description:  "3-day trial — admin assigned only",
    durationDays: 3,
    price:        0,
    type:         "TRIAL",
    features:     { gymAccess: true,  groupClasses: false, personalTrainer: false, locker: false, dietConsult: false },
  },
];
