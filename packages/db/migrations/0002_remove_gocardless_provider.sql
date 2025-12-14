-- Migration: Remove GoCardless provider and clean up existing connections
-- This migration MUST be run before deploying the code changes that remove GoCardless support

-- Step 1: Check for existing GoCardless connections (for logging/audit purposes)
-- Run this query manually before migration to log affected teams:
-- SELECT team_id, COUNT(*) as connection_count 
-- FROM bank_connections 
-- WHERE provider = 'gocardless' 
-- GROUP BY team_id;

-- Step 2: Delete all bank accounts associated with GoCardless connections
DELETE FROM bank_accounts 
WHERE id IN (
  SELECT ba.id 
  FROM bank_accounts ba
  JOIN bank_connections bc ON ba.bank_connection_id = bc.id
  WHERE bc.provider = 'gocardless'
);

-- Step 3: Delete all GoCardless bank connections
DELETE FROM bank_connections 
WHERE provider = 'gocardless';

-- Step 4: Remove 'gocardless' from the bank_providers enum
-- Note: PostgreSQL doesn't support removing enum values directly
-- We need to create a new enum and migrate the column

-- Create new enum without gocardless
CREATE TYPE bank_providers_new AS ENUM('plaid', 'teller', 'enablebanking');

-- Update the bank_connections table to use the new enum
ALTER TABLE bank_connections 
  ALTER COLUMN provider TYPE bank_providers_new 
  USING provider::text::bank_providers_new;

-- Drop the old enum and rename the new one
DROP TYPE bank_providers;
ALTER TYPE bank_providers_new RENAME TO bank_providers;

-- Step 5: Verify no GoCardless connections remain
-- This should return 0 rows:
-- SELECT COUNT(*) FROM bank_connections WHERE provider::text = 'gocardless';
