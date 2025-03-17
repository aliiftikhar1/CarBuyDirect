/*
  Warnings:

  - You are about to drop the column `url` on the `carsubmissionimage` table. All the data in the column will be lost.
  - Added the required column `data` to the `CarSubmissionImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CarSubmissionImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `CarSubmissionImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CarSubmissionImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carsubmissionimage` DROP COLUMN `url`,
    ADD COLUMN `data` LONGTEXT NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
