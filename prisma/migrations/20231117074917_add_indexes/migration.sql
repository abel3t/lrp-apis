-- DropIndex
DROP INDEX "Absence_isDeleted_idx";

-- DropIndex
DROP INDEX "Account_isDeleted_idx";

-- DropIndex
DROP INDEX "Care_isDeleted_idx";

-- DropIndex
DROP INDEX "Disciple_isDeleted_idx";

-- DropIndex
DROP INDEX "Group_isDeleted_idx";

-- DropIndex
DROP INDEX "Person_isDeleted_idx";

-- CreateIndex
CREATE INDEX "Absence_organizationId_personId_date_isDeleted_idx" ON "Absence"("organizationId", "personId", "date", "isDeleted");

-- CreateIndex
CREATE INDEX "Account_organizationId_isDeleted_idx" ON "Account"("organizationId", "isDeleted");

-- CreateIndex
CREATE INDEX "Care_organizationId_curatorId_personId_date_isDeleted_idx" ON "Care"("organizationId", "curatorId", "personId", "date", "isDeleted");

-- CreateIndex
CREATE INDEX "Disciple_organizationId_curatorId_date_isDeleted_idx" ON "Disciple"("organizationId", "curatorId", "date", "isDeleted");

-- CreateIndex
CREATE INDEX "Group_organizationId_isDeleted_idx" ON "Group"("organizationId", "isDeleted");

-- CreateIndex
CREATE INDEX "Person_organizationId_curatorId_isDeleted_idx" ON "Person"("organizationId", "curatorId", "isDeleted");
