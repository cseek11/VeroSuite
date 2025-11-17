-- Create saved_layouts table for storing dashboard layout metadata
CREATE TABLE IF NOT EXISTS saved_layouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    storage_path TEXT NOT NULL, -- Path to layout file in storage bucket
    file_size BIGINT, -- Size of the layout file in bytes
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    is_public BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_layouts_user_id ON saved_layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_layouts_tenant_id ON saved_layouts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_saved_layouts_is_public ON saved_layouts(is_public);
CREATE INDEX IF NOT EXISTS idx_saved_layouts_created_at ON saved_layouts(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_layouts_updated_at ON saved_layouts(updated_at);

-- Create index for storage_path lookups
CREATE INDEX IF NOT EXISTS idx_saved_layouts_storage_path ON saved_layouts(storage_path);

-- Create GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_saved_layouts_tags ON saved_layouts USING GIN (tags);

-- Enable Row Level Security
ALTER TABLE saved_layouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own layouts and public layouts from their tenant
CREATE POLICY "Users can view own and public tenant layouts" ON saved_layouts
    FOR SELECT USING (
        user_id = auth.uid() OR 
        (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND is_public = true)
    );

-- Users can insert their own layouts
CREATE POLICY "Users can insert own layouts" ON saved_layouts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own layouts
CREATE POLICY "Users can update own layouts" ON saved_layouts
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own layouts
CREATE POLICY "Users can delete own layouts" ON saved_layouts
    FOR DELETE USING (user_id = auth.uid());

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_layouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_saved_layouts_updated_at
    BEFORE UPDATE ON saved_layouts
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_layouts_updated_at();

-- Create storage bucket for dashboard layouts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'dashboard-layouts',
    'dashboard-layouts',
    false, -- Private bucket
    10485760, -- 10MB limit per file
    ARRAY['application/json']
) ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies
-- Users can upload their own layout files
CREATE POLICY "Users can upload own layout files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'dashboard-layouts' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can view their own files and public files from their tenant
CREATE POLICY "Users can view own and public tenant layout files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'dashboard-layouts' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            -- Public files from same tenant (would need additional logic)
            false -- Placeholder for now, would need tenant verification
        )
    );

-- Users can update their own files
CREATE POLICY "Users can update own layout files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'dashboard-layouts' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can delete their own files
CREATE POLICY "Users can delete own layout files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'dashboard-layouts' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
