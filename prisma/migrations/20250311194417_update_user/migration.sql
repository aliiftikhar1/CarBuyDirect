-- AlterTable
ALTER TABLE `user` ADD COLUMN `availableBalance` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `businessType` VARCHAR(191) NULL,
    ADD COLUMN `pendingBalance` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `stripeAccountId` VARCHAR(191) NULL,
    ADD COLUMN `stripeStatus` VARCHAR(191) NULL DEFAULT 'unverified';

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
