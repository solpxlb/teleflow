-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'pm', 'team_lead', 'member', 'tech')),
  avatar TEXT,
  skills TEXT[],
  certifications TEXT[],
  availability TEXT CHECK (availability IN ('available', 'busy', 'offline')) DEFAULT 'offline',
  hourly_rate NUMERIC,
  workload INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE public.sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('online', 'maintenance', 'offline')),
  tenant TEXT,
  power_type TEXT CHECK (power_type IN ('Grid', 'Solar', 'Generator', 'Hybrid')),
  battery_level INTEGER,
  last_maintenance TIMESTAMPTZ,
  lease_expires TIMESTAMPTZ,
  address TEXT,
  health_score INTEGER,
  compliance_status TEXT CHECK (compliance_status IN ('compliant', 'pending', 'non-compliant')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'blocked')) DEFAULT 'todo',
  assignee_id UUID REFERENCES public.users(id),
  reporter_id UUID REFERENCES public.users(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  site_id UUID REFERENCES public.sites(id),
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  tags TEXT[],
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subtasks table
CREATE TABLE public.subtasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('autocad', 'pdf', 'image', 'contract', 'permit', 'report')),
  category TEXT CHECK (category IN ('design', 'legal', 'compliance', 'photo', 'report')),
  site_id UUID REFERENCES public.sites(id),
  task_id UUID REFERENCES public.tasks(id),
  uploaded_by UUID REFERENCES public.users(id),
  url TEXT NOT NULL,
  size TEXT,
  version INTEGER DEFAULT 1,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Templates table
CREATE TABLE public.workflow_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL, -- Storing React Flow nodes/edges structure
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Executions table
CREATE TABLE public.workflow_executions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES public.workflow_templates(id),
  status TEXT CHECK (status IN ('running', 'completed', 'failed', 'paused')) DEFAULT 'running',
  current_step_id TEXT,
  variables JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  triggered_by UUID REFERENCES public.users(id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Open access for development (WARNING: Secure this in production)
CREATE POLICY "Allow all access for authenticated users" ON public.users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.sites FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.subtasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.workflow_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access for authenticated users" ON public.workflow_executions FOR ALL USING (auth.role() = 'authenticated');
