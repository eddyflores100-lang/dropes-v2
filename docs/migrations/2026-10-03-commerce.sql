-- Apply to an existing PostgreSQL database only after a verified backup.
-- For a NEW empty database use: npx prisma db push
BEGIN;
ALTER TABLE "Order" ADD COLUMN "checkoutKey" TEXT, ADD COLUMN "requestHash" TEXT, ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Order_checkoutKey_key" ON "Order"("checkoutKey");
ALTER TABLE "OrderItem" ADD COLUMN "deliveredQuantity" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "returnedQuantity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Agent" ADD COLUMN "payoutVersion" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AgentPayout" ADD COLUMN "payoutKey" TEXT;
CREATE UNIQUE INDEX "AgentPayout_payoutKey_key" ON "AgentPayout"("payoutKey");
CREATE TABLE "DeliveryEvent" ("id" TEXT PRIMARY KEY, "eventKey" TEXT NOT NULL, "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE, "evidence" TEXT NOT NULL, "payload" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX "DeliveryEvent_eventKey_key" ON "DeliveryEvent"("eventKey");
CREATE INDEX "DeliveryEvent_orderId_idx" ON "DeliveryEvent"("orderId");
-- Preserve old estimates for reconciliation. They are not proof of delivery.
CREATE TABLE "LegacyCommissionSnapshot_20261003" AS SELECT "id", "agentId", "commissionEarned", "status", CURRENT_TIMESTAMP AS "snapshotAt" FROM "Order";
UPDATE "Order" SET "commissionEarned" = 0;
-- Never auto-send legacy pending orders: their provider outcome may be unknown.
UPDATE "Order" SET "status" = 'review_required' WHERE "status" = 'pending';
COMMIT;
