/*
  Warnings:

  - You are about to drop the column `ip_country` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ip_country",
ADD COLUMN     "browserName" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "browserVersion" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "deviceModel" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "deviceType" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "deviceVendor" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "ip_address" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "osName" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "osVersion" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "userAgent" TEXT NOT NULL DEFAULT 'Unknown';
