-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "rules" TEXT[] DEFAULT ARRAY[]::TEXT[];
