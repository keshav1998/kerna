-- ⚠️  DESTRUCTIVE MIGRATION ⚠️
-- This migration permanently deletes GoCardless bank connections and accounts
-- 
-- REQUIREMENTS BEFORE RUNNING:
-- 1. BACKUP YOUR DATABASE - This migration cannot be fully rolled back
-- 2. Verify no active GoCardless connections in production
-- 3. Notify affected users before running
--
-- This migration MUST be run before deploying code changes that remove GoCardless support

-- ==============================================================================
-- SAFETY CHECK: Verify no transactions linked to GoCardless accounts
-- ==============================================================================
DO $$
DECLARE
  transaction_count INTEGER;
  gocardless_account_count INTEGER;
BEGIN
  -- Count transactions linked to GoCardless bank accounts
  SELECT COUNT(*) INTO transaction_count
  FROM transactions t
  JOIN bank_accounts ba ON t.bank_account_id = ba.id
  JOIN bank_connections bc ON ba.bank_connection_id = bc.id
  WHERE bc.provider = 'gocardless';
  
  -- Count GoCardless bank accounts
  SELECT COUNT(*) INTO gocardless_account_count
  FROM bank_accounts ba
  JOIN bank_connections bc ON ba.bank_connection_id = bc.id
  WHERE bc.provider = 'gocardless';
  
  -- Log the counts
  RAISE NOTICE 'GoCardless bank accounts found: %', gocardless_account_count;
  RAISE NOTICE 'Transactions linked to GoCardless accounts: %', transaction_count;
  
  -- FAIL SAFE: Abort if transactions exist
  IF transaction_count > 0 THEN
    RAISE EXCEPTION 'MIGRATION ABORTED: % transactions are linked to GoCardless accounts. These must be handled before removing GoCardless support.', transaction_count;
  END IF;
  
  -- Warn if accounts exist but no transactions
  IF gocardless_account_count > 0 THEN
    RAISE NOTICE 'WARNING: % GoCardless bank accounts will be deleted', gocardless_account_count;
  END IF;
END $$;

-- ==============================================================================
-- AUDIT LOG: Record affected connections before deletion
-- ==============================================================================
DO $$
DECLARE
  affected_teams TEXT;
BEGIN
  SELECT string_agg(DISTINCT team_id::text, ', ') INTO affected_teams
  FROM bank_connections
  WHERE provider = 'gocardless';
  
  IF affected_teams IS NOT NULL THEN
    RAISE NOTICE 'Teams with GoCardless connections: %', affected_teams;
  ELSE
    RAISE NOTICE 'No GoCardless connections found - migration will only update enum';
  END IF;
END $$;

-- ==============================================================================
-- DELETION: Remove GoCardless data
-- ==============================================================================

-- Step 1: Delete all bank accounts associated with GoCardless connections
DELETE FROM bank_accounts 
WHERE id IN (
  SELECT ba.id 
  FROM bank_accounts ba
  JOIN bank_connections bc ON ba.bank_connection_id = bc.id
  WHERE bc.provider = 'gocardless'
);

-- Step 2: Delete all GoCardless bank connections
DELETE FROM bank_connections 
WHERE provider = 'gocardless';

-- ==============================================================================
-- ENUM UPDATE: Remove 'gocardless' from bank_providers enum
-- ==============================================================================

-- Note: PostgreSQL doesn't support removing enum values directly
-- We create a new enum and migrate the column

-- Create new enum without gocardless (same order as original for consistency)
CREATE TYPE bank_providers_new AS ENUM('plaid', 'teller', 'enablebanking');

-- Update the bank_connections table to use the new enum
ALTER TABLE bank_connections 
  ALTER COLUMN provider TYPE bank_providers_new 
  USING provider::text::bank_providers_new;

-- Drop the old enum and rename the new one
DROP TYPE bank_providers;
ALTER TYPE bank_providers_new RENAME TO bank_providers;

-- ==============================================================================
-- VERIFICATION: Confirm migration success
-- ==============================================================================
DO $$
DECLARE
  remaining_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_count
  FROM bank_connections 
  WHERE provider::text = 'gocardless';
  
  IF remaining_count > 0 THEN
    RAISE EXCEPTION 'MIGRATION VERIFICATION FAILED: % GoCardless connections still exist', remaining_count;
  ELSE
    RAISE NOTICE 'SUCCESS: GoCardless provider removed successfully';
  END IF;
END $$;
