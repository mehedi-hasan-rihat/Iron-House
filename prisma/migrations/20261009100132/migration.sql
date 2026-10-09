/*
  Warnings:

  - You are about to drop the column `email` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "email";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "role_permissions";
