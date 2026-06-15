-- AlterTable
ALTER TABLE `followup` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `Doctor_doctorName_idx` ON `Doctor`(`doctorName`);

-- CreateIndex
CREATE INDEX `Doctor_hospitalName_idx` ON `Doctor`(`hospitalName`);

-- CreateIndex
CREATE INDEX `FollowUp_nextDate_idx` ON `FollowUp`(`nextDate`);

-- CreateIndex
CREATE INDEX `FollowUp_status_idx` ON `FollowUp`(`status`);

-- CreateIndex
CREATE INDEX `Visit_visitDate_idx` ON `Visit`(`visitDate`);

-- CreateIndex
CREATE INDEX `Visit_status_idx` ON `Visit`(`status`);

-- RenameIndex
ALTER TABLE `visit` RENAME INDEX `Visit_doctorId_fkey` TO `Visit_doctorId_idx`;
