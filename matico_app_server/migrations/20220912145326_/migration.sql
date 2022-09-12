/*
  Warnings:

  - You are about to drop the column `resourceId` on the `collaborators` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,appId,datasetId]` on the table `collaborators` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "collaborators" DROP CONSTRAINT "app_colaboration_id";

-- DropForeignKey
ALTER TABLE "collaborators" DROP CONSTRAINT "dataset_colaboration_id";

-- DropIndex
DROP INDEX "collaborators_userId_resourceId_key";

-- AlterTable
ALTER TABLE "collaborators" DROP COLUMN "resourceId",
ADD COLUMN     "appId" TEXT,
ADD COLUMN     "datasetId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_userId_appId_datasetId_key" ON "collaborators"("userId", "appId", "datasetId");

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "app_colaboration_id" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "dataset_colaboration_id" FOREIGN KEY ("datasetId") REFERENCES "datasets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
