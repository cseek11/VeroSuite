-- Pittsburgh Mock Data: 20 Accounts with Real Agreement Data
-- Run this in your Supabase SQL editor after the main migration

-- Use the correct tenant ID that matches the current user
DO $$
DECLARE
    first_tenant_id UUID := 'fb39f15b-b382-4525-8404-1e32ca1486c9';
BEGIN
    
    -- Insert 20 Pittsburgh-area accounts
    INSERT INTO accounts (id, tenant_id, name, account_type, phone, billing_address, created_at, updated_at) VALUES
    -- Commercial Accounts
    (gen_random_uuid(), first_tenant_id, 'Downtown Pittsburgh Office Complex', 'commercial', '(412) 555-0101', '{"address": "123 Grant Street, Pittsburgh, PA 15222"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Oakland University District', 'commercial', '(412) 555-0102', '{"address": "456 Forbes Avenue, Pittsburgh, PA 15213"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Strip District Warehouse', 'commercial', '(412) 555-0103', '{"address": "789 Penn Avenue, Pittsburgh, PA 15222"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'South Side Works', 'commercial', '(412) 555-0104', '{"address": "321 Carson Street, Pittsburgh, PA 15203"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Lawrenceville Tech Hub', 'commercial', '(412) 555-0105', '{"address": "654 Butler Street, Pittsburgh, PA 15201"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Shadyside Medical Center', 'commercial', '(412) 555-0106', '{"address": "987 Walnut Street, Pittsburgh, PA 15232"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Mount Washington Restaurant', 'commercial', '(412) 555-0107', '{"address": "147 Grandview Avenue, Pittsburgh, PA 15211"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Bloomfield Italian Market', 'commercial', '(412) 555-0108', '{"address": "258 Liberty Avenue, Pittsburgh, PA 15224"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Squirrel Hill Jewish Community Center', 'commercial', '(412) 555-0109', '{"address": "369 Murray Avenue, Pittsburgh, PA 15217"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Highland Park Zoo', 'commercial', '(412) 555-0110', '{"address": "741 Highland Avenue, Pittsburgh, PA 15206"}', NOW(), NOW()),
    
    -- Residential Accounts
    (gen_random_uuid(), first_tenant_id, 'Smith Family Residence', 'residential', '(412) 555-0111', '{"address": "159 Beechwood Boulevard, Pittsburgh, PA 15216"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Johnson Home', 'residential', '(412) 555-0112', '{"address": "753 Homewood Avenue, Pittsburgh, PA 15208"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Williams Residence', 'residential', '(412) 555-0113', '{"address": "357 Brighton Road, Pittsburgh, PA 15212"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Brown Family Home', 'residential', '(412) 555-0114', '{"address": "951 Brownsville Road, Pittsburgh, PA 15210"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Davis Residence', 'residential', '(412) 555-0115', '{"address": "753 Hazelwood Avenue, Pittsburgh, PA 15207"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Miller Family Home', 'residential', '(412) 555-0116', '{"address": "159 Troy Hill Road, Pittsburgh, PA 15214"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Wilson Residence', 'residential', '(412) 555-0117', '{"address": "753 Spring Hill Avenue, Pittsburgh, PA 15215"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Taylor Family Home', 'residential', '(412) 555-0118', '{"address": "357 Wilkins Avenue, Pittsburgh, PA 15218"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Anderson Residence', 'residential', '(412) 555-0119', '{"address": "951 Banksville Road, Pittsburgh, PA 15220"}', NOW(), NOW()),
    (gen_random_uuid(), first_tenant_id, 'Thomas Family Home', 'residential', '(412) 555-0120', '{"address": "753 West Liberty Avenue, Pittsburgh, PA 15221"}', NOW(), NOW());

    -- Now add agreements for each account (varied combinations)
    -- Account 1: Multiple agreements, some overdue
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Downtown Pittsburgh Office Complex' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 200.00, 2400.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Downtown Pittsburgh Office Complex' LIMIT 1), 'monthly_pest_control', '2024-02-01', '2025-02-01', 'active', 150.00, 1800.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Downtown Pittsburgh Office Complex' LIMIT 1), 'annual_termite_renewal', '2024-03-01', '2025-03-01', 'active', 300.00, 3600.00);

    -- Account 2: Single agreement, current
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Oakland University District' LIMIT 1), 'monthly_pest_control', '2024-01-15', '2025-01-15', 'active', 175.00, 2100.00);

    -- Account 3: Multiple agreements, some overdue
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Strip District Warehouse' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 250.00, 3000.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Strip District Warehouse' LIMIT 1), 'termite_bait_stations', '2024-02-01', '2025-02-01', 'active', 400.00, 4800.00);

    -- Account 4: Rat monitoring only
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'South Side Works' LIMIT 1), 'rat_monitoring', '2024-01-01', '2025-01-01', 'active', 100.00, 1200.00);

    -- Account 5: Tech hub with comprehensive coverage
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 225.00, 2700.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 'monthly_pest_control', '2024-02-01', '2025-02-01', 'active', 125.00, 1500.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 'annual_termite_renewal', '2024-03-01', '2025-03-01', 'active', 350.00, 4200.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 'termite_bait_stations', '2024-04-01', '2025-04-01', 'active', 450.00, 5400.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 'rat_monitoring', '2024-05-01', '2025-05-01', 'active', 75.00, 900.00);

    -- Account 6: Medical center with basic coverage
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Shadyside Medical Center' LIMIT 1), 'monthly_pest_control', '2024-01-01', '2025-01-01', 'active', 300.00, 3600.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Shadyside Medical Center' LIMIT 1), 'rat_monitoring', '2024-02-01', '2025-02-01', 'active', 150.00, 1800.00);

    -- Account 7: Restaurant with pest control
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Mount Washington Restaurant' LIMIT 1), 'monthly_pest_control', '2024-01-01', '2025-01-01', 'active', 200.00, 2400.00);

    -- Account 8: Market with termite protection
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Bloomfield Italian Market' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 150.00, 1800.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Bloomfield Italian Market' LIMIT 1), 'termite_bait_stations', '2024-02-01', '2025-02-01', 'active', 300.00, 3600.00);

    -- Account 9: Community center
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Squirrel Hill Jewish Community Center' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 275.00, 3300.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Squirrel Hill Jewish Community Center' LIMIT 1), 'annual_termite_renewal', '2024-02-01', '2025-02-01', 'active', 400.00, 4800.00);

    -- Account 10: Zoo with comprehensive coverage
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Highland Park Zoo' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 500.00, 6000.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Highland Park Zoo' LIMIT 1), 'monthly_pest_control', '2024-02-01', '2025-02-01', 'active', 300.00, 3600.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Highland Park Zoo' LIMIT 1), 'rat_monitoring', '2024-03-01', '2025-03-01', 'active', 200.00, 2400.00);

    -- Residential accounts with various agreements
    INSERT INTO agreements (id, tenant_id, account_id, agreement_type, start_date, end_date, status, monthly_amount, annual_amount) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Smith Family Residence' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 120.00, 1440.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Johnson Home' LIMIT 1), 'monthly_pest_control', '2024-01-01', '2025-01-01', 'active', 85.00, 1020.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Williams Residence' LIMIT 1), 'annual_termite_renewal', '2024-01-01', '2025-01-01', 'active', 200.00, 2400.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Brown Family Home' LIMIT 1), 'termite_bait_stations', '2024-01-01', '2025-01-01', 'active', 250.00, 3000.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Davis Residence' LIMIT 1), 'rat_monitoring', '2024-01-01', '2025-01-01', 'active', 60.00, 720.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Miller Family Home' LIMIT 1), 'annual_pest_control', '2024-01-01', '2025-01-01', 'active', 110.00, 1320.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Wilson Residence' LIMIT 1), 'monthly_pest_control', '2024-01-01', '2025-01-01', 'active', 90.00, 1080.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Taylor Family Home' LIMIT 1), 'annual_termite_renewal', '2024-01-01', '2025-01-01', 'active', 180.00, 2160.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Anderson Residence' LIMIT 1), 'termite_bait_stations', '2024-01-01', '2025-01-01', 'active', 220.00, 2640.00),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Thomas Family Home' LIMIT 1), 'rat_monitoring', '2024-01-01', '2025-01-01', 'active', 55.00, 660.00);

    -- Now add payments with various statuses and overdue amounts
    -- Some accounts will have overdue payments (30+ days)
    
    -- Account 1: Multiple overdue payments
    INSERT INTO payments (id, tenant_id, account_id, amount, due_date, status, overdue_days) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Downtown Pittsburgh Office Complex' LIMIT 1), 200.00, '2024-07-01', 'overdue', 45),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Downtown Pittsburgh Office Complex' LIMIT 1), 150.00, '2024-08-01', 'overdue', 15),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Downtown Pittsburgh Office Complex' LIMIT 1), 300.00, '2024-09-01', 'pending', 0);

    -- Account 3: Overdue payment
    INSERT INTO payments (id, tenant_id, account_id, amount, due_date, status, overdue_days) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Strip District Warehouse' LIMIT 1), 250.00, '2024-07-15', 'overdue', 35),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Strip District Warehouse' LIMIT 1), 400.00, '2024-09-15', 'pending', 0);

    -- Account 5: Multiple overdue payments
    INSERT INTO payments (id, tenant_id, account_id, amount, due_date, status, overdue_days) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 225.00, '2024-06-01', 'overdue', 75),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 125.00, '2024-07-01', 'overdue', 45),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 350.00, '2024-08-01', 'overdue', 15),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 450.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Lawrenceville Tech Hub' LIMIT 1), 75.00, '2024-10-01', 'pending', 0);

    -- Account 10: Overdue payment
    INSERT INTO payments (id, tenant_id, account_id, amount, due_date, status, overdue_days) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Highland Park Zoo' LIMIT 1), 500.00, '2024-07-01', 'overdue', 45),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Highland Park Zoo' LIMIT 1), 300.00, '2024-08-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Highland Park Zoo' LIMIT 1), 200.00, '2024-09-01', 'pending', 0);

    -- Some residential accounts with overdue payments
    INSERT INTO payments (id, tenant_id, account_id, amount, due_date, status, overdue_days) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Johnson Home' LIMIT 1), 85.00, '2024-07-01', 'overdue', 45),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Williams Residence' LIMIT 1), 200.00, '2024-07-15', 'overdue', 35),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Brown Family Home' LIMIT 1), 250.00, '2024-06-01', 'overdue', 75),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Miller Family Home' LIMIT 1), 110.00, '2024-08-01', 'overdue', 15),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Taylor Family Home' LIMIT 1), 180.00, '2024-07-01', 'overdue', 45);

    -- Add some current/pending payments for accounts without overdue
    INSERT INTO payments (id, tenant_id, account_id, amount, due_date, status, overdue_days) VALUES
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Oakland University District' LIMIT 1), 175.00, '2024-09-15', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'South Side Works' LIMIT 1), 100.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Shadyside Medical Center' LIMIT 1), 300.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Shadyside Medical Center' LIMIT 1), 150.00, '2024-09-15', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Mount Washington Restaurant' LIMIT 1), 200.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Bloomfield Italian Market' LIMIT 1), 150.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Bloomfield Italian Market' LIMIT 1), 300.00, '2024-09-15', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Squirrel Hill Jewish Community Center' LIMIT 1), 275.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Squirrel Hill Jewish Community Center' LIMIT 1), 400.00, '2024-09-15', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Smith Family Residence' LIMIT 1), 120.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Davis Residence' LIMIT 1), 60.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Wilson Residence' LIMIT 1), 90.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Anderson Residence' LIMIT 1), 220.00, '2024-09-01', 'pending', 0),
    (gen_random_uuid(), first_tenant_id, (SELECT id FROM accounts WHERE name = 'Thomas Family Home' LIMIT 1), 55.00, '2024-09-01', 'pending', 0);

END $$;

-- Verify the data was inserted
SELECT 
    a.name,
    a.account_type,
    COUNT(ag.id) as agreement_count,
    STRING_AGG(ag.agreement_type, ', ') as agreement_types,
    COALESCE(MAX(p.overdue_days), 0) as max_overdue_days,
    COUNT(CASE WHEN p.status = 'overdue' THEN 1 END) as overdue_payments
FROM accounts a
LEFT JOIN agreements ag ON ag.account_id = a.id AND ag.status = 'active'
LEFT JOIN payments p ON p.account_id = a.id
WHERE a.name LIKE '%Pittsburgh%' OR a.name LIKE '%Smith%' OR a.name LIKE '%Johnson%'
GROUP BY a.id, a.name, a.account_type
ORDER BY a.name;
