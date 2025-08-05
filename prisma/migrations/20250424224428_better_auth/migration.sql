/*
  Warnings:

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
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Reporter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserSettings` table. If the table is not empty, all the data it contains will be lost.

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
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

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
DROP TABLE "Session";

-- DropTable
DROP TABLE "Upvotes";

-- DropTable
DROP TABLE "User";

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
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
