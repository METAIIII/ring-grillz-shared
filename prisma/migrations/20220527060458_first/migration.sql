-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,
    `oauth_token_secret` VARCHAR(191) NULL,
    `oauth_token` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `street` VARCHAR(191) NULL,
    `street2` VARCHAR(191) NULL,
    `suburb` VARCHAR(191) NULL,
    `state` ENUM('WA', 'NT', 'SA', 'QLD', 'NSW', 'VIC', 'TAS', 'ACT') NULL,
    `postcode` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `customerNotes` TEXT NULL,
    `total` INTEGER NOT NULL,
    `status` ENUM('UNPAID', 'PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED') NOT NULL,
    `type` ENUM('GRILLZ', 'RING') NOT NULL,
    `paymentType` ENUM('DEPOSIT', 'FULL_PAYMENT', 'PARTIAL_PAYMENT') NULL,
    `email` VARCHAR(191) NOT NULL,
    `hasSentOrderEmail` BOOLEAN NULL,
    `hasSentReceiptEmail` BOOLEAN NULL,
    `expressShipping` BOOLEAN NULL,
    `stripeId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineItem` (
    `id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `metadata` MEDIUMTEXT NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingShape` (
    `id` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `previewImage` VARCHAR(512) NOT NULL,

    UNIQUE INDEX `RingShape_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingShapeVariant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `modelUrl` VARCHAR(191) NOT NULL,
    `previewImage` VARCHAR(512) NOT NULL,
    `hasEngraving` BOOLEAN NOT NULL DEFAULT true,
    `hasJewels` BOOLEAN NOT NULL DEFAULT false,
    `price` INTEGER NOT NULL,
    `baseShapeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RingShapeVariant_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingMaterial` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `ambientOcclusion` VARCHAR(191) NULL,
    `baseColor` VARCHAR(191) NULL,
    `metallic` VARCHAR(191) NULL,
    `roughness` VARCHAR(191) NULL,
    `normal` VARCHAR(191) NULL,
    `emissive` VARCHAR(191) NULL,
    `previewImage` VARCHAR(512) NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingEngraving` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'IMAGE') NOT NULL,
    `imageUrl` VARCHAR(512) NULL,
    `canvasData` MEDIUMTEXT NULL,
    `text` VARCHAR(191) NULL,
    `fontFamily` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingJewel` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `modelUrl` VARCHAR(191) NOT NULL,
    `previewImage` VARCHAR(512) NOT NULL,
    `price` INTEGER NOT NULL,

    UNIQUE INDEX `RingJewel_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeethMaterial` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `hasOptions` BOOLEAN NOT NULL DEFAULT false,
    `labourCost` INTEGER NOT NULL,
    `optionsHeading` VARCHAR(191) NULL,

    UNIQUE INDEX `TeethMaterial_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeethMaterialVariant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `previewImage` VARCHAR(512) NOT NULL,
    `price` INTEGER NOT NULL,
    `singleRowOnly` BOOLEAN NOT NULL DEFAULT false,
    `toothBgImage` VARCHAR(512) NULL,
    `baseMaterialId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeethMaterialOption` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `previewImage` VARCHAR(512) NOT NULL,
    `price` INTEGER NOT NULL,
    `baseMaterialId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RingMaterialToRingShapeVariant` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RingMaterialToRingShapeVariant_AB_unique`(`A`, `B`),
    INDEX `_RingMaterialToRingShapeVariant_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RingJewelToRingShapeVariant` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RingJewelToRingShapeVariant_AB_unique`(`A`, `B`),
    INDEX `_RingJewelToRingShapeVariant_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
