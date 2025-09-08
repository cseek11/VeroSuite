-- Fix foreign key relationships that were broken when we added new tables

-- Add foreign key constraint from work_orders to accounts
ALTER TABLE work_orders 
ADD CONSTRAINT fk_work_orders_account_id 
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;

-- Add foreign key constraint from work_orders to locations  
ALTER TABLE work_orders 
ADD CONSTRAINT fk_work_orders_location_id 
FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE;

-- Add foreign key constraint from jobs to accounts
ALTER TABLE jobs 
ADD CONSTRAINT fk_jobs_account_id 
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;

-- Add foreign key constraint from jobs to locations
ALTER TABLE jobs 
ADD CONSTRAINT fk_jobs_location_id 
FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE;

-- Add foreign key constraint from jobs to work_orders
ALTER TABLE jobs 
ADD CONSTRAINT fk_jobs_work_order_id 
FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE;