/*
  Warnings:

  - You are about to drop the column `display_name` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `rules` on the `Community` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Community_display_name_key";

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "display_name",
DROP COLUMN "rules";

-- CreateTable
CREATE TABLE "CommunityRule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CommunityRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRule_id_key" ON "CommunityRule"("id");

-- AddForeignKey
ALTER TABLE "CommunityRule" ADD CONSTRAINT "CommunityRule_communityID_fkey" FOREIGN KEY ("communityID") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
