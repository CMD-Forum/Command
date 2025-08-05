/*
  Warnings:

  - You are about to drop the `CommunityAdminship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityAdminship" DROP CONSTRAINT "CommunityAdminship_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityAdminship" DROP CONSTRAINT "CommunityAdminship_userId_fkey";

-- DropTable
DROP TABLE "CommunityAdminship";

-- CreateTable
CREATE TABLE "_ModeratedCommunities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ModeratedCommunities_AB_unique" ON "_ModeratedCommunities"("A", "B");

-- CreateIndex
CREATE INDEX "_ModeratedCommunities_B_index" ON "_ModeratedCommunities"("B");

-- AddForeignKey
ALTER TABLE "_ModeratedCommunities" ADD CONSTRAINT "_ModeratedCommunities_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModeratedCommunities" ADD CONSTRAINT "_ModeratedCommunities_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
