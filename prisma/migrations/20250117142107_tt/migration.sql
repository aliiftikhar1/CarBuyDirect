-- DropForeignKey
ALTER TABLE `carimage` DROP FOREIGN KEY `CarImage_carId_fkey`;

-- AddForeignKey
ALTER TABLE `CarImage` ADD CONSTRAINT `CarImage_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
