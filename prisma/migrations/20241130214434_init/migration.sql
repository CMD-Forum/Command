-- AlterTable
ALTER TABLE "_Reporter" ADD CONSTRAINT "_Reporter_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_Reporter_AB_unique";

-- AlterTable
ALTER TABLE "_UserToUserSettings" ADD CONSTRAINT "_UserToUserSettings_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserToUserSettings_AB_unique";
