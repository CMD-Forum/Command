/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[github_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "TwoFactorMethod" AS ENUM ('EMAIL_LINK', 'EMAIL_CODE', 'PHONE', 'NONE');

-- CreateEnum
CREATE TYPE "ModlogAction" AS ENUM ('PERM_BAN_USER', 'TEMP_BAN_USER', 'PIN_POST', 'PIN_COMMENT', 'DELETE_POST', 'DELETE_COMMENT', 'ADD_ADMIN', 'DELETE_ADMIN', 'EDIT_COMMUNITY', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "ModlogSubjectType" AS ENUM ('USER', 'POST', 'UNSPECIFIED', 'COMMENT');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('HARASSMENT', 'ILLEGAL_CONTENT', 'SPAM', 'SELF_HARM');

-- CreateEnum
CREATE TYPE "ReportSubject" AS ENUM ('POST', 'COMMENT', 'USER_PROFILE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "description" VARCHAR(250) NOT NULL DEFAULT 'This user has not set their description.',
ADD COLUMN     "emailLastUpdate" TIMESTAMP(3),
ADD COLUMN     "github_id" INTEGER,
ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "searchIdx" tsvector,
ADD COLUMN     "usernameLastUpdate" TIMESTAMP(3),
ALTER COLUMN "emailVerified" DROP NOT NULL,
ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(50) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'This community doesn''t have a description.',
    "image" TEXT NOT NULL DEFAULT '/images/favicon/favicon.svg',
    "public" BOOLEAN NOT NULL DEFAULT true,
    "bg_image" TEXT NOT NULL DEFAULT '/images/default_community_bg.png',
    "sidebar_content" TEXT NOT NULL DEFAULT '',
    "searchIdx" tsvector,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "imageurl" TEXT,
    "imagealt" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL DEFAULT 'null',
    "href" TEXT,
    "deletedByAdmin" BOOLEAN DEFAULT false,
    "deletedByAuthor" BOOLEAN DEFAULT false,
    "imageblur" TEXT,
    "searchIdx" tsvector,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "userID" TEXT NOT NULL,
    "defaultHomeRedirect" TEXT NOT NULL DEFAULT '/',
    "postsPublic" BOOLEAN NOT NULL DEFAULT true,
    "accountPublic" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorAuthentication" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorMethod" "TwoFactorMethod" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Upvotes" (
    "userID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upvotes_pkey" PRIMARY KEY ("postID","userID")
);

-- CreateTable
CREATE TABLE "Downvotes" (
    "userID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Downvotes_pkey" PRIMARY KEY ("postID","userID")
);

-- CreateTable
CREATE TABLE "CommentUpvotes" (
    "userID" TEXT NOT NULL,
    "commentID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentUpvotes_pkey" PRIMARY KEY ("commentID","userID")
);

-- CreateTable
CREATE TABLE "CommentDownvotes" (
    "userID" TEXT NOT NULL,
    "commentID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentDownvotes_pkey" PRIMARY KEY ("commentID","userID")
);

-- CreateTable
CREATE TABLE "CommunityModerator" (
    "userID" TEXT NOT NULL,
    "communityID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityModerator_pkey" PRIMARY KEY ("userID","communityID")
);

-- CreateTable
CREATE TABLE "CommunityMembership" (
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityMembership_pkey" PRIMARY KEY ("userId","communityId")
);

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

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "replyTo" TEXT,
    "content" TEXT NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL DEFAULT '',
    "action" "ModlogAction" NOT NULL DEFAULT 'UNSPECIFIED',
    "subjectType" "ModlogSubjectType" NOT NULL DEFAULT 'UNSPECIFIED',
    "subjectId" TEXT NOT NULL DEFAULT '',
    "communityId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" TEXT,
    "postId" TEXT,
    "reason" "ReportReason" NOT NULL,
    "information" TEXT NOT NULL DEFAULT '',
    "subjectType" "ReportSubject" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "href" TEXT,
    "receiverId" TEXT NOT NULL DEFAULT 'null',

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL DEFAULT 'null',
    "senderId" TEXT NOT NULL DEFAULT 'null',

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPosts" (
    "postID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_UserToUserSettings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToUserSettings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Reporter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Reporter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_id_key" ON "Community"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRule_id_key" ON "CommunityRule"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationLog_id_key" ON "ModerationLog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessage_id_key" ON "DirectMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPosts_postID_userID_key" ON "SavedPosts"("postID", "userID");

-- CreateIndex
CREATE INDEX "_UserToUserSettings_B_index" ON "_UserToUserSettings"("B");

-- CreateIndex
CREATE INDEX "_Reporter_B_index" ON "_Reporter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_github_id_key" ON "user"("github_id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentUpvotes" ADD CONSTRAINT "CommentUpvotes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentUpvotes" ADD CONSTRAINT "CommentUpvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDownvotes" ADD CONSTRAINT "CommentDownvotes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDownvotes" ADD CONSTRAINT "CommentDownvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_communityID_fkey" FOREIGN KEY ("communityID") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMembership" ADD CONSTRAINT "CommunityMembership_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMembership" ADD CONSTRAINT "CommunityMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityRule" ADD CONSTRAINT "CommunityRule_communityID_fkey" FOREIGN KEY ("communityID") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPosts" ADD CONSTRAINT "SavedPosts_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPosts" ADD CONSTRAINT "SavedPosts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserSettings" ADD CONSTRAINT "_UserToUserSettings_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserSettings" ADD CONSTRAINT "_UserToUserSettings_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSettings"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reporter" ADD CONSTRAINT "_Reporter_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reporter" ADD CONSTRAINT "_Reporter_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
