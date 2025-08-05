-- CreateEnum
CREATE TYPE "ModlogAction" AS ENUM ('PERM_BAN_USER', 'TEMP_BAN_USER', 'PIN_POST', 'PIN_COMMENT', 'DELETE_POST', 'DELETE_COMMENT', 'ADD_ADMIN', 'DELETE_ADMIN', 'EDIT_COMMUNITY', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "ModlogSubjectType" AS ENUM ('USER', 'POST', 'UNSPECIFIED');

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "bg_image" TEXT NOT NULL DEFAULT '/images/default_community_bg.png';

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL DEFAULT '',
    "action" "ModlogAction" NOT NULL DEFAULT 'UNSPECIFIED',
    "subjectType" "ModlogSubjectType" NOT NULL DEFAULT 'UNSPECIFIED',
    "subjectId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModerationLog_id_key" ON "ModerationLog"("id");
