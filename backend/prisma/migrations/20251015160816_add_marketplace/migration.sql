-- CreateEnum
CREATE TYPE "MarketplaceStatus" AS ENUM ('active', 'sold', 'cancelled', 'expired');

-- CreateTable
CREATE TABLE "marketplace_listings" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price_per_unit" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL DEFAULT 0,
    "status" "MarketplaceStatus" NOT NULL DEFAULT 'active',
    "buyer_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sold_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_listings_seller_id_idx" ON "marketplace_listings"("seller_id");

-- CreateIndex
CREATE INDEX "marketplace_listings_item_id_idx" ON "marketplace_listings"("item_id");

-- CreateIndex
CREATE INDEX "marketplace_listings_status_idx" ON "marketplace_listings"("status");

-- CreateIndex
CREATE INDEX "marketplace_listings_price_per_unit_idx" ON "marketplace_listings"("price_per_unit");

-- CreateIndex
CREATE INDEX "marketplace_listings_created_at_idx" ON "marketplace_listings"("created_at");

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
