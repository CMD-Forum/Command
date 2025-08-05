/*
  Warnings:

  - You are about to drop the `_CommunityToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_B_fkey";

-- DropTable
DROP TABLE "_CommunityToUser";

-- CreateTable
CREATE TABLE "CommunityMembership" (
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "CommunityMembership_pkey" PRIMARY KEY ("userId","communityId")
);

-- AddForeignKey
ALTER TABLE "CommunityMembership" ADD CONSTRAINT "CommunityMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMembership" ADD CONSTRAINT "CommunityMembership_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
