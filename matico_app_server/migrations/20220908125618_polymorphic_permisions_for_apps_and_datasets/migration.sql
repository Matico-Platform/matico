/*
  Warnings:

  - Changed the type of `resourceType` on the `collaborators` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('App', 'Dataset');

-- AlterTable
ALTER TABLE "collaborators" DROP COLUMN "resourceType",
ADD COLUMN     "resourceType" "ResourceType" NOT NULL DEFAULT 'App';

-- RenameForeignKey
ALTER TABLE "collaborators" RENAME CONSTRAINT "collaborators_resourceId_fkey" TO "app_colaboration_id";

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "dataset_colaboration_id" FOREIGN KEY ("resourceId") REFERENCES "datasets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
