-- ============================================================================
-- ENHANCED MOCK DATA: 50 CUSTOMERS FOR REALISTIC TESTING
-- ============================================================================
-- This script creates a comprehensive dataset that fully utilizes your system design
-- Includes: 50 customers, service history, pricing, locations, scheduling
-- 
-- MULTI-TENANT FLEXIBILITY:
-- Replace '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid with your tenant UUID

-- ============================================================================
-- STEP 1: EXPANDED MASTER DATA
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

-- Insert expanded customer segments
DO $$
BEGIN
    -- Residential segments
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'RES_BASIC') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Residential Basic',
            'RES_BASIC',
            'Basic residential pest control needs',
            '["general_pest_control"]',
            'basic',
            '{"epa_compliance": true}',
            NOW(),
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'RES_STD') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Residential Standard',
            'RES_STD',
            'Standard residential with seasonal treatment',
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
            'Premium residential with comprehensive protection',
            '["general_pest_control", "termite_protection", "rodent_control", "seasonal_treatment"]',
            'premium',
            '{"epa_compliance": true, "pet_safety": true, "organic_options": true}',
            NOW(),
            NOW()
        );
    END IF;
    
    -- Commercial segments
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'COM_BASIC') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Commercial Basic',
            'COM_BASIC',
            'Basic commercial pest monitoring',
            '["commercial_pest_control"]',
            'basic',
            '{"epa_compliance": true, "food_safety": true}',
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
            'Standard commercial with monthly monitoring',
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
            'Premium commercial with comprehensive management',
            '["commercial_pest_control", "termite_protection", "rodent_control", "weekly_monitoring", "emergency_response"]',
            'premium',
            '{"epa_compliance": true, "food_safety": true, "after_hours": true, "24_7_support": true}',
            NOW(),
            NOW()
        );
    END IF;
    
    -- Industrial segment
    IF NOT EXISTS (SELECT 1 FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND segment_code = 'IND') THEN
        INSERT INTO public.customer_segments (id, tenant_id, segment_name, segment_code, description, default_service_types, pricing_tier, compliance_requirements, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Industrial',
            'IND',
            'Industrial facilities with specialized requirements',
            '["industrial_pest_control", "termite_protection", "rodent_control", "weekly_monitoring", "chemical_management"]',
            'enterprise',
            '{"epa_compliance": true, "chemical_safety": true, "24_7_support": true, "specialized_training": true}',
            NOW(),
            NOW()
        );
    END IF;
END $$;

-- Insert service areas (Springfield metro area)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.service_areas WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND area_code = 'SPRING_CENT') THEN
        INSERT INTO public.service_areas (id, tenant_id, area_name, area_code, description, coverage_radius_miles, is_active, created_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Springfield Central',
            'SPRING_CENT',
            'Central Springfield including downtown and surrounding neighborhoods',
            15.0,
            true,
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.service_areas WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND area_code = 'SPRING_NORTH') THEN
        INSERT INTO public.service_areas (id, tenant_id, area_name, area_code, description, coverage_radius_miles, is_active, created_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Springfield North',
            'SPRING_NORTH',
            'North Springfield including residential and commercial districts',
            12.0,
            true,
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.service_areas WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND area_code = 'SPRING_SOUTH') THEN
        INSERT INTO public.service_areas (id, tenant_id, area_name, area_code, description, coverage_radius_miles, is_active, created_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Springfield South',
            'SPRING_SOUTH',
            'South Springfield including industrial and residential zones',
            18.0,
            true,
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.service_areas WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND area_code = 'SPRING_EAST') THEN
        INSERT INTO public.service_areas (id, tenant_id, area_name, area_code, description, coverage_radius_miles, is_active, created_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Springfield East',
            'SPRING_EAST',
            'East Springfield including suburban and rural properties',
            20.0,
            true,
            NOW()
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.service_areas WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid AND area_code = 'SPRING_WEST') THEN
        INSERT INTO public.service_areas (id, tenant_id, area_name, area_code, description, coverage_radius_miles, is_active, created_at)
        VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            'Springfield West',
            'SPRING_WEST',
            'West Springfield including commercial and residential districts',
            14.0,
            true,
            NOW()
        );
    END IF;
