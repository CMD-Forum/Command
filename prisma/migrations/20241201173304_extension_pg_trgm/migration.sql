-- AlterTable
ALTER TABLE "Community" ALTER COLUMN "searchIdx" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "searchIdx" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "searchIdx" DROP NOT NULL;

-- Allows use of `pg_trgm`, which Prisma doesn't allow natively for some reason
CREATE EXTENSION pg_trgm;
