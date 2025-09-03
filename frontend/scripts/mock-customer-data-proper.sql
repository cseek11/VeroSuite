-- ============================================================================
-- PROPER MOCK CUSTOMER DATA FOR YOUR ACTUAL DATABASE SCHEMA
-- ============================================================================
-- This script is TRULY IDEMPOTENT - it can be run multiple times safely
-- It checks if data exists before inserting to prevent duplicate key errors
-- 
-- MULTI-TENANT FLEXIBILITY:
-- To use this script for different tenants, simply replace all instances of:
-- '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
-- with your desired tenant UUID.

-- ============================================================================
-- STEP 1: POPULATE MASTER DATA TABLES (if empty)
-- ============================================================================

-- Insert tenant if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid) THEN
        INSERT INTO public.tenants (id, name, domain, status, subscription_tier, created_at, updated_at)
        VALUES (
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'VeroPest Control',
            'veropest.com',
            'active',
            'premium',
            NOW(),
            NOW()
        );
    END IF;
END $$;

-- Insert customer segments (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'RES_STD') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Residential Standard',
            'RES_STD',
            'Standard residential customers with basic pest control needs',
            '["general_pest_control", "seasonal_treatment"]',
            'standard',
            '{"epa_compliance": true, "pet_safety": true}',
            NOW(),
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'RES_PREM') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Residential Premium',
            'RES_PREM',
            'Premium residential customers with comprehensive pest control',
            '["general_pest_control", "termite_protection", "rodent_control", "seasonal_treatment"]',
            'premium',
            '{"epa_compliance": true, "pet_safety": true, "organic_options": true}',
            NOW(),
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'COM_STD') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Commercial Standard',
            'COM_STD',
            'Standard commercial accounts with regular pest monitoring',
            '["commercial_pest_control", "monthly_monitoring"]',
            'standard',
            '{"epa_compliance": true, "food_safety": true, "after_hours": true}',
            NOW(),
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'COM_PREM') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Commercial Premium',
            'COM_PREM',
            'Premium commercial accounts with comprehensive pest management',
            '["commercial_pest_control", "termite_protection", "rodent_control", "weekly_monitoring", "emergency_response"]',
            'premium',
            '{"epa_compliance": true, "food_safety": true, "after_hours": true, "24_7_support": true}',
            NOW(),
            NOW()
        );
    END IF;
END $$;

-- ============================================================================
-- STEP 2: POPULATE CUSTOMER DATA (IDEMPOTENT)
-- ============================================================================

