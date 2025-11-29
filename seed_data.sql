-- Seed Data for TeleFlow Application
-- Run this after schema.sql and permissions.sql

-- Insert sample users (these will be linked to auth.users you create manually)
-- Note: You'll need to create auth users in Supabase Dashboard first, then update the IDs here

-- Sample Sites
INSERT INTO public.sites (id, name, lat, lng, status, tenant, power_type, battery_level, last_maintenance, lease_expires, address, health_score, compliance_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'North Tower Alpha', 40.7128, -74.0060, 'online', 'Verizon', 'Grid', 100, NOW() - INTERVAL '15 days', NOW() + INTERVAL '120 days', '123 Broadway, NY', 95, 'compliant'),
('550e8400-e29b-41d4-a716-446655440002', 'West Side Hub', 40.7580, -73.9855, 'maintenance', 'AT&T', 'Hybrid', 85, NOW() - INTERVAL '5 days', NOW() + INTERVAL '45 days', '456 7th Ave, NY', 72, 'pending'),
('550e8400-e29b-41d4-a716-446655440003', 'Brooklyn Relay', 40.6782, -73.9442, 'online', 'T-Mobile', 'Solar', 92, NOW() - INTERVAL '40 days', NOW() + INTERVAL '300 days', '789 Flatbush Ave, Brooklyn', 88, 'compliant'),
('550e8400-e29b-41d4-a716-446655440004', 'Queens Connector', 40.7282, -73.7949, 'offline', 'Verizon', 'Generator', 10, NOW() - INTERVAL '90 days', NOW() + INTERVAL '15 days', '101 Main St, Queens', 25, 'non-compliant'),
('550e8400-e29b-41d4-a716-446655440005', 'Bronx Station', 40.8448, -73.8648, 'online', 'Sprint', 'Grid', 98, NOW() - INTERVAL '10 days', NOW() + INTERVAL '180 days', '202 Grand Concourse, Bronx', 92, 'compliant')
ON CONFLICT (id) DO NOTHING;

-- Sample Tasks (using your super admin user ID - replace with actual ID)
-- Get your user ID from: SELECT id FROM public.users WHERE email = 'superadmin@teleflow.com';
DO $$
DECLARE
  super_admin_id UUID;
