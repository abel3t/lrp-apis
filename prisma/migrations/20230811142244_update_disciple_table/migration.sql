/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Disciple` table. All the data in the column will be lost.
  - Added the required column `curatorId` to the `Disciple` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Disciple" DROP CONSTRAINT "Disciple_creatorId_fkey";

-- AlterTable
ALTER TABLE "Disciple" DROP COLUMN "creatorId",
ADD COLUMN     "curatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Disciple" ADD CONSTRAINT "Disciple_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
