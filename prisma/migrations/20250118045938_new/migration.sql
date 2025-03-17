-- DropForeignKey
ALTER TABLE `auction` DROP FOREIGN KEY `Auction_carId_fkey`;

-- DropForeignKey
ALTER TABLE `auction` DROP FOREIGN KEY `Auction_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `bidding` DROP FOREIGN KEY `Bidding_auctionId_fkey`;

-- DropForeignKey
ALTER TABLE `bidding` DROP FOREIGN KEY `Bidding_carId_fkey`;

-- DropForeignKey
ALTER TABLE `bidding` DROP FOREIGN KEY `Bidding_userId_fkey`;

-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `Car_brandId_fkey`;

-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `Car_sellerId_fkey`;

-- AlterTable
ALTER TABLE `car` ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `price` VARCHAR(191) NOT NULL DEFAULT '0';

-- CreateTable
CREATE TABLE `CarSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `vehicleMake` VARCHAR(191) NOT NULL,
    `vehicleModel` VARCHAR(191) NOT NULL,
    `vehicleYear` VARCHAR(191) NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,
    `vin` VARCHAR(191) NOT NULL,
    `mileage` VARCHAR(191) NOT NULL,
    `mileageUnit` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL DEFAULT '0',
    `currency` VARCHAR(191) NOT NULL DEFAULT '0',
    `country` VARCHAR(191) NOT NULL,
    `postal` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarSubmissionImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionId` INTEGER NOT NULL,
    `url` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CarSubmission` ADD CONSTRAINT `CarSubmission_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarSubmissionImage` ADD CONSTRAINT `CarSubmissionImage_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `CarSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidding` ADD CONSTRAINT `Bidding_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidding` ADD CONSTRAINT `Bidding_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidding` ADD CONSTRAINT `Bidding_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
