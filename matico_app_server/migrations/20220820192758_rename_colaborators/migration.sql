/*
  Warnings:

  - You are about to drop the `colaborators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "colaborators" DROP CONSTRAINT "colaborators_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "colaborators" DROP CONSTRAINT "colaborators_userId_fkey";

-- DropTable
DROP TABLE "colaborators";

-- CreateTable
CREATE TABLE "collaborators" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "view" BOOLEAN NOT NULL,
    "edit" BOOLEAN NOT NULL,
    "manage" BOOLEAN NOT NULL,

    CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_userId_resourceId_key" ON "collaborators"("userId", "resourceId");

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
