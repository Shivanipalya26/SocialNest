/*
  Warnings:

  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "POST_STATUS" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isScheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mediaAllKeys" TEXT[],
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ADD COLUMN     "status" "POST_STATUS" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "text" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
