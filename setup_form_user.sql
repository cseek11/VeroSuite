-- Create a dedicated user for form submissions
-- This user will have limited permissions only for inserting leads

-- First, create the leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create a function to get the form user ID
CREATE OR REPLACE FUNCTION get_form_user_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT id FROM auth.users WHERE email = 'form-submissions@verofield.com' LIMIT 1;
$$;

-- Create the form submission user (check if it exists first)
DO $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'form-submissions@verofield.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create the user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'form-submissions@verofield.com',
            crypt('form-submit-password-2024', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;
END $$;

-- Create policies for the leads table
DROP POLICY IF EXISTS "Form user can insert leads" ON public.leads;
CREATE POLICY "Form user can insert leads" ON public.leads
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = get_form_user_id());

-- Also create a policy for service role (backup)
DROP POLICY IF EXISTS "Service role can insert leads" ON public.leads;
CREATE POLICY "Service role can insert leads" ON public.leads
    FOR INSERT 
    TO service_role
    WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON public.leads TO authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;