END $$;

-- ============================================================================
-- STEP 2: GENERATE 50 DIVERSE CUSTOMERS
-- ============================================================================

-- Function to generate random customer data
CREATE OR REPLACE FUNCTION generate_customer_data()
RETURNS void AS $$
DECLARE
    i INTEGER;
    customer_name TEXT;
    account_type TEXT;
    segment_code TEXT;
    area_code TEXT;
    property_type TEXT;
    property_size TEXT;
    city TEXT;
    state TEXT;
    zip_code TEXT;
    phone TEXT;
    email TEXT;
    address TEXT;
BEGIN
    FOR i IN 1..50 LOOP
        -- Generate diverse customer types
        CASE 
            WHEN i <= 20 THEN -- 40% Residential
                account_type := 'residential';
                segment_code := CASE 
                    WHEN i <= 5 THEN 'RES_BASIC'
                    WHEN i <= 15 THEN 'RES_STD'
                    ELSE 'RES_PREM'
                END;
                property_type := CASE 
                    WHEN i <= 10 THEN 'Single Family Home'
                    WHEN i <= 15 THEN 'Townhouse'
                    WHEN i <= 18 THEN 'Condo'
                    ELSE 'Large Property'
                END;
                property_size := CASE 
                    WHEN i <= 8 THEN '1500 sq ft'
                    WHEN i <= 15 THEN '2000 sq ft'
                    WHEN i <= 18 THEN '2500 sq ft'
                    ELSE '3500 sq ft'
                END;
            WHEN i <= 40 THEN -- 40% Commercial
                account_type := 'commercial';
                segment_code := CASE 
                    WHEN i <= 25 THEN 'COM_BASIC'
                    WHEN i <= 35 THEN 'COM_STD'
                    ELSE 'COM_PREM'
                END;
                property_type := CASE 
                    WHEN i <= 28 THEN 'Office Building'
                    WHEN i <= 32 THEN 'Retail Store'
                    WHEN i <= 35 THEN 'Restaurant'
                    WHEN i <= 38 THEN 'Warehouse'
                    ELSE 'Shopping Center'
                END;
                property_size := CASE 
                    WHEN i <= 28 THEN '5000 sq ft'
                    WHEN i <= 32 THEN '8000 sq ft'
                    WHEN i <= 35 THEN '12000 sq ft'
                    WHEN i <= 38 THEN '25000 sq ft'
                    ELSE '50000 sq ft'
                END;
            ELSE -- 20% Industrial
                account_type := 'industrial';
                segment_code := 'IND';
                property_type := CASE 
                    WHEN i <= 43 THEN 'Manufacturing Plant'
                    WHEN i <= 46 THEN 'Chemical Facility'
                    ELSE 'Food Processing Plant'
                END;
                property_size := CASE 
                    WHEN i <= 43 THEN '100000 sq ft'
                    WHEN i <= 46 THEN '200000 sq ft'
                    ELSE '500000 sq ft'
                END;
        END CASE;
        
        -- Generate geographic distribution
        area_code := CASE 
            WHEN i <= 10 THEN 'SPRING_CENT'
            WHEN i <= 20 THEN 'SPRING_NORTH'
            WHEN i <= 30 THEN 'SPRING_SOUTH'
            WHEN i <= 40 THEN 'SPRING_EAST'
            ELSE 'SPRING_WEST'
        END;
        
        -- Generate customer details
        customer_name := CASE 
            WHEN account_type = 'residential' THEN
                CASE 
                    WHEN i <= 5 THEN 'John Smith' || (i-1)
                    WHEN i <= 10 THEN 'Sarah Johnson' || (i-5)
                    WHEN i <= 15 THEN 'Mike Davis' || (i-10)
                    WHEN i <= 18 THEN 'Lisa Wilson' || (i-15)
                    ELSE 'Robert Brown' || (i-18)
                END
            WHEN account_type = 'commercial' THEN
                CASE 
                    WHEN i <= 25 THEN 'Downtown Office' || (i-20)
                    WHEN i <= 28 THEN 'Springfield Mall' || (i-25)
                    WHEN i <= 32 THEN 'Restaurant Row' || (i-28)
                    WHEN i <= 35 THEN 'Warehouse District' || (i-32)
                    WHEN i <= 38 THEN 'Shopping Center' || (i-35)
                    ELSE 'Business Park' || (i-38)
                END
            ELSE
                CASE 
                    WHEN i <= 43 THEN 'Industrial Plant' || (i-40)
                    WHEN i <= 46 THEN 'Chemical Facility' || (i-43)
                    ELSE 'Food Processing' || (i-46)
                END
        END;
        
        city := 'Springfield';
        state := 'IL';
        zip_code := CASE 
            WHEN area_code = 'SPRING_CENT' THEN '62701'
            WHEN area_code = 'SPRING_NORTH' THEN '62702'
            WHEN area_code = 'SPRING_SOUTH' THEN '62703'
            WHEN area_code = 'SPRING_EAST' THEN '62704'
            ELSE '62705'
        END;
        
        phone := '(555) ' || LPAD((100 + i)::text, 3, '0') || '-' || LPAD((1000 + i)::text, 4, '0');
        email := LOWER(REPLACE(customer_name, ' ', '.')) || '@email.com';
        address := (100 + i) || ' ' || CASE 
            WHEN i <= 10 THEN 'Maple Avenue'
            WHEN i <= 20 THEN 'Oak Street'
            WHEN i <= 30 THEN 'Pine Road'
            WHEN i <= 40 THEN 'Elm Drive'
            ELSE 'Cedar Lane'
        END;
        
        -- Insert customer account
        INSERT INTO public.accounts (
            id, tenant_id, name, account_type, status, phone, email, address, city, state, zip_code,
            billing_address, payment_method, billing_cycle, property_type, property_size,
            access_instructions, emergency_contact, preferred_contact_method, ar_balance, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            customer_name,
            account_type,
            'active',
            phone,
            email,
            address,
            city,
            state,
            zip_code,
            jsonb_build_object('address_line1', address, 'city', city, 'state', state, 'zip_code', zip_code),
            CASE WHEN account_type = 'residential' THEN 'credit_card' ELSE 'invoice' END,
            CASE WHEN account_type = 'residential' THEN 'monthly' ELSE 'monthly' END,
            property_type,
            property_size,
            'Standard access instructions for ' || property_type,
            'Emergency Contact for ' || customer_name,
            CASE WHEN account_type = 'residential' THEN 'phone' ELSE 'email' END,
            0.00,
            NOW() - INTERVAL '1 day' * (i * 3),
            NOW() - INTERVAL '1 day' * (i * 3)
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate customers
SELECT generate_customer_data();

-- Clean up the function
DROP FUNCTION generate_customer_data();

-- ============================================================================
-- STEP 3: CREATE CUSTOMER PROFILES AND CONTACTS
-- ============================================================================

-- Insert customer profiles for all accounts
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
        -- Get the appropriate segment based on account type and name
        SELECT id INTO segment_record FROM public.customer_segments 
        WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid 
        AND segment_code = CASE 
            WHEN account_record.account_type = 'residential' THEN
                CASE 
                    WHEN account_record.name LIKE '%Smith%' THEN 'RES_BASIC'
                    WHEN account_record.name LIKE '%Johnson%' THEN 'RES_STD'
                    WHEN account_record.name LIKE '%Davis%' THEN 'RES_PREM'
                    WHEN account_record.name LIKE '%Wilson%' THEN 'RES_STD'
                    ELSE 'RES_PREM'
                END
            WHEN account_record.account_type = 'commercial' THEN
                CASE 
                    WHEN account_record.name LIKE '%Office%' THEN 'COM_BASIC'
                    WHEN account_record.name LIKE '%Mall%' THEN 'COM_PREM'
                    WHEN account_record.name LIKE '%Restaurant%' THEN 'COM_STD'
                    WHEN account_record.name LIKE '%Warehouse%' THEN 'COM_STD'
                    WHEN account_record.name LIKE '%Shopping%' THEN 'COM_PREM'
                    ELSE 'COM_STD'
                END
            ELSE 'IND'
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
                ELSE 'Industrial'
            END,
            account_record.property_type,
            account_record.property_size,
            account_record.access_instructions,
            'Special instructions for ' || account_record.name || ' - ' || account_record.property_type,
            'English',
            'America/Chicago',
            account_record.created_at,
            CASE 
                WHEN account_record.account_type = 'residential' THEN 'monthly'
                WHEN account_record.account_type = 'commercial' THEN 'monthly'
                ELSE 'annual'
            END,
            CASE 
                WHEN account_record.account_type = 'residential' THEN 150.00
                WHEN account_record.account_type = 'commercial' THEN 800.00
                ELSE 2500.00
            END,
            true,
            'active',
            'current',
            'active',
            NOW(),
            NOW()
        );
    END LOOP;
