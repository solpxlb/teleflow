import { addDays, subDays } from 'date-fns';

export type Role = 'super_admin' | 'admin' | 'pm' | 'team_lead' | 'member' | 'tech';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  email: string;
  skills?: string[];
  certifications?: string[];
  availability?: 'available' | 'busy' | 'offline';
  hourlyRate?: number;
  workload?: number; // 0-100
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  attachments?: Attachment[];
  parentId?: string; // For threaded replies
  reactions?: { emoji: string; userIds: string[] }[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'planning' | 'permitting' | 'construction' | 'integration' | 'live';
  assigneeId: string;
  reporterId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  siteId?: string;
  storyId?: string;
  startDate?: string;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  dependencies: string[];
  attachments: Attachment[];
  comments: Comment[];
  estimatedHours?: number;
  actualHours?: number;
  blockedReason?: string;
  watchers?: string[];
  customFields?: Record<string, any>;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  milestones: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'faulty';
}

export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'online' | 'maintenance' | 'offline';
  tenant: string;
  powerType: 'Grid' | 'Solar' | 'Generator' | 'Hybrid';
  batteryLevel: number;
  lastMaintenance: string;
  leaseExpires: string;
  address: string;
  equipmentList?: Equipment[];
  healthScore?: number;
  photos?: string[];
  complianceStatus?: 'compliant' | 'pending' | 'non-compliant';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read?: boolean;
  actionUrl?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'task' | 'approval' | 'condition' | 'parallel' | 'delay' | 'notification' | 'document' | 'autocad' | 'end';
  data: {
    label: string;
    config?: Record<string, any>;
  };
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'installation' | 'survey' | 'emergency' | 'lease' | 'rollout' | 'custom';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface WorkflowExecution {
  id: string;
  templateId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: string;
  endTime?: string;
  currentNode?: string;
  variables: Record<string, any>;
  triggeredBy: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'crane' | 'generator' | 'test_equipment' | 'vehicle' | 'tools';
  availability: 'available' | 'in_use' | 'maintenance';
  assignedTo?: string;
  location?: string;
  nextAvailable?: string;
}

export interface Vendor {
  id: string;
  name: string;
  services: string[];
  rating: number; // 0-5
  contacts: { name: string; phone: string; email: string }[];
  contractStart?: string;
  contractEnd?: string;
  performanceScore?: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'autocad' | 'pdf' | 'image' | 'contract' | 'permit' | 'report';
  category: 'design' | 'legal' | 'compliance' | 'photo' | 'report';
  siteId?: string;
  taskId?: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  url: string;
  size: string;
  tags?: string[];
}

export interface AutoCADFile extends Document {
  layers?: string[];
  dimensions?: { width: number; height: number; unit: string };
  aiInsights?: AIInsight[];
}

export interface AIInsight {
  id: string;
  type: 'structural' | 'cost' | 'compliance' | 'optimization' | 'risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  confidence: number; // 0-100
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  notes?: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  entityType: 'task' | 'site' | 'story';
  options?: string[];
  required: boolean;
}

export interface ActivityLog {
  id: string;
  entityType: 'task' | 'site' | 'story' | 'document' | 'workflow';
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'commented' | 'assigned' | 'completed' | 'uploaded';
  userId: string;
  timestamp: string;
  details: string;
  changes?: Record<string, { old: any; new: any }>;
}