-- Insert customer accounts (only if they don't exist)
DO $$
BEGIN
    -- John Smith
    IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE name = 'John Smith' AND tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid) THEN
        INSERT INTO public.accounts (id, tenant_id, name, account_type, status, phone, email, address, city, state, zip_code, billing_address, payment_method, billing_cycle, property_type, property_size, access_instructions, emergency_contact, preferred_contact_method, ar_balance, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'John Smith',
            'residential',
            'active',
            '(555) 123-4567',
            'john.smith@email.com',
            '123 Maple Avenue',
            'Springfield',
            'IL',
            '62701',
            '{"address_line1": "123 Maple Avenue", "city": "Springfield", "state": "IL", "zip_code": "62701"}',
            'credit_card',
            'monthly',
            'Single Family Home',
            '2000 sq ft',
            'Gate code: 1234. Dogs in backyard.',
            'Jane Smith (555) 123-4568',
            'phone',
            0.00,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Sarah Johnson
    IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE name = 'Sarah Johnson' AND tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid) THEN
        INSERT INTO public.accounts (id, tenant_id, name, account_type, status, phone, email, address, city, state, zip_code, billing_address, payment_method, billing_cycle, property_type, property_size, access_instructions, emergency_contact, preferred_contact_method, ar_balance, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Sarah Johnson',
            'residential',
            'active',
            '(555) 234-5678',
            'sarah.j@email.com',
            '456 Oak Street',
            'Springfield',
            'IL',
            '62702',
            '{"address_line1": "456 Oak Street", "city": "Springfield", "state": "IL", "zip_code": "62702"}',
            'bank_transfer',
            'quarterly',
            'Single Family Home',
            '1800 sq ft',
            'Side door access. No pets.',
            'Mike Johnson (555) 234-5679',
            'email',
            0.00,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Mike Davis
    IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE name = 'Mike Davis' AND tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid) THEN
        INSERT INTO public.accounts (id, tenant_id, name, account_type, status, phone, email, address, city, state, zip_code, billing_address, payment_method, billing_cycle, property_type, property_size, access_instructions, emergency_contact, preferred_contact_method, ar_balance, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Mike Davis',
            'residential',
            'active',
            '(555) 345-6789',
            'mike.davis@email.com',
            '789 Pine Road',
            'Springfield',
            'IL',
            '62703',
            '{"address_line1": "789 Pine Road", "city": "Springfield", "state": "IL", "zip_code": "62703"}',
            'credit_card',
            'monthly',
            'Large Property',
            '5000 sq ft',
            'Driveway access. Large property.',
            'Lisa Davis (555) 345-6790',
            'text',
            0.00,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Downtown Office Complex
    IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE name = 'Downtown Office Complex' AND tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid) THEN
        INSERT INTO public.accounts (id, tenant_id, name, account_type, status, phone, email, address, city, state, zip_code, billing_address, payment_method, billing_cycle, property_type, property_size, access_instructions, emergency_contact, preferred_contact_method, ar_balance, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Downtown Office Complex',
            'commercial',
            'active',
            '(555) 678-9012',
            'maintenance@downtownoffice.com',
            '1000 Main Street',
            'Springfield',
            'IL',
            '62701',
            '{"address_line1": "1000 Main Street", "city": "Springfield", "state": "IL", "zip_code": "62701"}',
            'invoice',
            'monthly',
            'Office Building',
            '50000 sq ft',
            'After hours access only. Contact building manager.',
            'Building Manager (555) 678-9013',
            'email',
            0.00,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Springfield Mall
    IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE name = 'Springfield Mall' AND tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid) THEN
        INSERT INTO public.accounts (id, tenant_id, name, account_type, status, phone, email, address, city, state, zip_code, billing_address, payment_method, billing_cycle, property_type, property_size, access_instructions, emergency_contact, preferred_contact_method, ar_balance, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Springfield Mall',
            'commercial',
            'active',
            '(555) 789-0123',
            'facilities@springfieldmall.com',
            '2500 Shopping Center Drive',
            'Springfield',
            'IL',
            '62702',
            '{"address_line1": "2500 Shopping Center Drive", "city": "Springfield", "state": "IL", "zip_code": "62702"}',
            'invoice',
            'weekly',
            'Shopping Mall',
            '200000 sq ft',
            'Service before mall opens. Food court access.',
            'Facilities Manager (555) 789-0124',
            'phone',
            0.00,
            NOW(),
            NOW()
        );
    END IF;
END $$;

