-- ============================================================================
-- COMPREHENSIVE DATABASE STRUCTURE ANALYSIS
-- ============================================================================
-- This script will show us the exact structure of your database tables
-- so we can create proper mock data that works with your existing schema

-- Check the structure of the main accounts table
SELECT 
    'ACCOUNTS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'accounts'
ORDER BY ordinal_position;

-- Check the structure of the users table
SELECT 
    'USERS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check the structure of the tenants table
SELECT 
    'TENANTS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tenants'
ORDER BY ordinal_position;

-- Check the structure of the customer_profiles table
SELECT 
    'CUSTOMER_PROFILES TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customer_profiles'
ORDER BY ordinal_position;

-- Check the structure of the customer_segments table
SELECT 
    'CUSTOMER_SEGMENTS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customer_segments'
ORDER BY ordinal_position;

-- Check the structure of the locations table
SELECT 
    'LOCATIONS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'locations'
ORDER BY ordinal_position;

-- Check the structure of the service_types table
SELECT 
    'SERVICE_TYPES TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'service_types'
ORDER BY ordinal_position;

-- Check the structure of the service_categories table
SELECT 
    'SERVICE_CATEGORIES TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'service_categories'
ORDER BY ordinal_position;

-- Check the structure of the service_areas table
SELECT 
    'SERVICE_AREAS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'service_areas'
ORDER BY ordinal_position;

-- Check the structure of the pricing_tiers table
SELECT 
    'PRICING_TIERS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'pricing_tiers'
ORDER BY ordinal_position;

-- Check the structure of the payment_methods table
SELECT 
    'PAYMENT_METHODS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'payment_methods'
ORDER BY ordinal_position;

-- Check the structure of the compliance_requirements table
SELECT 
    'COMPLIANCE_REQUIREMENTS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'compliance_requirements'
ORDER BY ordinal_position;

-- Check the structure of the customer_documents table
SELECT 
    'CUSTOMER_DOCUMENTS TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customer_documents'
ORDER BY ordinal_position;

-- Check the structure of the communication_templates table
SELECT 
    'COMMUNICATION_TEMPLATES TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'communication_templates'
ORDER BY ordinal_position;

-- Check the structure of the chemical_usage_log table
SELECT 
    'CHEMICAL_USAGE_LOG TABLE STRUCTURE' as table_info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'chemical_usage_log'
ORDER BY ordinal_position;

-- Check if there are any existing records in key tables
SELECT 
    'EXISTING DATA COUNT' as info,
    'accounts' as table_name,
    COUNT(*) as record_count
FROM public.accounts
UNION ALL
SELECT 
    'EXISTING DATA COUNT' as info,
    'users' as table_name,
    COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT 
    'EXISTING DATA COUNT' as info,
    'tenants' as table_name,
    COUNT(*) as record_count
FROM public.tenants
UNION ALL
SELECT 
    'EXISTING DATA COUNT' as info,
    'customer_profiles' as table_name,
    COUNT(*) as record_count
FROM public.customer_profiles
UNION ALL
SELECT 
    'EXISTING DATA COUNT' as info,
    'locations' as table_name,
    COUNT(*) as record_count
FROM public.locations;

-- Check for any foreign key relationships
SELECT 
    'FOREIGN KEY RELATIONSHIPS' as info,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;


