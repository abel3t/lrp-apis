-- CreateTable
CREATE TABLE "Disciple" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Disciple_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Disciple_isDeleted_idx" ON "Disciple"("isDeleted");

-- AddForeignKey
ALTER TABLE "Disciple" ADD CONSTRAINT "Disciple_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciple" ADD CONSTRAINT "Disciple_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciple" ADD CONSTRAINT "Disciple_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
