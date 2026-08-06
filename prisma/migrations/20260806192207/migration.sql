/*
  Warnings:

  - The values [MONTH,YEAR] on the enum `BillingInterval` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BillingInterval_new" AS ENUM ('WEEKLY', 'MONTHLY');
ALTER TABLE "Plan" ALTER COLUMN "billing_interval" TYPE "BillingInterval_new" USING ("billing_interval"::text::"BillingInterval_new");
ALTER TYPE "BillingInterval" RENAME TO "BillingInterval_old";
ALTER TYPE "BillingInterval_new" RENAME TO "BillingInterval";
DROP TYPE "public"."BillingInterval_old";
COMMIT;
