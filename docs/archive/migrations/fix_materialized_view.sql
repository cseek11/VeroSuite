-- Fix the materialized view dependency issue
-- The search_optimized_accounts materialized view depends on columns we're modifying

-- First, let's drop the materialized view temporarily
DROP MATERIALIZED VIEW IF EXISTS search_optimized_accounts CASCADE;

-- Now we can proceed with schema changes
-- The materialized view can be recreated after the schema is updated


