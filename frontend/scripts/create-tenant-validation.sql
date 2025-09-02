-- ============================================================================
-- TENANT VALIDATION FUNCTION
-- ============================================================================
-- Create a function to validate user tenant access against database records

-- Function to validate if a user has access to a specific tenant
CREATE OR REPLACE FUNCTION validate_user_tenant_access(
  user_email text,
  claimed_tenant_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tenant_id uuid;
  user_exists boolean;
BEGIN
  -- Check if user exists in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    RAISE EXCEPTION 'User not found: %', user_email;
  END IF;
  
  -- Get the actual tenant_id from user metadata
  SELECT 
    COALESCE(
      (raw_user_meta_data->>'tenant_id')::uuid,
      (raw_app_meta_data->>'tenant_id')::uuid
    )
  INTO user_tenant_id
  FROM auth.users 
  WHERE email = user_email;
  
  -- If no tenant_id in metadata, deny access
  IF user_tenant_id IS NULL THEN
    RAISE EXCEPTION 'No tenant_id found in user metadata for: %', user_email;
  END IF;
  
  -- Check if claimed tenant_id matches the one in metadata
  IF user_tenant_id != claimed_tenant_id THEN
    RAISE EXCEPTION 'Tenant access denied. User % claims tenant % but is assigned to %', 
      user_email, claimed_tenant_id, user_tenant_id;
  END IF;
  
  -- Check if tenant exists in tenants table
  IF NOT EXISTS(SELECT 1 FROM tenants WHERE id = user_tenant_id) THEN
    RAISE EXCEPTION 'Tenant not found: %', user_tenant_id;
  END IF;
  
  -- All checks passed
  RETURN true;
END;
$$;

-- Function to get user's valid tenant_id (for frontend use)
CREATE OR REPLACE FUNCTION get_user_tenant_id(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tenant_id uuid;
BEGIN
  -- Get the tenant_id from user metadata
  SELECT 
    COALESCE(
      (raw_user_meta_data->>'tenant_id')::uuid,
      (raw_app_meta_data->>'tenant_id')::uuid
    )
  INTO user_tenant_id
  FROM auth.users 
  WHERE email = user_email;
  
  -- Validate tenant exists
  IF user_tenant_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM tenants WHERE id = user_tenant_id) THEN
    RAISE EXCEPTION 'Tenant not found: %', user_tenant_id;
  END IF;
  
  RETURN user_tenant_id;
END;
$$;

-- Test the functions
-- SELECT validate_user_tenant_access('admin@veropestsolutions.com', '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid);
-- SELECT get_user_tenant_id('admin@veropestsolutions.com');
