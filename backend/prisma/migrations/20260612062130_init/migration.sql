-- CreateTable
CREATE TABLE `Visit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mrName` VARCHAR(191) NOT NULL,
    `doctorName` VARCHAR(191) NOT NULL,
    `hospitalName` VARCHAR(191) NULL,
    `visitDate` DATETIME(3) NOT NULL,
    `productsDiscussed` TEXT NULL,
    `samplesGiven` INTEGER NOT NULL DEFAULT 0,
    `feedback` TEXT NULL,
    `followupDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'INTERESTED', 'NOT_INTERESTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
