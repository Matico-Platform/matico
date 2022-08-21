-- AddForeignKey
ALTER TABLE "colaborators" ADD CONSTRAINT "colaborators_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
