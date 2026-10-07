/*
  Warnings:

  - The values [DAILY,WEEKLY,PERSONAL_TRAINING,TRIAL,DAY_PASS] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanType_new" AS ENUM ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');
ALTER TABLE "membership_plans" ALTER COLUMN "type" TYPE "PlanType_new" USING ("type"::text::"PlanType_new");
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
ALTER TYPE "PlanType_new" RENAME TO "PlanType";
DROP TYPE "public"."PlanType_old";
COMMIT;

-- AlterTable
ALTER TABLE "membership_plans" ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false;
