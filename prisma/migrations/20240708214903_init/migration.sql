/*
  Warnings:

  - You are about to drop the column `supportId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Support` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_supportId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "href" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "supportId";

-- DropTable
DROP TABLE "Support";
