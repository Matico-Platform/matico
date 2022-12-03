/*
  Warnings:

  - A unique constraint covering the columns `[userId,resourceId]` on the table `colaborators` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "colaborators_userId_resourceId_key" ON "colaborators"("userId", "resourceId");
