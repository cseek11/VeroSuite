-- ============================================================================
-- MOCK CUSTOMER DATA FOR TESTING
-- ============================================================================
-- Populate the database with realistic customer data for development/testing
-- This script works with your existing database structure

-- First, let's add the missing customer-specific fields to your existing accounts table
-- Only add fields that don't already exist

DO $$
BEGIN
    -- Add last_service_date if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'last_service_date') THEN
        ALTER TABLE accounts ADD COLUMN last_service_date DATE;
        RAISE NOTICE 'Added last_service_date column to accounts table';
    END IF;
    
    -- Add next_service_date if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'next_service_date') THEN
        ALTER TABLE accounts ADD COLUMN next_service_date DATE;
        RAISE NOTICE 'Added next_service_date column to accounts table';
    END IF;
    
    -- Add total_services if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'total_services') THEN
        ALTER TABLE accounts ADD COLUMN total_services INTEGER DEFAULT 0;
        RAISE NOTICE 'Added total_services column to accounts table';
    END IF;
    
    -- Add total_spent if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'total_spent') THEN
        ALTER TABLE accounts ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added total_spent column to accounts table';
    END IF;
    
    -- Add preferences if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'preferences') THEN
        ALTER TABLE accounts ADD COLUMN preferences JSONB;
        RAISE NOTICE 'Added preferences column to accounts table';
    END IF;
    
    -- Add tags if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'tags') THEN
        ALTER TABLE accounts ADD COLUMN tags TEXT[];
        RAISE NOTICE 'Added tags column to accounts table';
    END IF;
    
    -- Add notes if it doesn't exist (using existing notes field if available)
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'notes') THEN
        ALTER TABLE accounts ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column to accounts table';
    END IF;
    
    RAISE NOTICE 'Database structure check complete';
END $$;

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM accounts WHERE tenant_id IS NULL OR tenant_id = '00000000-0000-0000-0000-000000000000';

-- Insert mock customer data using your existing table structure
INSERT INTO accounts (
    tenant_id,
    name, 
    account_type, 
    status, 
    phone, 
    email, 
    address, 
    city, 
    state, 
    zip_code,
    property_type,
    property_size,
    access_instructions,
    emergency_contact,
    preferred_contact_method,
    ar_balance,
    -- New fields we just added
    last_service_date,
    next_service_date,
    total_services,
    total_spent,
    preferences,
    tags,
    notes
) VALUES
-- Residential Customers
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id - you'll need to replace this
    'John Smith',
    'residential',
    'active',
    '(555) 123-4567',
    'john.smith@email.com',
    '123 Maple Avenue',
    'Springfield',
    'IL',
    '62701',
    'Single Family Home',
    '2000 sq ft',
    'Gate code: 1234. Dogs in backyard.',
    'Jane Smith (555) 123-4568',
    'phone',
    0.00,
    NOW() - INTERVAL '3 months',
    NOW() + INTERVAL '2 months',
    8,
    1200.00,
    '{"preferredContactMethod": "phone", "preferredServiceTime": "morning", "hasPets": true, "petNotes": "Two dogs in backyard", "organicProductsOnly": false, "noChemicals": false}',
    ARRAY['residential', 'pets', 'morning-preference'],
    'Customer prefers morning appointments. Has two dogs in backyard.'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'Sarah Johnson',
    'residential',
    'active',
    '(555) 234-5678',
    'sarah.j@email.com',
    '456 Oak Street',
    'Springfield',
    'IL',
    '62702',
    'Single Family Home',
    '1800 sq ft',
    'Side door access. No pets.',
    'Mike Johnson (555) 234-5679',
    'email',
    0.00,
    NOW() - INTERVAL '1 month',
    NOW() + INTERVAL '1 month',
    6,
    900.00,
    '{"preferredContactMethod": "email", "preferredServiceTime": "afternoon", "hasPets": false, "organicProductsOnly": true, "noChemicals": true, "specialInstructions": "Allergic to certain chemicals"}',
    ARRAY['residential', 'chemical-sensitive', 'organic-only'],
    'Allergic to certain chemicals. Use organic products only.'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'Mike Davis',
    'residential',
    'active',
    '(555) 345-6789',
    'mike.davis@email.com',
    '789 Pine Road',
    'Springfield',
    'IL',
    '62703',
    'Large Property',
    '5000 sq ft',
    'Driveway access. Large property.',
    'Lisa Davis (555) 345-6790',
    'text',
    0.00,
    NOW() - INTERVAL '2 weeks',
    NOW() + INTERVAL '2.5 months',
    12,
    1800.00,
    '{"preferredContactMethod": "text", "preferredServiceTime": "anytime", "hasPets": true, "petNotes": "Three cats indoors", "organicProductsOnly": false, "noChemicals": false}',
    ARRAY['residential', 'quarterly-plan', 'large-property'],
    'Large property. Quarterly service plan.'
),

