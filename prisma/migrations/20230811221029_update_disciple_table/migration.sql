-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "friendId" TEXT;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
