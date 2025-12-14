-- Rollback Migration: Restore GoCardless provider support
-- WARNING: This will NOT restore deleted connection data
-- This only restores the enum value to allow the application to handle existing connections

-- Create new enum with gocardless restored
CREATE TYPE bank_providers_new AS ENUM('gocardless', 'plaid', 'teller', 'enablebanking');

-- Update the bank_connections table to use the new enum
ALTER TABLE bank_connections 
  ALTER COLUMN provider TYPE bank_providers_new 
  USING provider::text::bank_providers_new;

-- Drop the old enum and rename the new one
DROP TYPE bank_providers;
ALTER TYPE bank_providers_new RENAME TO bank_providers;

-- Note: This rollback does NOT restore deleted connections or accounts
-- If you need to restore data, use a database backup from before the migration
