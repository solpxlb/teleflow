import { addDays, subDays } from 'date-fns';

export type Role = 'super_admin' | 'admin' | 'pm' | 'team_lead' | 'member' | 'tech';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  email: string;
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
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'planning' | 'permitting' | 'construction' | 'integration' | 'live'; // Merged statuses for demo
  assigneeId: string;
  reporterId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  siteId?: string;
  storyId?: string;
  startDate?: string;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  dependencies: string[]; // Task IDs
  attachments: Attachment[];
  comments: Comment[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  milestones: string[];
  priority: 'low' | 'medium' | 'high';
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
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const USERS: User[] = [
  { id: 'u0', name: 'Sarah Super', role: 'super_admin', avatar: 'https://i.pravatar.cc/150?u=u0', email: 'sarah@teleflow.com' },
  { id: 'u1', name: 'Alice Admin', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=u1', email: 'alice@teleflow.com' },
  { id: 'u2', name: 'Bob Manager', role: 'pm', avatar: 'https://i.pravatar.cc/150?u=u2', email: 'bob@teleflow.com' },
  { id: 'u3', name: 'Charlie Tech', role: 'tech', avatar: 'https://i.pravatar.cc/150?u=u3', email: 'charlie@teleflow.com' },
  { id: 'u4', name: 'David Lead', role: 'team_lead', avatar: 'https://i.pravatar.cc/150?u=u4', email: 'david@teleflow.com' },
  { id: 'u5', name: 'Eve Member', role: 'member', avatar: 'https://i.pravatar.cc/150?u=u5', email: 'eve@teleflow.com' },
];

export const STORIES: Story[] = [
  { id: 'S1', title: 'Q4 Network Expansion', description: 'Expand 5G coverage in North Region', status: 'in_progress', priority: 'high', milestones: ['Phase 1', 'Phase 2'] },
  { id: 'S2', title: 'Legacy Equipment Decommission', description: 'Remove old 3G hardware', status: 'todo', priority: 'medium', milestones: ['Audit', 'Removal'] },
];

export const SITES: Site[] = [
  { id: 'S001', name: 'North Tower Alpha', lat: 40.7128, lng: -74.0060, status: 'online', tenant: 'Verizon', powerType: 'Grid', batteryLevel: 100, lastMaintenance: '2023-10-15', leaseExpires: addDays(new Date(), 120).toISOString(), address: '123 Broadway, NY' },
  { id: 'S002', name: 'West Side Hub', lat: 40.7580, lng: -73.9855, status: 'maintenance', tenant: 'AT&T', powerType: 'Hybrid', batteryLevel: 85, lastMaintenance: '2023-11-01', leaseExpires: addDays(new Date(), 45).toISOString(), address: '456 7th Ave, NY' },
  { id: 'S003', name: 'Brooklyn Relay', lat: 40.6782, lng: -73.9442, status: 'online', tenant: 'T-Mobile', powerType: 'Solar', batteryLevel: 92, lastMaintenance: '2023-09-20', leaseExpires: addDays(new Date(), 300).toISOString(), address: '789 Flatbush Ave, Brooklyn' },
  { id: 'S004', name: 'Queens Connector', lat: 40.7282, lng: -73.7949, status: 'offline', tenant: 'Verizon', powerType: 'Generator', batteryLevel: 10, lastMaintenance: '2023-08-05', leaseExpires: addDays(new Date(), 15).toISOString(), address: '101 Main St, Queens' },
  { id: 'S005', name: 'Bronx Station', lat: 40.8448, lng: -73.8648, status: 'online', tenant: 'Sprint', powerType: 'Grid', batteryLevel: 98, lastMaintenance: '2023-10-25', leaseExpires: addDays(new Date(), 180).toISOString(), address: '202 Grand Concourse, Bronx' },
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
    ]
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
    comments: []
  },
  {
    id: 'T003',
    title: 'Lease Renewal Negotiation',
    description: 'Contact landlord regarding lease extension.',
    status: 'permitting',
    assigneeId: 'u2',
    reporterId: 'u0',
    priority: 'high',
    siteId: 'S008',
    dueDate: addDays(new Date(), 5).toISOString(),
    tags: ['legal'],
    subtasks: [],
    dependencies: [],
    attachments: [],
    comments: []
  },
  {
    id: 'T004',
    title: 'Generator Maintenance',
    description: 'Annual generator service and load test.',
    status: 'planning',
    assigneeId: 'u3',
    reporterId: 'u2',
    priority: 'low',
    siteId: 'S014',
    dueDate: addDays(new Date(), 30).toISOString(),
    tags: ['maintenance'],
    subtasks: [],
    dependencies: [],
    attachments: [],
    comments: []
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
    dependencies: [],
    attachments: [],
    comments: []
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Site S004 Offline', message: 'Power failure detected at Queens Connector.', timestamp: subDays(new Date(), 0).toISOString(), type: 'error' },
  { id: 'n2', title: 'Lease Expiring', message: 'Lease for S008 expires in 10 days.', timestamp: subDays(new Date(), 1).toISOString(), type: 'warning' },
  { id: 'n3', title: 'Maintenance Complete', message: 'Routine maintenance finished at S001.', timestamp: subDays(new Date(), 2).toISOString(), type: 'success' },
  { id: 'n4', title: 'New Task Assigned', message: 'You have been assigned to "5G Antenna Upgrade".', timestamp: subDays(new Date(), 3).toISOString(), type: 'info' },
];