-- Commercial Customers
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'Downtown Office Complex',
    'commercial',
    'active',
    '(555) 678-9012',
    'maintenance@downtownoffice.com',
    '1000 Main Street',
    'Springfield',
    'IL',
    '62701',
    'Office Building',
    '50000 sq ft',
    'After hours access only. Contact building manager.',
    'Building Manager (555) 678-9013',
    'email',
    0.00,
    NOW() - INTERVAL '2 weeks',
    NOW() + INTERVAL '2 weeks',
    60,
    15000.00,
    '{"preferredContactMethod": "email", "preferredServiceTime": "evening", "hasPets": false, "organicProductsOnly": false, "noChemicals": false, "specialInstructions": "After hours service only"}',
    ARRAY['commercial', 'monthly-contract', 'after-hours', 'large-building'],
    'Large office building. Monthly service contract. Contact: Building Manager'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'Springfield Mall',
    'commercial',
    'active',
    '(555) 789-0123',
    'facilities@springfieldmall.com',
    '2500 Shopping Center Drive',
    'Springfield',
    'IL',
    '62702',
    'Shopping Mall',
    '200000 sq ft',
    'Service before mall opens. Food court access.',
    'Facilities Manager (555) 789-0124',
    'phone',
    0.00,
    NOW() - INTERVAL '1 week',
    NOW() + INTERVAL '1 week',
    156,
    25000.00,
    '{"preferredContactMethod": "phone", "preferredServiceTime": "early-morning", "hasPets": false, "organicProductsOnly": false, "noChemicals": false, "specialInstructions": "Service before mall opens"}',
    ARRAY['commercial', 'weekly-service', 'food-establishment', 'early-morning'],
    'Shopping mall with food court. Weekly pest monitoring.'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'TechStart Inc.',
    'commercial',
    'active',
    '(555) 890-1234',
    'office@techstart.com',
    '500 Innovation Way',
    'Springfield',
    'IL',
    '62703',
    'Office Space',
    '15000 sq ft',
    'Weekend access. Low-odor products only.',
    'Office Manager (555) 890-1235',
    'email',
    0.00,
    NOW() - INTERVAL '1 month',
    NOW() + INTERVAL '2 months',
    8,
    2400.00,
    '{"preferredContactMethod": "email", "preferredServiceTime": "weekend", "hasPets": false, "organicProductsOnly": true, "noChemicals": true, "specialInstructions": "Low-odor products only"}',
    ARRAY['commercial', 'quarterly-service', 'low-odor', 'weekend-service'],
    'Software company office. Quarterly service. Sensitive to chemical odors.'
),

-- Industrial Customers
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'Springfield Manufacturing Co.',
    'industrial',
    'active',
    '(555) 123-7890',
    'maintenance@springfieldmfg.com',
    '1500 Industrial Parkway',
    'Springfield',
    'IL',
    '62705',
    'Manufacturing Facility',
    '500000 sq ft',
    '24/7 facility. Coordinate with maintenance team.',
    'Maintenance Supervisor (555) 123-7891',
    'phone',
    0.00,
    NOW() - INTERVAL '2 weeks',
    NOW() + INTERVAL '2 weeks',
    96,
    30000.00,
    '{"preferredContactMethod": "phone", "preferredServiceTime": "anytime", "hasPets": false, "organicProductsOnly": false, "noChemicals": false, "specialInstructions": "24/7 facility, coordinate with maintenance team"}',
    ARRAY['industrial', 'monthly-service', '24-7-operation', 'large-facility'],
    'Large manufacturing facility. Monthly service. 24/7 operation.'
),

-- More Residential Customers for variety
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'Emily Rodriguez',
    'residential',
    'active',
    '(555) 345-9012',
    'emily.r@email.com',
    '888 Cedar Street',
    'Springfield',
    'IL',
    '62707',
    'Single Family Home',
    '2200 sq ft',
    'Front door access. Children present.',
    'Carlos Rodriguez (555) 345-9013',
    'text',
    0.00,
    NOW() - INTERVAL '1 month',
    NOW() + INTERVAL '2 months',
    10,
    1500.00,
    '{"preferredContactMethod": "text", "preferredServiceTime": "afternoon", "hasPets": false, "organicProductsOnly": true, "noChemicals": true, "specialInstructions": "Children present, use child-safe products"}',
    ARRAY['residential', 'children', 'eco-friendly', 'child-safe'],
    'Single family home. Has children. Prefers eco-friendly products.'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder tenant_id
    'David Thompson',
    'residential',
    'suspended',
    '(555) 456-0123',
    'david.t@email.com',
    '555 Willow Way',
    'Springfield',
    'IL',
    '62708',
    'Single Family Home',
    '1600 sq ft',
    'Back door access. One cat indoors.',
    'Mary Thompson (555) 456-0124',
    'phone',
    150.00,
    NOW() - INTERVAL '4 months',
    NULL,
    12,
    1800.00,
    '{"preferredContactMethod": "phone", "preferredServiceTime": "morning", "hasPets": true, "petNotes": "One cat", "organicProductsOnly": false, "noChemicals": false}',
    ARRAY['residential', 'payment-issues', 'suspended'],
    'Payment issues. Account suspended until payment received.'
);

