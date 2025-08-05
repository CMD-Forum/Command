-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "TwoFactorMethod" AS ENUM ('EMAIL_LINK', 'EMAIL_CODE', 'PHONE', 'NONE');

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(50) NOT NULL DEFAULT '',
    "display_name" VARCHAR(50) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'This community doesn&apos;t have a description.',
    "image" TEXT NOT NULL DEFAULT '/images/favicon/favicon.svg',
    "public" BOOLEAN NOT NULL DEFAULT true,
    "admin_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sidebar_md" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "imageurl" TEXT,
    "imagealt" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL DEFAULT 'null',

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "emailLastUpdate" TIMESTAMP(3),
    "username" TEXT NOT NULL,
    "usernameLastUpdate" TIMESTAMP(3),
    "description" VARCHAR(250) NOT NULL DEFAULT 'This user has not set their description.',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL DEFAULT '/images/favicon/favicon.svg',
    "image" TEXT NOT NULL DEFAULT '/images/favicon/favicon.svg',
    "savedPosts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "supportId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Support" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '# Support Article 
 Edit this article!',
    "title" TEXT NOT NULL DEFAULT 'Article has no name',
    "tagline" TEXT NOT NULL DEFAULT 'Article has no tagline',

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Upvotes_pkey" PRIMARY KEY ("postID","userID")
);

-- CreateTable
CREATE TABLE "Downvotes" (
    "userID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,

    CONSTRAINT "Downvotes_pkey" PRIMARY KEY ("postID","userID")
);

-- CreateTable
CREATE TABLE "_UserToUserSettings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Community_display_name_key" ON "Community"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Support_authorId_key" ON "Support"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserSettings_AB_unique" ON "_UserToUserSettings"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserSettings_B_index" ON "_UserToUserSettings"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "Support"("authorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserSettings" ADD CONSTRAINT "_UserToUserSettings_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserSettings" ADD CONSTRAINT "_UserToUserSettings_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSettings"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
