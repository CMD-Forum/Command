-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "deletedByAdmin" DROP NOT NULL,
ALTER COLUMN "deletedByAuthor" DROP NOT NULL;