-- Create customer notes table if it doesn't exist (for additional customer information)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customer_notes') THEN
        CREATE TABLE customer_notes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'general',
            created_by VARCHAR(255) DEFAULT 'System',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            tenant_id UUID
        );
        
        CREATE INDEX idx_customer_notes_customer_id ON customer_notes(customer_id);
        CREATE INDEX idx_customer_notes_type ON customer_notes(type);
        CREATE INDEX idx_customer_notes_created_at ON customer_notes(created_at);
        
        RAISE NOTICE 'Created customer_notes table';
    END IF;
END $$;

-- Create customer service history table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customer_service_history') THEN
        CREATE TABLE customer_service_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
            service_type VARCHAR(255) NOT NULL,
            service_date DATE NOT NULL,
            technician VARCHAR(255),
            notes TEXT,
            amount DECIMAL(10,2) DEFAULT 0.00,
            status VARCHAR(50) DEFAULT 'completed',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            tenant_id UUID
        );
        
        CREATE INDEX idx_service_history_customer_id ON customer_service_history(customer_id);
        CREATE INDEX idx_service_history_service_date ON customer_service_history(service_date);
        CREATE INDEX idx_service_history_status ON customer_service_history(status);
        
        RAISE NOTICE 'Created customer_service_history table';
    END IF;
END $$;

-- Insert some sample notes and service history
INSERT INTO customer_notes (customer_id, content, type, created_by, tenant_id) VALUES
((SELECT id FROM accounts WHERE name = 'John Smith' LIMIT 1), 'Customer called about increased ant activity in kitchen. Scheduled follow-up inspection.', 'service', 'Tech Support', '00000000-0000-0000-0000-000000000000'),
((SELECT id FROM accounts WHERE name = 'John Smith' LIMIT 1), 'Dogs will be in backyard during service. Please use pet-safe products.', 'preference', 'Customer Service', '00000000-0000-0000-0000-000000000000'),
((SELECT id FROM accounts WHERE name = 'Sarah Johnson' LIMIT 1), 'Customer has severe chemical allergies. Use only organic, fragrance-free products.', 'preference', 'Manager', '00000000-0000-0000-0000-000000000000'),
((SELECT id FROM accounts WHERE name = 'Downtown Office Complex' LIMIT 1), 'Building manager requested after-hours service only. No exceptions.', 'preference', 'Account Manager', '00000000-0000-0000-0000-000000000000');

-- Insert sample service history
INSERT INTO customer_service_history (customer_id, service_type, service_date, technician, notes, amount, status, tenant_id) VALUES
((SELECT id FROM accounts WHERE name = 'John Smith' LIMIT 1), 'General Pest Control', NOW() - INTERVAL '3 months', 'Alex Johnson', 'Applied perimeter treatment. No issues found.', 150.00, 'completed', '00000000-0000-0000-0000-000000000000'),
((SELECT id FROM accounts WHERE name = 'John Smith' LIMIT 1), 'Ant Treatment', NOW() - INTERVAL '6 months', 'Sarah Wilson', 'Targeted ant treatment in kitchen area.', 120.00, 'completed', '00000000-0000-0000-0000-000000000000'),
((SELECT id FROM accounts WHERE name = 'Sarah Johnson' LIMIT 1), 'Organic Pest Control', NOW() - INTERVAL '1 month', 'Mike Chen', 'Used organic products only. Customer satisfied.', 180.00, 'completed', '00000000-0000-0000-0000-000000000000'),
((SELECT id FROM accounts WHERE name = 'Downtown Office Complex' LIMIT 1), 'Monthly Service', NOW() - INTERVAL '2 weeks', 'Team A', 'Full building treatment. After-hours service completed.', 1200.00, 'completed', '00000000-0000-0000-0000-000000000000');

-- Update account statistics based on service history
UPDATE accounts 
SET 
    total_services = (
        SELECT COUNT(*) 
        FROM customer_service_history 
        WHERE customer_service_history.customer_id = accounts.id
    ),
    total_spent = (
        SELECT COALESCE(SUM(amount), 0.00) 
        FROM customer_service_history 
        WHERE customer_service_history.customer_id = accounts.id
    ),
    last_service_date = (
        SELECT MAX(service_date) 
        FROM customer_service_history 
        WHERE customer_service_history.customer_id = accounts.id
    )
WHERE id IN (SELECT DISTINCT customer_id FROM customer_service_history);

-- Display summary of inserted data
SELECT 
    'Data Insertion Complete' as status,
    COUNT(*) as total_customers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
    COUNT(CASE WHEN account_type = 'residential' THEN 1 END) as residential_customers,
    COUNT(CASE WHEN account_type = 'commercial' THEN 1 END) as commercial_customers,
    COUNT(CASE WHEN account_type = 'industrial' THEN 1 END) as industrial_customers
FROM accounts;

-- Show sample data
SELECT 
    name, 
    account_type, 
    status, 
    city, 
    total_services, 
    total_spent,
    last_service_date
FROM accounts 
ORDER BY created_at DESC 
LIMIT 10;
