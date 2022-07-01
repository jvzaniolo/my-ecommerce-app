/*
  Warnings:

  - You are about to drop the column `userId` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CartItem_userId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "userId";