BEGIN
  SELECT id INTO super_admin_id FROM public.users WHERE email = 'superadmin@teleflow.com' LIMIT 1;
  
  IF super_admin_id IS NOT NULL THEN
    INSERT INTO public.tasks (id, title, description, status, assignee_id, reporter_id, priority, site_id, start_date, due_date, tags, estimated_hours, actual_hours) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '5G Antenna Upgrade', 'Replace legacy 4G antennas with new 5G MIMO units at North Tower Alpha', 'in_progress', super_admin_id, super_admin_id, 'high', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW() + INTERVAL '14 days', ARRAY['hardware', '5g', 'upgrade'], 40, 12),
    ('650e8400-e29b-41d4-a716-446655440002', 'Battery Replacement', 'Swap out aging lead-acid batteries for Li-ion at Queens Connector', 'todo', super_admin_id, super_admin_id, 'urgent', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW() + INTERVAL '2 days', ARRAY['maintenance', 'power', 'urgent'], 8, 0),
    ('650e8400-e29b-41d4-a716-446655440003', 'Lease Renewal Negotiation', 'Contact landlord regarding lease extension for West Side Hub', 'review', super_admin_id, super_admin_id, 'high', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '5 days', NOW() + INTERVAL '5 days', ARRAY['legal', 'lease'], 16, 14),
    ('650e8400-e29b-41d4-a716-446655440004', 'Generator Maintenance', 'Annual generator service and load test at West Side Hub', 'todo', super_admin_id, super_admin_id, 'medium', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW() + INTERVAL '30 days', ARRAY['maintenance', 'generator'], 12, 0),
    ('650e8400-e29b-41d4-a716-446655440005', 'Fiber Backhaul Install', 'Coordinate with ISP for new fiber line at West Side Hub', 'in_progress', super_admin_id, super_admin_id, 'high', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 days', NOW() + INTERVAL '7 days', ARRAY['network', 'fiber'], 24, 18),
    ('650e8400-e29b-41d4-a716-446655440006', 'Site Survey - Brooklyn', 'Conduct comprehensive site survey for new installation', 'completed', super_admin_id, super_admin_id, 'medium', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', ARRAY['survey', 'planning'], 16, 14),
    ('650e8400-e29b-41d4-a716-446655440007', 'Emergency Power Restoration', 'Restore power to Queens Connector immediately', 'blocked', super_admin_id, super_admin_id, 'urgent', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW() + INTERVAL '1 day', ARRAY['emergency', 'power'], 4, 2),
    ('650e8400-e29b-41d4-a716-446655440008', 'Compliance Audit', 'Complete FCC compliance audit for Bronx Station', 'todo', super_admin_id, super_admin_id, 'medium', '550e8400-e29b-41d4-a716-446655440005', NOW(), NOW() + INTERVAL '20 days', ARRAY['compliance', 'audit'], 8, 0)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Sample Subtasks
INSERT INTO public.subtasks (task_id, title, completed) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Order 5G MIMO antennas', true),
('650e8400-e29b-41d4-a716-446655440001', 'Schedule crane rental', true),
('650e8400-e29b-41d4-a716-446655440001', 'Coordinate with site owner', false),
('650e8400-e29b-41d4-a716-446655440001', 'Install new antennas', false),
('650e8400-e29b-41d4-a716-446655440001', 'Test signal strength', false),
('650e8400-e29b-41d4-a716-446655440006', 'RF measurements', true),
('650e8400-e29b-41d4-a716-446655440006', 'Structural assessment', true),
('650e8400-e29b-41d4-a716-446655440006', 'Generate report', true)
ON CONFLICT DO NOTHING;

-- Sample Workflow Templates
INSERT INTO public.workflow_templates (id, name, description, steps, created_by) 
SELECT 
  '750e8400-e29b-41d4-a716-446655440001',
  'Site Survey Workflow',
  'Standard workflow for conducting comprehensive site surveys',
  jsonb_build_object(
    'nodes', jsonb_build_array(
      jsonb_build_object('id', '1', 'type', 'start', 'data', jsonb_build_object('label', 'Start Survey'), 'position', jsonb_build_object('x', 250, 'y', 50)),
      jsonb_build_object('id', '2', 'type', 'task', 'data', jsonb_build_object('label', 'RF Measurements', 'config', jsonb_build_object('assigneeRole', 'tech')), 'position', jsonb_build_object('x', 250, 'y', 150)),
      jsonb_build_object('id', '3', 'type', 'task', 'data', jsonb_build_object('label', 'Structural Assessment'), 'position', jsonb_build_object('x', 250, 'y', 250)),
      jsonb_build_object('id', '4', 'type', 'approval', 'data', jsonb_build_object('label', 'Manager Approval'), 'position', jsonb_build_object('x', 250, 'y', 350)),
      jsonb_build_object('id', '5', 'type', 'end', 'data', jsonb_build_object('label', 'Survey Complete'), 'position', jsonb_build_object('x', 250, 'y', 450))
    ),
    'edges', jsonb_build_array(
      jsonb_build_object('id', 'e1-2', 'source', '1', 'target', '2', 'animated', true),
      jsonb_build_object('id', 'e2-3', 'source', '2', 'target', '3'),
      jsonb_build_object('id', 'e3-4', 'source', '3', 'target', '4'),
      jsonb_build_object('id', 'e4-5', 'source', '4', 'target', '5')
    )
  ),
  (SELECT id FROM public.users WHERE email = 'superadmin@teleflow.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.users WHERE email = 'superadmin@teleflow.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workflow_templates (id, name, description, steps, created_by)
SELECT 
  '750e8400-e29b-41d4-a716-446655440002',
  'Equipment Installation',
  'Standard workflow for equipment installation projects',
  jsonb_build_object(
    'nodes', jsonb_build_array(
      jsonb_build_object('id', '1', 'type', 'start', 'data', jsonb_build_object('label', 'Start Installation'), 'position', jsonb_build_object('x', 250, 'y', 50)),
      jsonb_build_object('id', '2', 'type', 'task', 'data', jsonb_build_object('label', 'Order Equipment'), 'position', jsonb_build_object('x', 250, 'y', 150)),
      jsonb_build_object('id', '3', 'type', 'delay', 'data', jsonb_build_object('label', 'Wait for Delivery'), 'position', jsonb_build_object('x', 250, 'y', 250)),
      jsonb_build_object('id', '4', 'type', 'task', 'data', jsonb_build_object('label', 'Install Equipment'), 'position', jsonb_build_object('x', 250, 'y', 350)),
      jsonb_build_object('id', '5', 'type', 'task', 'data', jsonb_build_object('label', 'Testing & Commissioning'), 'position', jsonb_build_object('x', 250, 'y', 450)),
      jsonb_build_object('id', '6', 'type', 'end', 'data', jsonb_build_object('label', 'Installation Complete'), 'position', jsonb_build_object('x', 250, 'y', 550))
    ),
    'edges', jsonb_build_array(
      jsonb_build_object('id', 'e1-2', 'source', '1', 'target', '2'),
      jsonb_build_object('id', 'e2-3', 'source', '2', 'target', '3'),
      jsonb_build_object('id', 'e3-4', 'source', '3', 'target', '4'),
      jsonb_build_object('id', 'e4-5', 'source', '4', 'target', '5'),
      jsonb_build_object('id', 'e5-6', 'source', '5', 'target', '6')
    )
  ),
  (SELECT id FROM public.users WHERE email = 'superadmin@teleflow.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.users WHERE email = 'superadmin@teleflow.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workflow_templates (id, name, description, steps, created_by)
SELECT 
  '750e8400-e29b-41d4-a716-446655440003',
  'Emergency Response',
  'Rapid response workflow for critical site failures',
  jsonb_build_object(
    'nodes', jsonb_build_array(
      jsonb_build_object('id', '1', 'type', 'start', 'data', jsonb_build_object('label', 'Emergency Alert'), 'position', jsonb_build_object('x', 250, 'y', 50)),
      jsonb_build_object('id', '2', 'type', 'notification', 'data', jsonb_build_object('label', 'Notify On-Call Team'), 'position', jsonb_build_object('x', 250, 'y', 150)),
      jsonb_build_object('id', '3', 'type', 'task', 'data', jsonb_build_object('label', 'Assess Situation'), 'position', jsonb_build_object('x', 250, 'y', 250)),
      jsonb_build_object('id', '4', 'type', 'condition', 'data', jsonb_build_object('label', 'Critical?'), 'position', jsonb_build_object('x', 250, 'y', 350)),
      jsonb_build_object('id', '5', 'type', 'task', 'data', jsonb_build_object('label', 'Dispatch Emergency Team'), 'position', jsonb_build_object('x', 100, 'y', 450)),
      jsonb_build_object('id', '6', 'type', 'task', 'data', jsonb_build_object('label', 'Schedule Maintenance'), 'position', jsonb_build_object('x', 400, 'y', 450)),
      jsonb_build_object('id', '7', 'type', 'end', 'data', jsonb_build_object('label', 'Resolved'), 'position', jsonb_build_object('x', 250, 'y', 550))
    ),
    'edges', jsonb_build_array(
      jsonb_build_object('id', 'e1-2', 'source', '1', 'target', '2'),
      jsonb_build_object('id', 'e2-3', 'source', '2', 'target', '3'),
      jsonb_build_object('id', 'e3-4', 'source', '3', 'target', '4'),
      jsonb_build_object('id', 'e4-5', 'source', '4', 'target', '5', 'label', 'Yes'),
      jsonb_build_object('id', 'e4-6', 'source', '4', 'target', '6', 'label', 'No'),
      jsonb_build_object('id', 'e5-7', 'source', '5', 'target', '7'),
      jsonb_build_object('id', 'e6-7', 'source', '6', 'target', '7')
    )
  ),
  (SELECT id FROM public.users WHERE email = 'superadmin@teleflow.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.users WHERE email = 'superadmin@teleflow.com')
ON CONFLICT (id) DO NOTHING;

-- Sample Documents
DO $$
DECLARE
  super_admin_id UUID;
BEGIN
  SELECT id INTO super_admin_id FROM public.users WHERE email = 'superadmin@teleflow.com' LIMIT 1;
  
  IF super_admin_id IS NOT NULL THEN
    INSERT INTO public.documents (id, name, type, category, site_id, task_id, uploaded_by, url, size, version, tags) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', 'Site S001 - Tower Design.dwg', 'autocad', 'design', '550e8400-e29b-41d4-a716-446655440001', NULL, super_admin_id, '/mock/documents/tower-design.dwg', '2.4 MB', 2, ARRAY['design', 'structural']),
    ('850e8400-e29b-41d4-a716-446655440002', 'Lease Agreement - West Side Hub.pdf', 'pdf', 'legal', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', super_admin_id, '/mock/documents/lease-west.pdf', '856 KB', 1, ARRAY['legal', 'lease']),
    ('850e8400-e29b-41d4-a716-446655440003', 'FCC Compliance Certificate.pdf', 'pdf', 'compliance', '550e8400-e29b-41d4-a716-446655440001', NULL, super_admin_id, '/mock/documents/fcc-cert.pdf', '124 KB', 1, ARRAY['compliance', 'fcc']),
    ('850e8400-e29b-41d4-a716-446655440004', 'Site Photo - Brooklyn North View.jpg', 'image', 'photo', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006', super_admin_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', '3.2 MB', 1, ARRAY['photo', 'site-survey']),
    ('850e8400-e29b-41d4-a716-446655440005', 'Installation Manual - 5G MIMO.pdf', 'pdf', 'design', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', super_admin_id, '/mock/documents/5g-manual.pdf', '5.1 MB', 1, ARRAY['manual', 'installation'])
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created: 5 sites, 8 tasks, 8 subtasks, 3 workflow templates, 5 documents';
END $$;
