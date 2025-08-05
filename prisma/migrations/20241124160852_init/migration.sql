/*
  Warnings:

  - Added the required column `reason` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectType` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportSubject" AS ENUM ('POST', 'COMMENT', 'USER_PROFILE');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "postId" TEXT,
ADD COLUMN     "reason" "ReportReason" NOT NULL,
ADD COLUMN     "subjectType" "ReportSubject" NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "_Reporter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Reporter_AB_unique" ON "_Reporter"("A", "B");

-- CreateIndex
CREATE INDEX "_Reporter_B_index" ON "_Reporter"("B");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reporter" ADD CONSTRAINT "_Reporter_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reporter" ADD CONSTRAINT "_Reporter_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
