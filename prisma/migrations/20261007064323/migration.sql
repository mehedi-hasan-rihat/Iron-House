/*
  Warnings:

  - You are about to drop the `landing_page` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'MONEYBAG';

-- DropTable
DROP TABLE "landing_page";