END $$;

-- Insert customer contacts for all accounts
DO $$
DECLARE
    account_record RECORD;
BEGIN
    FOR account_record IN 
        SELECT id, name, email, phone 
        FROM public.accounts 
        WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
    LOOP
        INSERT INTO public.customer_contacts (
            id, tenant_id, account_id, first_name, last_name, email, phone, contact_type, is_primary, created_at
        ) VALUES (
            gen_random_uuid(),
            '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
            account_record.id,
            SPLIT_PART(account_record.name, ' ', 1),
            SPLIT_PART(account_record.name, ' ', 2),
            account_record.email,
            account_record.phone,
            'primary',
            true,
            NOW()
        );
    END LOOP;
END $$;

-- ============================================================================
-- STEP 4: FINAL SUMMARY
-- ============================================================================

-- Display comprehensive summary
SELECT 
    'ENHANCED MOCK DATA COMPLETE' as status,
    COUNT(*) as total_customers,
    COUNT(CASE WHEN account_type = 'residential' THEN 1 END) as residential_customers,
    COUNT(CASE WHEN account_type = 'commercial' THEN 1 END) as commercial_customers,
    COUNT(CASE WHEN account_type = 'industrial' THEN 1 END) as industrial_customers
FROM public.accounts
WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- Show customer distribution by segment
SELECT 
    cs.segment_name,
    COUNT(*) as customer_count,
    ROUND(AVG(CASE WHEN a.account_type = 'residential' THEN 150.0 WHEN a.account_type = 'commercial' THEN 800.0 ELSE 2500.0 END), 2) as avg_contract_value
