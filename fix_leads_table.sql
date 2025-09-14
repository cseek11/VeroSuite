-- Add missing columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS user_timezone TEXT,
ADD COLUMN IF NOT EXISTS user_timestamp TIMESTAMP WITH TIME ZONE;


