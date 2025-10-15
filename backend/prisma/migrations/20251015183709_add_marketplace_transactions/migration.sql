-- CreateTable
CREATE TABLE "marketplace_transactions" (
    "id" SERIAL NOT NULL,
    "listing_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_per_unit" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_transactions_buyer_id_idx" ON "marketplace_transactions"("buyer_id");

-- CreateIndex
CREATE INDEX "marketplace_transactions_seller_id_idx" ON "marketplace_transactions"("seller_id");

-- CreateIndex
CREATE INDEX "marketplace_transactions_created_at_idx" ON "marketplace_transactions"("created_at");

-- AddForeignKey
ALTER TABLE "marketplace_transactions" ADD CONSTRAINT "marketplace_transactions_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_transactions" ADD CONSTRAINT "marketplace_transactions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_transactions" ADD CONSTRAINT "marketplace_transactions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_transactions" ADD CONSTRAINT "marketplace_transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
