/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `membership_plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "membership_plans_name_key" ON "membership_plans"("name");