// Mock Data
export const USERS: User[] = [
  { id: 'u0', name: 'Sarah Super', role: 'super_admin', avatar: 'https://i.pravatar.cc/150?u=u0', email: 'sarah@teleflow.com', skills: ['Project Management', 'Strategy', 'Leadership'], certifications: ['PMP', 'ITIL'], availability: 'available', hourlyRate: 150, workload: 45 },
  { id: 'u1', name: 'Alice Admin', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=u1', email: 'alice@teleflow.com', skills: ['System Administration', 'Network Design'], certifications: ['CCNA', 'CompTIA'], availability: 'available', hourlyRate: 120, workload: 60 },
  { id: 'u2', name: 'Bob Manager', role: 'pm', avatar: 'https://i.pravatar.cc/150?u=u2', email: 'bob@teleflow.com', skills: ['Project Management', 'Budgeting', 'Stakeholder Management'], certifications: ['PMP'], availability: 'busy', hourlyRate: 130, workload: 85 },
  { id: 'u3', name: 'Charlie Tech', role: 'tech', avatar: 'https://i.pravatar.cc/150?u=u3', email: 'charlie@teleflow.com', skills: ['RF Engineering', 'Equipment Installation', 'Troubleshooting'], certifications: ['CWNA', 'Tower Climbing'], availability: 'available', hourlyRate: 90, workload: 40 },
  { id: 'u4', name: 'David Lead', role: 'team_lead', avatar: 'https://i.pravatar.cc/150?u=u4', email: 'david@teleflow.com', skills: ['Team Leadership', 'Technical Planning', '5G Technology'], certifications: ['CCNP'], availability: 'available', hourlyRate: 110, workload: 70 },
  { id: 'u5', name: 'Eve Member', role: 'member', avatar: 'https://i.pravatar.cc/150?u=u5', email: 'eve@teleflow.com', skills: ['Documentation', 'Quality Assurance', 'Testing'], certifications: ['ISTQB'], availability: 'offline', hourlyRate: 80, workload: 30 },
];

export const STORIES: Story[] = [
  { id: 'S1', title: 'Q4 Network Expansion', description: 'Expand 5G coverage in North Region', status: 'in_progress', priority: 'high', milestones: ['Phase 1', 'Phase 2'] },
  { id: 'S2', title: 'Legacy Equipment Decommission', description: 'Remove old 3G hardware', status: 'todo', priority: 'medium', milestones: ['Audit', 'Removal'] },
  { id: 'S3', title: 'Emergency Response System Upgrade', description: 'Implement new emergency communication protocols', status: 'in_progress', priority: 'high', milestones: ['Planning', 'Implementation', 'Testing'] },
];

export const SITES: Site[] = [
  { 
    id: 'S001', 
    name: 'North Tower Alpha', 
    lat: 40.7128, 
    lng: -74.0060, 
    status: 'online', 
    tenant: 'Verizon', 
    powerType: 'Grid', 
    batteryLevel: 100, 
    lastMaintenance: '2023-10-15', 
    leaseExpires: addDays(new Date(), 120).toISOString(), 
    address: '123 Broadway, NY',
    healthScore: 95,
    complianceStatus: 'compliant',
    equipmentList: [
      { id: 'eq1', name: '5G MIMO Antenna', type: 'Antenna', serialNumber: 'ANT-5G-001', status: 'operational' },
      { id: 'eq2', name: 'Power Amplifier', type: 'RF Equipment', serialNumber: 'PA-2023-045', status: 'operational' },
    ]
  },
  { 
    id: 'S002', 
    name: 'West Side Hub', 
    lat: 40.7580, 
    lng: -73.9855, 
    status: 'maintenance', 
    tenant: 'AT&T', 
    powerType: 'Hybrid', 
    batteryLevel: 85, 
    lastMaintenance: '2023-11-01', 
    leaseExpires: addDays(new Date(), 45).toISOString(), 
    address: '456 7th Ave, NY',
    healthScore: 72,
    complianceStatus: 'pending',
    equipmentList: [
      { id: 'eq3', name: 'Backup Generator', type: 'Power', serialNumber: 'GEN-2022-112', status: 'maintenance' },
    ]
  },
  { 
    id: 'S003', 
    name: 'Brooklyn Relay', 
    lat: 40.6782, 
    lng: -73.9442, 
    status: 'online', 
    tenant: 'T-Mobile', 
    powerType: 'Solar', 
    batteryLevel: 92, 
    lastMaintenance: '2023-09-20', 
    leaseExpires: addDays(new Date(), 300).toISOString(), 
    address: '789 Flatbush Ave, Brooklyn',
    healthScore: 88,
    complianceStatus: 'compliant',
  },
  { 
    id: 'S004', 
    name: 'Queens Connector', 
    lat: 40.7282, 
    lng: -73.7949, 
    status: 'offline', 
    tenant: 'Verizon', 
    powerType: 'Generator', 
    batteryLevel: 10, 
    lastMaintenance: '2023-08-05', 
    leaseExpires: addDays(new Date(), 15).toISOString(), 
    address: '101 Main St, Queens',
    healthScore: 25,
    complianceStatus: 'non-compliant',
  },
  { 
    id: 'S005', 
    name: 'Bronx Station', 
    lat: 40.8448, 
    lng: -73.8648, 
    status: 'online', 
    tenant: 'Sprint', 
    powerType: 'Grid', 
    batteryLevel: 98, 
    lastMaintenance: '2023-10-25', 
    leaseExpires: addDays(new Date(), 180).toISOString(), 
    address: '202 Grand Concourse, Bronx',
    healthScore: 92,
    complianceStatus: 'compliant',
  },
];

export const TASKS: Task[] = [
  {
    id: 'T001',
    title: '5G Antenna Upgrade',
    description: 'Replace legacy 4G antennas with new 5G MIMO units.',
    status: 'planning',
    assigneeId: 'u2',
    reporterId: 'u1',
    priority: 'high',
    siteId: 'S001',
    storyId: 'S1',
    startDate: new Date().toISOString(),
    dueDate: addDays(new Date(), 14).toISOString(),
    tags: ['hardware', '5g'],
    subtasks: [
      { id: 'st1', title: 'Order parts', completed: true },
      { id: 'st2', title: 'Schedule crane', completed: false }
    ],
    dependencies: [],
    attachments: [],
    comments: [
      { id: 'c1', userId: 'u1', text: 'Parts ordered, ETA 2 days.', timestamp: subDays(new Date(), 1).toISOString() }
    ],
    estimatedHours: 40,
    actualHours: 12,
    watchers: ['u0', 'u4'],
  },
  {
    id: 'T002',
    title: 'Battery Replacement',
    description: 'Swap out aging lead-acid batteries for Li-ion.',
    status: 'construction',
    assigneeId: 'u3',
    reporterId: 'u2',
    priority: 'medium',
    siteId: 'S004',
    dueDate: addDays(new Date(), 2).toISOString(),
    tags: ['maintenance', 'power'],
    subtasks: [],
    dependencies: [],
    attachments: [],
    comments: [],
    estimatedHours: 8,
    actualHours: 6,
  },
  {
    id: 'T003',
    title: 'Lease Renewal Negotiation',
    description: 'Contact landlord regarding lease extension.',
    status: 'permitting',
    assigneeId: 'u2',
    reporterId: 'u0',
    priority: 'high',
    siteId: 'S002',
    dueDate: addDays(new Date(), 5).toISOString(),
    tags: ['legal'],
    subtasks: [],
    dependencies: [],
    attachments: [],
    comments: [],
    estimatedHours: 16,
  },
  {
    id: 'T004',
    title: 'Generator Maintenance',
    description: 'Annual generator service and load test.',
    status: 'planning',
    assigneeId: 'u3',
    reporterId: 'u2',
    priority: 'low',
    siteId: 'S002',
    dueDate: addDays(new Date(), 30).toISOString(),
    tags: ['maintenance'],
    subtasks: [],
    dependencies: [],
    attachments: [],
    comments: [],
    estimatedHours: 12,
  },
  {
    id: 'T005',
    title: 'Fiber Backhaul Install',
    description: 'Coordinate with ISP for new fiber line.',
    status: 'integration',
    assigneeId: 'u3',
    reporterId: 'u4',
    priority: 'high',
    siteId: 'S002',
    dueDate: addDays(new Date(), 7).toISOString(),
    tags: ['network'],
    subtasks: [],
    dependencies: ['T001'],
    attachments: [],
    comments: [],
    estimatedHours: 24,
    actualHours: 18,
  },
  {
    id: 'T006',
    title: 'Site Survey - Brooklyn',
    description: 'Conduct comprehensive site survey for new installation.',
    status: 'completed',
    assigneeId: 'u4',
    reporterId: 'u1',
    priority: 'medium',
    siteId: 'S003',
    storyId: 'S1',
    dueDate: subDays(new Date(), 5).toISOString(),
    tags: ['survey', 'planning'],
    subtasks: [
      { id: 'st3', title: 'RF measurements', completed: true },
      { id: 'st4', title: 'Structural assessment', completed: true },
      { id: 'st5', title: 'Report generation', completed: true },
    ],
    dependencies: [],
    attachments: [],
    comments: [],
    estimatedHours: 16,
    actualHours: 14,
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Site S004 Offline', message: 'Power failure detected at Queens Connector.', timestamp: subDays(new Date(), 0).toISOString(), type: 'error', read: false, actionUrl: '/sites' },
  { id: 'n2', title: 'Lease Expiring', message: 'Lease for S002 expires in 45 days.', timestamp: subDays(new Date(), 1).toISOString(), type: 'warning', read: false, actionUrl: '/sites' },
  { id: 'n3', title: 'Maintenance Complete', message: 'Routine maintenance finished at S001.', timestamp: subDays(new Date(), 2).toISOString(), type: 'success', read: true },
  { id: 'n4', title: 'New Task Assigned', message: 'You have been assigned to "5G Antenna Upgrade".', timestamp: subDays(new Date(), 3).toISOString(), type: 'info', read: true },
  { id: 'n5', title: 'AutoCAD Review Required', message: 'New design uploaded for Site S001 needs approval.', timestamp: subDays(new Date(), 0.5).toISOString(), type: 'info', read: false, actionUrl: '/documents' },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'wt1',
    name: 'Site Survey Workflow',
    description: 'Standard workflow for conducting site surveys',
    category: 'survey',
    isPublic: true,
    createdBy: 'u1',
    createdAt: subDays(new Date(), 30).toISOString(),
    nodes: [
      { id: '1', type: 'start', data: { label: 'Start Survey' }, position: { x: 250, y: 50 } },
      { id: '2', type: 'task', data: { label: 'RF Measurements', config: { assigneeRole: 'tech' } }, position: { x: 250, y: 150 } },
      { id: '3', type: 'task', data: { label: 'Structural Assessment' }, position: { x: 250, y: 250 } },
      { id: '4', type: 'approval', data: { label: 'Manager Approval' }, position: { x: 250, y: 350 } },
      { id: '5', type: 'end', data: { label: 'Survey Complete' }, position: { x: 250, y: 450 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ],
  },
  {
    id: 'wt2',
    name: 'Equipment Installation',
    description: 'Standard workflow for equipment installation projects',
    category: 'installation',
    isPublic: true,
    createdBy: 'u1',
    createdAt: subDays(new Date(), 60).toISOString(),
    nodes: [
      { id: '1', type: 'start', data: { label: 'Start Installation' }, position: { x: 250, y: 50 } },
      { id: '2', type: 'task', data: { label: 'Order Equipment' }, position: { x: 250, y: 150 } },
      { id: '3', type: 'delay', data: { label: 'Wait for Delivery' }, position: { x: 250, y: 250 } },
      { id: '4', type: 'task', data: { label: 'Install Equipment' }, position: { x: 250, y: 350 } },
      { id: '5', type: 'task', data: { label: 'Testing & Commissioning' }, position: { x: 250, y: 450 } },
      { id: '6', type: 'end', data: { label: 'Installation Complete' }, position: { x: 250, y: 550 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
    ],
  },
  {
    id: 'wt3',
    name: 'AutoCAD Design Review',
    description: 'Workflow for reviewing and approving AutoCAD designs',
    category: 'custom',
    isPublic: true,
    createdBy: 'u0',
    createdAt: subDays(new Date(), 15).toISOString(),
    nodes: [
      { id: '1', type: 'start', data: { label: 'Design Uploaded' }, position: { x: 250, y: 50 } },
      { id: '2', type: 'autocad', data: { label: 'AI Analysis' }, position: { x: 250, y: 150 } },
      { id: '3', type: 'condition', data: { label: 'Issues Found?' }, position: { x: 250, y: 250 } },
      { id: '4', type: 'task', data: { label: 'Revise Design' }, position: { x: 100, y: 350 } },
      { id: '5', type: 'approval', data: { label: 'Engineering Approval' }, position: { x: 400, y: 350 } },
      { id: '6', type: 'end', data: { label: 'Approved' }, position: { x: 400, y: 450 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
      { id: 'e3-5', source: '3', target: '5', label: 'No' },
      { id: 'e4-2', source: '4', target: '2' },
      { id: 'e5-6', source: '5', target: '6' },
    ],
  },
];

export const RESOURCES: Resource[] = [
  { id: 'r1', name: 'Mobile Crane #1', type: 'crane', availability: 'available', location: 'Depot A', nextAvailable: new Date().toISOString() },
  { id: 'r2', name: 'Mobile Crane #2', type: 'crane', availability: 'in_use', assignedTo: 'T001', location: 'Site S001', nextAvailable: addDays(new Date(), 3).toISOString() },
  { id: 'r3', name: 'Backup Generator', type: 'generator', availability: 'available', location: 'Depot B' },
  { id: 'r4', name: 'RF Test Equipment', type: 'test_equipment', availability: 'in_use', assignedTo: 'T006', location: 'Site S003', nextAvailable: addDays(new Date(), 1).toISOString() },
  { id: 'r5', name: 'Service Van #1', type: 'vehicle', availability: 'available', location: 'Depot A' },
  { id: 'r6', name: 'Service Van #2', type: 'vehicle', availability: 'maintenance', location: 'Workshop', nextAvailable: addDays(new Date(), 2).toISOString() },
  { id: 'r7', name: 'Tool Kit - Advanced', type: 'tools', availability: 'available', location: 'Depot A' },
];

export const VENDORS: Vendor[] = [
  { 
    id: 'v1', 
    name: 'TechInstall Pro', 
    services: ['Equipment Installation', 'Maintenance', 'Emergency Repair'], 
    rating: 4.5, 
    contacts: [{ name: 'John Smith', phone: '+1-555-0101', email: 'john@techinstall.com' }],
    contractStart: subDays(new Date(), 365).toISOString(),
    contractEnd: addDays(new Date(), 365).toISOString(),
    performanceScore: 92,
  },
  { 
    id: 'v2', 
    name: 'RF Solutions Inc', 
    services: ['RF Engineering', 'Site Survey', 'Optimization'], 
    rating: 4.8, 
    contacts: [{ name: 'Sarah Johnson', phone: '+1-555-0202', email: 'sarah@rfsolutions.com' }],
    performanceScore: 96,
  },
  { 
    id: 'v3', 
    name: 'PowerGrid Services', 
    services: ['Power Systems', 'Generator Maintenance', 'Solar Installation'], 
    rating: 4.2, 
    contacts: [{ name: 'Mike Davis', phone: '+1-555-0303', email: 'mike@powergrid.com' }],
    performanceScore: 85,
  },
];

export const DOCUMENTS: Document[] = [
  {
    id: 'd1',
    name: 'Site S001 - Tower Design.dwg',
    type: 'autocad',
    category: 'design',
    siteId: 'S001',
    uploadedBy: 'u1',
    uploadedAt: subDays(new Date(), 5).toISOString(),
    version: 2,
    url: '/mock/documents/tower-design.dwg',
    size: '2.4 MB',
    tags: ['design', 'structural'],
  },
  {
    id: 'd2',
    name: 'Lease Agreement - S002.pdf',
    type: 'pdf',
    category: 'legal',
    siteId: 'S002',
    uploadedBy: 'u2',
    uploadedAt: subDays(new Date(), 30).toISOString(),
    version: 1,
    url: '/mock/documents/lease-s002.pdf',
    size: '856 KB',
    tags: ['legal', 'lease'],
  },
  {
    id: 'd3',
    name: 'FCC Compliance Certificate.pdf',
    type: 'pdf',
    category: 'compliance',
    siteId: 'S001',
    uploadedBy: 'u1',
    uploadedAt: subDays(new Date(), 60).toISOString(),
    version: 1,
    url: '/mock/documents/fcc-cert.pdf',
    size: '124 KB',
    tags: ['compliance', 'fcc'],
  },
  {
    id: 'd4',
    name: 'Site Photo - North View.jpg',
    type: 'image',
    category: 'photo',
    siteId: 'S003',
    uploadedBy: 'u3',
    uploadedAt: subDays(new Date(), 2).toISOString(),
    version: 1,
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    size: '3.2 MB',
    tags: ['photo', 'site-survey'],
  },
];

export const AUTOCAD_FILES: AutoCADFile[] = [
  {
    id: 'd1',
    name: 'Site S001 - Tower Design.dwg',
    type: 'autocad',
    category: 'design',
    siteId: 'S001',
    uploadedBy: 'u1',
    uploadedAt: subDays(new Date(), 5).toISOString(),
    version: 2,
    url: '/mock/documents/tower-design.dwg',
    size: '2.4 MB',
    tags: ['design', 'structural'],
    layers: ['Base', 'Structure', 'Equipment', 'Dimensions', 'Annotations'],
    dimensions: { width: 1200, height: 1800, unit: 'mm' },
    aiInsights: [
      {
        id: 'ai1',
        type: 'structural',
        severity: 'medium',
        title: 'Foundation Load Distribution',
        description: 'The current foundation design may not adequately distribute the load for the proposed antenna array.',
        recommendation: 'Consider reinforcing the foundation with additional concrete piers or redistributing antenna placement.',
        confidence: 85,
      },
      {
        id: 'ai2',
        type: 'cost',
        severity: 'low',
        title: 'Material Optimization',
        description: 'Analysis suggests potential cost savings through alternative material selection.',
        recommendation: 'Replace specified steel grade with equivalent high-strength alternative, estimated savings: $12,000.',
        confidence: 78,
      },
      {
        id: 'ai3',
        type: 'compliance',
        severity: 'high',
        title: 'Wind Load Compliance',
        description: 'Structure meets local wind load requirements (Zone 3, 120 mph) with 15% safety margin.',
        recommendation: 'No action required. Design is compliant.',
        confidence: 95,
      },
      {
        id: 'ai4',
        type: 'optimization',
        severity: 'low',
        title: 'Cable Routing Efficiency',
        description: 'Current cable routing path is 23% longer than optimal.',
        recommendation: 'Reroute cables through alternate conduit path to reduce material costs and installation time.',
        confidence: 72,
      },
    ],
  },
];

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'insight1',
    type: 'risk',
    severity: 'high',
    title: 'Site S004 Critical Battery Level',
    description: 'Battery level at 10% with no grid power. Site may go offline within 2 hours.',
    recommendation: 'Dispatch emergency technician immediately with replacement batteries.',
    confidence: 98,
  },
  {
    id: 'insight2',
    type: 'optimization',
    severity: 'medium',
    title: 'Resource Allocation Inefficiency',
    description: 'Mobile Crane #2 will be idle for 4 days after current task completion.',
    recommendation: 'Reschedule Task T004 (Generator Maintenance) to utilize available crane time.',
    confidence: 82,
  },
  {
    id: 'insight3',
    type: 'cost',
    severity: 'low',
    title: 'Vendor Performance Analysis',
    description: 'TechInstall Pro has 8% higher completion rate than average but 12% higher cost.',
    recommendation: 'Consider renegotiating rates or evaluating alternative vendors for non-critical tasks.',
    confidence: 75,
  },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log1',
    entityType: 'task',
    entityId: 'T001',
    action: 'updated',
    userId: 'u2',
    timestamp: subDays(new Date(), 0.5).toISOString(),
    details: 'Updated task status from "todo" to "planning"',
    changes: { status: { old: 'todo', new: 'planning' } },
  },
  {
    id: 'log2',
    entityType: 'document',
    entityId: 'd1',
    action: 'uploaded',
    userId: 'u1',
    timestamp: subDays(new Date(), 5).toISOString(),
    details: 'Uploaded new AutoCAD design file (version 2)',
  },
  {
    id: 'log3',
    entityType: 'site',
    entityId: 'S004',
    action: 'updated',
    userId: 'u3',
    timestamp: subDays(new Date(), 0.1).toISOString(),
    details: 'Site status changed to offline due to power failure',
    changes: { status: { old: 'online', new: 'offline' } },
  },
  {
    id: 'log4',
    entityType: 'task',
    entityId: 'T006',
    action: 'completed',
    userId: 'u4',
    timestamp: subDays(new Date(), 5).toISOString(),
    details: 'Marked task as completed',
  },
];

export const TIME_ENTRIES: TimeEntry[] = [
  { id: 'te1', taskId: 'T001', userId: 'u2', startTime: subDays(new Date(), 1).toISOString(), endTime: subDays(new Date(), 0.8).toISOString(), duration: 288, notes: 'Initial planning and parts ordering' },
  { id: 'te2', taskId: 'T001', userId: 'u2', startTime: subDays(new Date(), 0.5).toISOString(), endTime: subDays(new Date(), 0.3).toISOString(), duration: 288, notes: 'Coordination with vendor' },
  { id: 'te3', taskId: 'T002', userId: 'u3', startTime: subDays(new Date(), 2).toISOString(), endTime: subDays(new Date(), 1.75).toISOString(), duration: 360, notes: 'Battery replacement work' },
  { id: 'te4', taskId: 'T006', userId: 'u4', startTime: subDays(new Date(), 6).toISOString(), endTime: subDays(new Date(), 5.4).toISOString(), duration: 840, notes: 'Complete site survey' },
];
