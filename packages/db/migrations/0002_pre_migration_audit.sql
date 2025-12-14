-- Pre-Migration Audit Script
-- Run this BEFORE executing the GoCardless removal migration
-- Save the output for audit and rollback purposes

-- 1. Count total GoCardless connections
SELECT 
  'Total GoCardless Connections' as metric,
  COUNT(*) as count
FROM bank_connections 
WHERE provider = 'gocardless';

-- 2. Count GoCardless connections by team
SELECT 
  'Connections by Team' as report,
  team_id,
  COUNT(*) as connection_count
FROM bank_connections 
WHERE provider = 'gocardless'
GROUP BY team_id
ORDER BY connection_count DESC;

-- 3. Count bank accounts linked to GoCardless connections
SELECT 
  'Bank Accounts to be Deleted' as metric,
  COUNT(*) as count
FROM bank_accounts ba
JOIN bank_connections bc ON ba.bank_connection_id = bc.id
WHERE bc.provider = 'gocardless';

-- 4. Check for transactions linked to GoCardless accounts
SELECT 
  'Transactions Linked to GoCardless Accounts' as metric,
  COUNT(*) as count
FROM transactions t
JOIN bank_accounts ba ON t.bank_account_id = ba.id
JOIN bank_connections bc ON ba.bank_connection_id = bc.id
WHERE bc.provider = 'gocardless';

-- 5. List all GoCardless connection IDs (for manual verification)
SELECT 
  bc.id as connection_id,
  bc.team_id,
  bc.created_at,
  bc.status,
  COUNT(ba.id) as account_count
FROM bank_connections bc
LEFT JOIN bank_accounts ba ON ba.bank_connection_id = bc.id
WHERE bc.provider = 'gocardless'
GROUP BY bc.id, bc.team_id, bc.created_at, bc.status
ORDER BY bc.created_at DESC;

-- 6. Check enum values before migration
SELECT 
  'Current bank_providers enum values' as info,
  unnest(enum_range(NULL::bank_providers)) as enum_value;
