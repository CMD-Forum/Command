/*
  Warnings:

  - You are about to drop the column `browser` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "browser";

-- AlterTable
ALTER TABLE "Support" ALTER COLUMN "content" SET DEFAULT '# Support Article 
 Edit this article!';
