-- AlterTable
ALTER TABLE "Community" ALTER COLUMN "searchIdx" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "searchIdx" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "searchIdx" DROP NOT NULL;
