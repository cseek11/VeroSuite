-- Fix missing columns in search_logs table
-- Run this in your Supabase SQL Editor

-- Add query_text column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'query_text') THEN
        ALTER TABLE search_logs ADD COLUMN query_text TEXT;
        RAISE NOTICE 'Added query_text column to search_logs table';
    ELSE
        RAISE NOTICE 'query_text column already exists';
    END IF;
END $$;

-- Add query_type column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'query_type') THEN
        ALTER TABLE search_logs ADD COLUMN query_type VARCHAR(50) NOT NULL DEFAULT 'hybrid';
        RAISE NOTICE 'Added query_type column to search_logs table';
    ELSE
        RAISE NOTICE 'query_type column already exists';
    END IF;
END $$;

-- Add search_mode column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'search_mode') THEN
        ALTER TABLE search_logs ADD COLUMN search_mode VARCHAR(50) NOT NULL DEFAULT 'hybrid';
        RAISE NOTICE 'Added search_mode column to search_logs table';
    ELSE
        RAISE NOTICE 'search_mode column already exists';
    END IF;
END $$;

-- Add results_count column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'results_count') THEN
        ALTER TABLE search_logs ADD COLUMN results_count INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added results_count column to search_logs table';
    ELSE
        RAISE NOTICE 'results_count column already exists';
    END IF;
END $$;

-- Add execution_time_ms column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'execution_time_ms') THEN
        ALTER TABLE search_logs ADD COLUMN execution_time_ms INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added execution_time_ms column to search_logs table';
    ELSE
        RAISE NOTICE 'execution_time_ms column already exists';
    END IF;
END $$;

-- Add session_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'session_id') THEN
        ALTER TABLE search_logs ADD COLUMN session_id VARCHAR(255);
        RAISE NOTICE 'Added session_id column to search_logs table';
    ELSE
        RAISE NOTICE 'session_id column already exists';
    END IF;
END $$;

-- Add clicked_result_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'clicked_result_id') THEN
        ALTER TABLE search_logs ADD COLUMN clicked_result_id VARCHAR(255);
        RAISE NOTICE 'Added clicked_result_id column to search_logs table';
    ELSE
        RAISE NOTICE 'clicked_result_id column already exists';
    END IF;
END $$;

-- Add clicked_result_position column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'clicked_result_position') THEN
        ALTER TABLE search_logs ADD COLUMN clicked_result_position INTEGER;
        RAISE NOTICE 'Added clicked_result_position column to search_logs table';
    ELSE
        RAISE NOTICE 'clicked_result_position column already exists';
    END IF;
END $$;

-- Add time_to_click_ms column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'time_to_click_ms') THEN
        ALTER TABLE search_logs ADD COLUMN time_to_click_ms INTEGER;
        RAISE NOTICE 'Added time_to_click_ms column to search_logs table';
    ELSE
        RAISE NOTICE 'time_to_click_ms column already exists';
    END IF;
END $$;

-- Add cache_hit column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'cache_hit') THEN
        ALTER TABLE search_logs ADD COLUMN cache_hit BOOLEAN NOT NULL DEFAULT FALSE;
        RAISE NOTICE 'Added cache_hit column to search_logs table';
    ELSE
        RAISE NOTICE 'cache_hit column already exists';
    END IF;
END $$;

-- Add search_successful column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'search_successful') THEN
        ALTER TABLE search_logs ADD COLUMN search_successful BOOLEAN NOT NULL DEFAULT TRUE;
        RAISE NOTICE 'Added search_successful column to search_logs table';
    ELSE
        RAISE NOTICE 'search_successful column already exists';
    END IF;
END $$;

-- Add error_message column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'error_message') THEN
        ALTER TABLE search_logs ADD COLUMN error_message TEXT;
        RAISE NOTICE 'Added error_message column to search_logs table';
    ELSE
        RAISE NOTICE 'error_message column already exists';
    END IF;
END $$;

-- Add user_agent column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'user_agent') THEN
        ALTER TABLE search_logs ADD COLUMN user_agent TEXT;
        RAISE NOTICE 'Added user_agent column to search_logs table';
    ELSE
        RAISE NOTICE 'user_agent column already exists';
    END IF;
END $$;

-- Add ip_address column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'ip_address') THEN
        ALTER TABLE search_logs ADD COLUMN ip_address VARCHAR(45);
        RAISE NOTICE 'Added ip_address column to search_logs table';
    ELSE
        RAISE NOTICE 'ip_address column already exists';
    END IF;
END $$;

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
ORDER BY ordinal_position;
