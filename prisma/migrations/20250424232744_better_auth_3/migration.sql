/*
  Warnings:

  - You are about to drop the column `description` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `emailLastUpdate` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `github_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `searchIdx` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `usernameLastUpdate` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentDownvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentUpvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Community` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommunityMembership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommunityModerator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommunityRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DirectMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Downvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModerationLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Reporter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserSettings` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `emailVerified` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommentDownvotes" DROP CONSTRAINT "CommentDownvotes_commentID_fkey";

-- DropForeignKey
ALTER TABLE "CommentDownvotes" DROP CONSTRAINT "CommentDownvotes_userID_fkey";

-- DropForeignKey
ALTER TABLE "CommentUpvotes" DROP CONSTRAINT "CommentUpvotes_commentID_fkey";

-- DropForeignKey
ALTER TABLE "CommentUpvotes" DROP CONSTRAINT "CommentUpvotes_userID_fkey";

-- DropForeignKey
ALTER TABLE "CommunityMembership" DROP CONSTRAINT "CommunityMembership_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityMembership" DROP CONSTRAINT "CommunityMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityModerator" DROP CONSTRAINT "CommunityModerator_communityID_fkey";

-- DropForeignKey
ALTER TABLE "CommunityModerator" DROP CONSTRAINT "CommunityModerator_userID_fkey";

-- DropForeignKey
ALTER TABLE "CommunityRule" DROP CONSTRAINT "CommunityRule_communityID_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Downvotes" DROP CONSTRAINT "Downvotes_postID_fkey";

-- DropForeignKey
ALTER TABLE "Downvotes" DROP CONSTRAINT "Downvotes_userID_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_communityId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_postId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedPosts" DROP CONSTRAINT "SavedPosts_postID_fkey";

-- DropForeignKey
ALTER TABLE "SavedPosts" DROP CONSTRAINT "SavedPosts_userID_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_postID_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_userID_fkey";

-- DropForeignKey
ALTER TABLE "_Reporter" DROP CONSTRAINT "_Reporter_A_fkey";

-- DropForeignKey
ALTER TABLE "_Reporter" DROP CONSTRAINT "_Reporter_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserSettings" DROP CONSTRAINT "_UserToUserSettings_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserSettings" DROP CONSTRAINT "_UserToUserSettings_B_fkey";

-- DropIndex
DROP INDEX "user_github_id_key";

-- DropIndex
DROP INDEX "user_id_key";

-- DropIndex
DROP INDEX "user_name_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "description",
DROP COLUMN "emailLastUpdate",
DROP COLUMN "github_id",
DROP COLUMN "password_hash",
DROP COLUMN "public",
DROP COLUMN "role",
DROP COLUMN "searchIdx",
DROP COLUMN "usernameLastUpdate",
ADD COLUMN     "displayUsername" TEXT,
ALTER COLUMN "emailVerified" SET NOT NULL,
ALTER COLUMN "emailVerified" DROP DEFAULT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "username" DROP NOT NULL;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "CommentDownvotes";

-- DropTable
DROP TABLE "CommentUpvotes";

-- DropTable
DROP TABLE "Community";

-- DropTable
DROP TABLE "CommunityMembership";

-- DropTable
DROP TABLE "CommunityModerator";

-- DropTable
DROP TABLE "CommunityRule";

-- DropTable
DROP TABLE "DirectMessage";

-- DropTable
DROP TABLE "Downvotes";

-- DropTable
DROP TABLE "ModerationLog";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "SavedPosts";

-- DropTable
DROP TABLE "Upvotes";

-- DropTable
DROP TABLE "UserSettings";

-- DropTable
DROP TABLE "_Reporter";

-- DropTable
DROP TABLE "_UserToUserSettings";

-- DropEnum
DROP TYPE "ModlogAction";

-- DropEnum
DROP TYPE "ModlogSubjectType";

-- DropEnum
DROP TYPE "ReportReason";

-- DropEnum
DROP TYPE "ReportSubject";

-- DropEnum
DROP TYPE "TwoFactorMethod";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
