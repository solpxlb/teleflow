-- Permissions and Role-Based Access Control Schema

-- Permissions table: Defines all available system features/permissions
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('dashboard', 'sites', 'tasks', 'workflows', 'documents', 'team', 'analytics', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role permissions: Maps permissions to roles
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'pm', 'team_lead', 'member', 'tech')),
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- User custom permissions: Override permissions for specific users
CREATE TABLE IF NOT EXISTS public.user_custom_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted BOOLEAN DEFAULT TRUE, -- true = grant, false = revoke
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all access for authenticated users" ON public.permissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.role_permissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.user_custom_permissions FOR ALL USING (auth.role() = 'authenticated');

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
  -- Dashboard
  ('view_dashboard', 'View main dashboard', 'dashboard'),
  ('view_analytics', 'View analytics and reports', 'analytics'),
  
  -- Sites
  ('view_sites', 'View sites list', 'sites'),
  ('create_sites', 'Create new sites', 'sites'),
  ('edit_sites', 'Edit existing sites', 'sites'),
  ('delete_sites', 'Delete sites', 'sites'),
  
  -- Tasks
  ('view_tasks', 'View tasks', 'tasks'),
  ('create_tasks', 'Create new tasks', 'tasks'),
  ('edit_tasks', 'Edit tasks', 'tasks'),
  ('delete_tasks', 'Delete tasks', 'tasks'),
  ('assign_tasks', 'Assign tasks to users', 'tasks'),
  
  -- Workflows
  ('view_workflows', 'View workflows', 'workflows'),
  ('create_workflows', 'Create workflow templates', 'workflows'),
  ('edit_workflows', 'Edit workflow templates', 'workflows'),
  ('delete_workflows', 'Delete workflow templates', 'workflows'),
  ('execute_workflows', 'Execute workflows', 'workflows'),
  
  -- Documents
  ('view_documents', 'View documents', 'documents'),
  ('upload_documents', 'Upload documents', 'documents'),
  ('edit_documents', 'Edit document metadata', 'documents'),
  ('delete_documents', 'Delete documents', 'documents'),
  
  -- Team
  ('view_team', 'View team members', 'team'),
  ('manage_team', 'Manage team members', 'team'),
  
  -- Admin
  ('manage_users', 'Create and manage users', 'admin'),
  ('manage_permissions', 'Manage role permissions', 'admin'),
  ('view_system_settings', 'View system settings', 'admin'),
  ('edit_system_settings', 'Edit system settings', 'admin')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
-- Super Admin: Full access
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'super_admin', id FROM public.permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Admin: All except system settings
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions 
WHERE name NOT IN ('edit_system_settings', 'manage_permissions')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Project Manager: Task and workflow management
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'pm', id FROM public.permissions 
WHERE category IN ('dashboard', 'sites', 'tasks', 'workflows', 'documents', 'team', 'analytics')
  AND name NOT IN ('delete_sites', 'delete_workflows', 'manage_team')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Team Lead: View and edit tasks, limited site access
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'team_lead', id FROM public.permissions 
WHERE name IN ('view_dashboard', 'view_analytics', 'view_sites', 'view_tasks', 'create_tasks', 
               'edit_tasks', 'assign_tasks', 'view_workflows', 'execute_workflows', 
               'view_documents', 'upload_documents', 'view_team')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Member: Basic task and document access
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'member', id FROM public.permissions 
WHERE name IN ('view_dashboard', 'view_sites', 'view_tasks', 'edit_tasks', 
               'view_workflows', 'view_documents', 'upload_documents', 'view_team')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Technician: Field work focused
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'tech', id FROM public.permissions 
WHERE name IN ('view_dashboard', 'view_sites', 'view_tasks', 'edit_tasks', 
               'view_documents', 'upload_documents')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Create super admin user
-- Note: You'll need to set the password via Supabase dashboard or Auth API
-- This creates the user profile that links to auth.users
DO $$
DECLARE
  super_admin_id UUID;
BEGIN
  -- Check if super admin already exists in auth.users
  SELECT id INTO super_admin_id FROM auth.users WHERE email = 'superadmin@teleflow.com';
  
  -- If not exists, we'll create a placeholder
  -- The actual auth user must be created via Supabase Auth
  IF super_admin_id IS NULL THEN
    -- Generate a UUID for the super admin
    super_admin_id := uuid_generate_v4();
    
    -- Insert into public.users (this will be linked when auth user is created)
    INSERT INTO public.users (id, email, name, role, avatar, created_at, updated_at)
    VALUES (
      super_admin_id,
      'superadmin@teleflow.com',
      'Super Admin',
      'super_admin',
      'https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff',
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS TABLE (permission_name TEXT) AS $$
BEGIN
  RETURN QUERY
  WITH user_role AS (
    SELECT role FROM public.users WHERE id = user_uuid
  ),
  role_perms AS (
    SELECT p.name
    FROM public.permissions p
    JOIN public.role_permissions rp ON p.id = rp.permission_id
    JOIN user_role ur ON rp.role = ur.role
  ),
  custom_perms AS (
    SELECT p.name, ucp.granted
    FROM public.permissions p
    JOIN public.user_custom_permissions ucp ON p.id = ucp.permission_id
    WHERE ucp.user_id = user_uuid
  )
  SELECT rp.name FROM role_perms rp
  WHERE NOT EXISTS (
    SELECT 1 FROM custom_perms cp 
    WHERE cp.name = rp.name AND cp.granted = FALSE
  )
  UNION
  SELECT cp.name FROM custom_perms cp WHERE cp.granted = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
