-- DropForeignKey
ALTER TABLE "collaborators" DROP CONSTRAINT "datasets_collaborators_resourceId_fkey";

-- RenameForeignKey
ALTER TABLE "collaborators" RENAME CONSTRAINT "apps_collaborators_resourceId_fkey" TO "collaborators_resourceId_fkey";
