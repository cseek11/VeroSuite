-- Create leads table for contact form submissions
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

-- Create policy for service role to insert leads
CREATE POLICY "Service role can insert leads" ON public.leads
    FOR INSERT TO service_role
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.leads TO authenticated;