-- Insert customer profiles (only if they don't exist)
DO $$
DECLARE
    account_record RECORD;
    segment_record RECORD;
BEGIN
    FOR account_record IN 
        SELECT id, name, account_type, property_type, property_size, access_instructions, created_at 
        FROM public.accounts 
        WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
    LOOP
        -- Check if profile already exists for this account
        IF NOT EXISTS (SELECT 1 FROM public.customer_profiles WHERE account_id = account_record.id) THEN
            -- Get the appropriate segment for this account
            SELECT id INTO segment_record FROM public.customer_segments 
            WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid 
            AND segment_code = CASE 
                WHEN account_record.name IN ('John Smith', 'Mike Davis') THEN 'RES_PREM'
                WHEN account_record.name = 'Sarah Johnson' THEN 'RES_STD'
                WHEN account_record.name = 'Downtown Office Complex' THEN 'COM_PREM'
                WHEN account_record.name = 'Springfield Mall' THEN 'COM_PREM'
                ELSE 'RES_STD'
            END;
            
            -- Insert the profile
            INSERT INTO public.customer_profiles (
                id, tenant_id, account_id, segment_id, business_name, business_type, 
                property_type, property_size, access_codes, special_instructions, 
                preferred_language, timezone, contract_start_date, contract_type, 
                contract_value, auto_renew, account_status, payment_status, service_status, 
                created_at, updated_at
            ) VALUES (
                gen_random_uuid(),
                '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
                account_record.id,
                segment_record.id,
                account_record.name,
                CASE 
                    WHEN account_record.account_type = 'residential' THEN 'Residential'
                    WHEN account_record.account_type = 'commercial' THEN 'Commercial'
                    ELSE 'Other'
                END,
                account_record.property_type,
                account_record.property_size,
                account_record.access_instructions,
                CASE 
                    WHEN account_record.name = 'John Smith' THEN 'Dogs in backyard. Use pet-safe products.'
                    WHEN account_record.name = 'Sarah Johnson' THEN 'Allergic to chemicals. Use organic products only.'
                    WHEN account_record.name = 'Mike Davis' THEN 'Large property. Quarterly service plan.'
                    WHEN account_record.name = 'Downtown Office Complex' THEN 'After-hours service only. Contact building manager.'
                    WHEN account_record.name = 'Springfield Mall' THEN 'Service before mall opens. Food court access.'
                    ELSE 'Standard service instructions'
                END,
                'English',
                'America/Chicago',
                account_record.created_at,
                CASE 
                    WHEN account_record.account_type = 'residential' THEN 'monthly'
                    WHEN account_record.account_type = 'commercial' THEN 'annual'
                    ELSE 'monthly'
                END,
                CASE 
                    WHEN account_record.account_type = 'residential' THEN 150.00
                    WHEN account_record.account_type = 'commercial' THEN 1500.00
                    ELSE 150.00
                END,
                true,
                'active',
                'current',
                'active',
                NOW(),
                NOW()
            );
        END IF;
    END LOOP;
END $$;

-- Insert customer contacts (only if they don't exist)
DO $$
DECLARE
    account_record RECORD;
BEGIN
    FOR account_record IN 
        SELECT id, name, email, phone 
        FROM public.accounts 
        WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
    LOOP
        -- Check if contact already exists for this account
        IF NOT EXISTS (SELECT 1 FROM public.customer_contacts WHERE account_id = account_record.id AND is_primary = true) THEN
            INSERT INTO public.customer_contacts (id, tenant_id, account_id, first_name, last_name, email, phone, contact_type, is_primary, created_at)
            VALUES (
                gen_random_uuid(),
                '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
                account_record.id,
                CASE 
                    WHEN account_record.name = 'John Smith' THEN 'John'
                    WHEN account_record.name = 'Sarah Johnson' THEN 'Sarah'
                    WHEN account_record.name = 'Mike Davis' THEN 'Mike'
                    WHEN account_record.name = 'Downtown Office Complex' THEN 'Building'
                    WHEN account_record.name = 'Springfield Mall' THEN 'Facilities'
                    ELSE 'Primary'
                END,
                CASE 
                    WHEN account_record.name = 'John Smith' THEN 'Smith'
                    WHEN account_record.name = 'Sarah Johnson' THEN 'Johnson'
                    WHEN account_record.name = 'Mike Davis' THEN 'Davis'
                    WHEN account_record.name = 'Downtown Office Complex' THEN 'Manager'
                    WHEN account_record.name = 'Springfield Mall' THEN 'Manager'
                    ELSE 'Contact'
                END,
                account_record.email,
                account_record.phone,
                'primary',
                true,
                NOW()
            );
        END IF;
    END LOOP;
END $$;

-- ============================================================================
-- STEP 3: FINAL SUMMARY
-- ============================================================================

-- Display summary of inserted data
SELECT 
    'MOCK DATA INSERTION COMPLETE' as status,
    COUNT(*) as total_customers,
    COUNT(CASE WHEN account_type = 'residential' THEN 1 END) as residential_customers,
    COUNT(CASE WHEN account_type = 'commercial' THEN 1 END) as commercial_customers
FROM public.accounts
WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- Show sample customer data
SELECT 
    a.name, 
    a.account_type, 
    a.status, 
    a.city,
    cp.business_type,
    cp.contract_type,
    cs.segment_name
FROM public.accounts a
LEFT JOIN public.customer_profiles cp ON a.id = cp.account_id
LEFT JOIN public.customer_segments cs ON cp.segment_id = cs.id
WHERE a.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
ORDER BY a.created_at DESC;
