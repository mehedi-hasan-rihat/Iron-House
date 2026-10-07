/*
  Warnings:

  - You are about to drop the column `autoRenewal` on the `membership_plans` table. All the data in the column will be lost.
  - You are about to drop the column `trialEnabled` on the `membership_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "membership_plans" DROP COLUMN "autoRenewal",
DROP COLUMN "trialEnabled";
