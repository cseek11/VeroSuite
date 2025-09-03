-- Enable UUID extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension for additional crypto functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Test UUID generation
SELECT gen_random_uuid() as test_uuid;

-- Check if the customer_notes table is working now
SELECT * FROM customer_notes;








