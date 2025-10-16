-- Change gathering system from energy to gold cost
-- Rename energyCost column to goldCost in GatherNode table
ALTER TABLE "gather_nodes" RENAME COLUMN "energy_cost" TO "gold_cost";

-- Rename energyUsed column to goldSpent in GatherSession table  
ALTER TABLE "gather_sessions" RENAME COLUMN "energy_used" TO "gold_spent";

-- Add new column goldRefunded for cancelled sessions
ALTER TABLE "gather_sessions" ADD COLUMN "gold_refunded" INTEGER NOT NULL DEFAULT 0;
