/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `inputType` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `original` on the `Note` table. All the data in the column will be lost.
  - The `decisions` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `actionItems` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `transcript` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "audioUrl",
DROP COLUMN "inputType",
DROP COLUMN "original",
ADD COLUMN     "title" TEXT,
ADD COLUMN     "transcript" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "decisions",
ADD COLUMN     "decisions" TEXT[],
DROP COLUMN "actionItems",
ADD COLUMN     "actionItems" TEXT[];

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
