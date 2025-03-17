-- AlterTable
ALTER TABLE `carsubmission` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `highlights` TEXT NULL,
    ADD COLUMN `specs` TEXT NULL,
    MODIFY `notes` TEXT NULL;
