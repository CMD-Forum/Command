/*
  Warnings:

  - You are about to drop the column `admin_ids` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `sidebar_md` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "admin_ids",
DROP COLUMN "sidebar_md";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tagline";
