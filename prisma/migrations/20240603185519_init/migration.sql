-- CreateTable
CREATE TABLE "CommunityAdminship" (
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "CommunityAdminship_pkey" PRIMARY KEY ("userId","communityId")
);

-- AddForeignKey
ALTER TABLE "CommunityAdminship" ADD CONSTRAINT "CommunityAdminship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityAdminship" ADD CONSTRAINT "CommunityAdminship_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
