-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    user_timezone TEXT,
    user_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to insert leads
CREATE POLICY "Service role can insert leads" ON public.leads
    FOR INSERT TO service_role
    WITH CHECK (true);

-- Create function to handle contact form submissions
CREATE OR REPLACE FUNCTION public.submit_contact_form(
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_company TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lead_id UUID;
BEGIN
    -- Insert the lead
    INSERT INTO public.leads (first_name, last_name, email, phone, company, message)
    VALUES (p_first_name, p_last_name, p_email, p_phone, p_company, p_message)
    RETURNING id INTO lead_id;
    
    -- Return success response
    RETURN json_build_object(
        'success', true,
        'lead_id', lead_id,
        'message', 'Lead submitted successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Return error response
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to submit lead'
        );
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.submit_contact_form TO service_role;
