# Database Setup Guide

## Issues Found

The 400 error is likely due to one of these issues:

### 1. Missing RLS Policies
Supabase uses Row Level Security (RLS) by default. You need to create policies for the `jobs` table.

### 2. Missing Tenant Context
The user doesn't have a `tenant_id` in their metadata or the users table.

### 3. Missing Data
There might be no jobs in the database for today's date.

## Quick Fixes

### Option 1: Disable RLS (for testing only)
```sql
-- Run this in your Supabase SQL editor
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
```

### Option 2: Create Basic RLS Policy
```sql
-- Run this in your Supabase SQL editor
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read jobs (for testing)
CREATE POLICY "Allow authenticated users to read jobs" ON jobs
FOR SELECT USING (auth.role() = 'authenticated');
```

### Option 3: Create Tenant-Based RLS Policy
```sql
-- Run this in your Supabase SQL editor
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow users to read jobs from their tenant
CREATE POLICY "Users can read jobs from their tenant" ON jobs
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);
```

## Add Test Data

```sql
-- Insert a test tenant
INSERT INTO tenants (id, name, status) 
VALUES ('test-tenant-1', 'Test Company', 'active');

-- Insert a test user
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name)
VALUES (
  '75a55fa0-0786-401f-bbf8-f104c7989aa6', -- Use your actual user ID
  'test-tenant-1',
  'dispatcher@acepest.com',
  'dummy-hash',
  'Test',
  'User'
);

-- Insert a test account
INSERT INTO accounts (id, tenant_id, name, account_type)
VALUES ('test-account-1', 'test-tenant-1', 'Test Account', 'commercial');

-- Insert a test location
INSERT INTO locations (id, tenant_id, account_id, name, address_line1, city, state)
VALUES ('test-location-1', 'test-tenant-1', 'test-account-1', 'Test Location', '123 Test St', 'Test City', 'TX');

-- Insert a test work order
INSERT INTO work_orders (id, tenant_id, account_id, location_id, service_type, description, service_price)
VALUES ('test-work-order-1', 'test-tenant-1', 'test-account-1', 'test-location-1', 'Pest Control', 'Test service', 100.00);

-- Insert a test job for today
INSERT INTO jobs (id, tenant_id, work_order_id, account_id, location_id, status, scheduled_date)
VALUES (
  'test-job-1',
  'test-tenant-1',
  'test-work-order-1',
  'test-account-1',
  'test-location-1',
  'scheduled',
  CURRENT_DATE
);
```

## Check Your Setup

1. Go to your Supabase dashboard
2. Check the Authentication > Users section
3. Check the Table Editor > jobs table
4. Check the SQL Editor to run the setup queries above

## Next Steps

1. Run the RLS policy setup (Option 2 or 3)
2. Add test data using the SQL above
3. Refresh your frontend
4. Check the browser console for the new debug messages


