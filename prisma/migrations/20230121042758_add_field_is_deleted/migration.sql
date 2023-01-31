-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Care" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ministry" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Account_isDeleted_idx" ON "Account"("isDeleted");

-- CreateIndex
CREATE INDEX "Care_isDeleted_idx" ON "Care"("isDeleted");

-- CreateIndex
CREATE INDEX "Friend_isDeleted_idx" ON "Friend"("isDeleted");

-- CreateIndex
CREATE INDEX "Member_isDeleted_idx" ON "Member"("isDeleted");

-- CreateIndex
CREATE INDEX "Ministry_isDeleted_idx" ON "Ministry"("isDeleted");

-- CreateIndex
CREATE INDEX "Organization_isDeleted_idx" ON "Organization"("isDeleted");

-- CreateIndex
CREATE INDEX "Team_isDeleted_idx" ON "Team"("isDeleted");
