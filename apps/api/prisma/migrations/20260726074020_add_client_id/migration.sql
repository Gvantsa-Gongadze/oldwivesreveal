-- AlterTable
ALTER TABLE "reveals" ADD COLUMN     "clientId" VARCHAR(64);

-- CreateIndex
CREATE INDEX "reveals_clientId_idx" ON "reveals"("clientId");
