/*
  Warnings:

  - You are about to drop the column `first_name` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `postedDate` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "job" DROP CONSTRAINT "job_customerId_fkey";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "first_name",
DROP COLUMN "last_name";

-- AlterTable
ALTER TABLE "job" DROP COLUMN "postedDate",
DROP COLUMN "type";

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
