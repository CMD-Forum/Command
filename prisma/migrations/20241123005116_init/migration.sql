/*
  Warnings:

  - You are about to drop the column `savedPosts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "savedPosts";

-- CreateTable
CREATE TABLE "SavedPosts" (
    "postID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedPosts_postID_userID_key" ON "SavedPosts"("postID", "userID");

-- AddForeignKey
ALTER TABLE "SavedPosts" ADD CONSTRAINT "SavedPosts_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPosts" ADD CONSTRAINT "SavedPosts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
