/*
  Warnings:

  - You are about to drop the `car` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carimage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[webSlug]` on the table `CarSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currency` to the `Bidding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `auction` DROP FOREIGN KEY `Auction_carId_fkey`;

-- DropForeignKey
ALTER TABLE `bidding` DROP FOREIGN KEY `Bidding_carId_fkey`;

-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `Car_brandId_fkey`;

-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `Car_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `carimage` DROP FOREIGN KEY `CarImage_carId_fkey`;

-- AlterTable
ALTER TABLE `auction` ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `webSlug` VARCHAR(191) NOT NULL DEFAULT 'webSlug';

-- AlterTable
ALTER TABLE `bidding` ADD COLUMN `currency` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `carsubmission` ADD COLUMN `bodyType` VARCHAR(191) NULL,
    ADD COLUMN `brand` INTEGER NULL,
    ADD COLUMN `buy` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `buyPrice` INTEGER NULL DEFAULT 0,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `condition` VARCHAR(191) NULL,
    ADD COLUMN `engineCapacity` VARCHAR(191) NULL,
    ADD COLUMN `exteriorColor` VARCHAR(191) NULL,
    ADD COLUMN `fuelType` VARCHAR(191) NULL,
    ADD COLUMN `reserved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `reservedPrice` INTEGER NULL DEFAULT 0,
    ADD COLUMN `review` VARCHAR(191) NULL,
    ADD COLUMN `transmission` VARCHAR(191) NULL,
    ADD COLUMN `webSlug` VARCHAR(191) NOT NULL DEFAULT 'webSlug',
    MODIFY `description` LONGTEXT NULL,
    MODIFY `highlights` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `carsubmissionimage` ADD COLUMN `label` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `cardCvc` VARCHAR(191) NULL,
    ADD COLUMN `cardExpiry` VARCHAR(191) NULL,
    ADD COLUMN `cardName` VARCHAR(191) NULL,
    ADD COLUMN `cardNumber` VARCHAR(191) NULL,
    ADD COLUMN `tokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL,
    MODIFY `verified` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `car`;

-- DropTable
DROP TABLE `carimage`;

-- CreateTable
CREATE TABLE `EmailsReceiverList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `getEmails` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailsReceiverList_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Watching` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `auctionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sold` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `auctionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slide` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CarSubmission_webSlug_key` ON `CarSubmission`(`webSlug`);

-- AddForeignKey
ALTER TABLE `CarSubmission` ADD CONSTRAINT `CarSubmission_brand_fkey` FOREIGN KEY (`brand`) REFERENCES `Brand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailsReceiverList` ADD CONSTRAINT `EmailsReceiverList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `CarSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Watching` ADD CONSTRAINT `Watching_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Watching` ADD CONSTRAINT `Watching_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidding` ADD CONSTRAINT `Bidding_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `CarSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sold` ADD CONSTRAINT `Sold_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sold` ADD CONSTRAINT `Sold_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
