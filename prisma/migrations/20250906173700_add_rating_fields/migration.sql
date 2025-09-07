/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `rating` on table `Venue` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('BOOKING_CONFIRMED', 'BOOKING_FAILED', 'BOOKING_REFUNDED', 'BOOKING_CANCELLED');

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Venue" ADD COLUMN     "reviewsCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0;
