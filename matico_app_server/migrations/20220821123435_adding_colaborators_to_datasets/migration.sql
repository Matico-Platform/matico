-- RenameForeignKey
ALTER TABLE "collaborators" RENAME CONSTRAINT "collaborators_resourceId_fkey" TO "apps_collaborators_resourceId_fkey";

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "datasets_collaborators_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "datasets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
