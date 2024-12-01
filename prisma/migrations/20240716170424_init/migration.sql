-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "deletedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedByAuthor" BOOLEAN NOT NULL DEFAULT false;
