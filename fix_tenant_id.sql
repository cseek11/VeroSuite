-- Fix Tenant ID for Pittsburgh Accounts
-- This script updates the existing Pittsburgh accounts to use the correct tenant ID

-- Update accounts to use the correct tenant ID
UPDATE accounts 
SET tenant_id = 'fb39f15b-b382-4525-8404-1e32ca1486c9'
WHERE name LIKE '%Pittsburgh%' 
   OR name LIKE '%Smith%' 
   OR name LIKE '%Johnson%' 
   OR name LIKE '%Williams%' 
   OR name LIKE '%Brown%' 
   OR name LIKE '%Davis%' 
   OR name LIKE '%Miller%' 
   OR name LIKE '%Wilson%' 
   OR name LIKE '%Taylor%' 
   OR name LIKE '%Anderson%' 
   OR name LIKE '%Thomas%';

-- Update agreements to use the correct tenant ID
UPDATE agreements 
SET tenant_id = 'fb39f15b-b382-4525-8404-1e32ca1486c9'
WHERE account_id IN (
    SELECT id FROM accounts 
    WHERE name LIKE '%Pittsburgh%' 
       OR name LIKE '%Smith%' 
       OR name LIKE '%Johnson%' 
       OR name LIKE '%Williams%' 
       OR name LIKE '%Brown%' 
       OR name LIKE '%Davis%' 
       OR name LIKE '%Miller%' 
       OR name LIKE '%Wilson%' 
       OR name LIKE '%Taylor%' 
       OR name LIKE '%Anderson%' 
       OR name LIKE '%Thomas%'
);

-- Update payments to use the correct tenant ID
UPDATE payments 
SET tenant_id = 'fb39f15b-b382-4525-8404-1e32ca1486c9'
WHERE account_id IN (
    SELECT id FROM accounts 
    WHERE name LIKE '%Pittsburgh%' 
       OR name LIKE '%Smith%' 
       OR name LIKE '%Johnson%' 
       OR name LIKE '%Williams%' 
       OR name LIKE '%Brown%' 
       OR name LIKE '%Davis%' 
       OR name LIKE '%Miller%' 
       OR name LIKE '%Wilson%' 
       OR name LIKE '%Taylor%' 
       OR name LIKE '%Anderson%' 
       OR name LIKE '%Thomas%'
);

-- Verify the updates
SELECT 
    a.name,
    a.tenant_id,
    COUNT(ag.id) as agreement_count,
    STRING_AGG(ag.agreement_type, ', ') as agreement_types,
    COALESCE(MAX(p.overdue_days), 0) as max_overdue_days,
    COUNT(CASE WHEN p.status = 'overdue' THEN 1 END) as overdue_payments
FROM accounts a
LEFT JOIN agreements ag ON ag.account_id = a.id AND ag.status = 'active'
LEFT JOIN payments p ON p.account_id = a.id
WHERE a.name LIKE '%Pittsburgh%' OR a.name LIKE '%Smith%' OR a.name LIKE '%Johnson%'
GROUP BY a.id, a.name, a.tenant_id
ORDER BY a.name;
