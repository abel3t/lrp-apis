/*
  Warnings:

  - Made the column `memberDay` on table `Person` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "memberDay" SET NOT NULL,
ALTER COLUMN "memberDay" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "memberDay" SET DATA TYPE TIMESTAMPTZ(0);
