-- Check the actual structure of existing tables
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;


