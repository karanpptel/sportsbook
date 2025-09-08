-- AlterTable
ALTER TABLE "public"."Venue" ADD COLUMN     "maxPricePerHour" INTEGER,
ADD COLUMN     "minPricePerHour" INTEGER;

-- CreateIndex
CREATE INDEX "Venue_minPricePerHour_idx" ON "public"."Venue"("minPricePerHour");

-- CreateIndex
CREATE INDEX "Venue_maxPricePerHour_idx" ON "public"."Venue"("maxPricePerHour");
