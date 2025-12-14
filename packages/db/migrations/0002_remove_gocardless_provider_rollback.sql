-- ⚠️  ROLLBACK MIGRATION ⚠️
-- Restores GoCardless provider enum value ONLY
-- 
-- CRITICAL WARNINGS:
-- 1. This does NOT restore deleted connection data
-- 2. This does NOT restore deleted bank account data
-- 3. This does NOT restore deleted transaction data
-- 4. To restore data, you MUST use a database backup from before migration
--
-- This rollback only allows the application code to handle the 'gocardless' enum value again

-- ==============================================================================
-- ENUM RESTORATION: Add 'gocardless' back to bank_providers enum
-- ==============================================================================

-- Create new enum with gocardless restored
-- IMPORTANT: Enum order matches original migration for idempotency
-- Order: plaid, teller, enablebanking, gocardless (appended at end)
CREATE TYPE bank_providers_new AS ENUM('plaid', 'teller', 'enablebanking', 'gocardless');

-- Update the bank_connections table to use the new enum
ALTER TABLE bank_connections 
  ALTER COLUMN provider TYPE bank_providers_new 
  USING provider::text::bank_providers_new;

-- Drop the old enum and rename the new one
DROP TYPE bank_providers;
ALTER TYPE bank_providers_new RENAME TO bank_providers;

-- ==============================================================================
-- VERIFICATION
-- ==============================================================================
DO $$
BEGIN
  RAISE NOTICE 'ROLLBACK COMPLETE: GoCardless enum value restored';
  RAISE WARNING 'No data was restored - use database backup to restore deleted connections/accounts';
END $$;
