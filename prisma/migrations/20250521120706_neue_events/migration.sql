-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