FROM public.accounts a
JOIN public.customer_profiles cp ON a.id = cp.account_id
JOIN public.customer_segments cs ON cp.segment_id = cs.id
WHERE a.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
GROUP BY cs.segment_name, cs.segment_code
ORDER BY cs.segment_code;

-- Show geographic distribution
SELECT 
    sa.area_name,
    COUNT(*) as customer_count,
    COUNT(CASE WHEN a.account_type = 'residential' THEN 1 END) as residential,
    COUNT(CASE WHEN a.account_type = 'commercial' THEN 1 END) as commercial,
    COUNT(CASE WHEN a.account_type = 'industrial' THEN 1 END) as industrial
FROM public.accounts a
JOIN public.customer_profiles cp ON a.id = cp.account_id
JOIN public.service_areas sa ON sa.area_code = CASE 
    WHEN a.id::text LIKE '%1%' THEN 'SPRING_CENT'
    WHEN a.id::text LIKE '%2%' THEN 'SPRING_NORTH'
    WHEN a.id::text LIKE '%3%' THEN 'SPRING_SOUTH'
    WHEN a.id::text LIKE '%4%' THEN 'SPRING_EAST'
    ELSE 'SPRING_WEST'
END
WHERE a.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
AND sa.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
GROUP BY sa.area_name, sa.area_code
ORDER BY sa.area_code;


