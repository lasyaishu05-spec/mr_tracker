-- AlterTable
ALTER TABLE `doctor` ADD COLUMN `managedById` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Doctor_managedById_idx` ON `Doctor`(`managedById`);

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_managedById_fkey` FOREIGN KEY (`managedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
