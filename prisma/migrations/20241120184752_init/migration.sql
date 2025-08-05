/*
  Warnings:

  - You are about to drop the `_ModeratedCommunities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ModeratedCommunities" DROP CONSTRAINT "_ModeratedCommunities_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModeratedCommunities" DROP CONSTRAINT "_ModeratedCommunities_B_fkey";

-- DropTable
DROP TABLE "_ModeratedCommunities";

-- CreateTable
CREATE TABLE "CommunityModerator" (
    "userID" TEXT NOT NULL,
    "communityID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityModerator_pkey" PRIMARY KEY ("userID","communityID")
);

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_communityID_fkey" FOREIGN KEY ("communityID") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
