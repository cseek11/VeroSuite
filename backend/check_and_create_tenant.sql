-- Check if tenants exist and create one if needed
-- Run this BEFORE running the customer seed script

-- First, check if any tenants exist
SELECT 'Current tenants:' as info;
SELECT id, name, domain FROM "tenant";

-- If no tenants exist, create one
INSERT INTO "tenant" (
  id,
  name,
  domain,
  status,
  subscription_tier,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Ace Pest Control',
  'acepest.local',
  'active',
  'basic',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "tenant" LIMIT 1);

-- Verify tenant was created
SELECT 'After creation:' as info;
SELECT id, name, domain FROM "tenant";





