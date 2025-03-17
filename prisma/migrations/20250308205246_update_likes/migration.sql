/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `like` ADD COLUMN `commentId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Like_userId_commentId_key` ON `Like`(`userId`, `commentId`);

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
