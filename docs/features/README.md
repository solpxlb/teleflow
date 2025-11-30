# TeleFlow Feature Documentation

## Overview
This directory contains comprehensive technical documentation for all major features of the TeleFlow application, including database schemas, user flows, API integration, and testing guidelines.

---

## Feature Documentation

### 1. [Authentication & Authorization](./01-authentication.md)
**Purpose**: Secure JWT-based authentication with role-based access control

**Key Topics**:
- Email/password authentication
- JWT token management
- 6 user roles (Super Admin, Admin, PM, Team Lead, Member, Tech)
- Permission system (30+ permissions)
- Row-level security policies
- User creation and management

**Database Tables**:
- `auth.users` - Supabase authentication
- `public.users` - User profiles
- `public.permissions` - System permissions
- `public.role_permissions` - Role-permission mappings
- `public.user_custom_permissions` - Custom overrides

---

### 2. [Dashboard - Command Center](./02-dashboard.md)
**Purpose**: Real-time operational visibility and metrics

**Key Topics**:
- 4 metric cards (Sites, Alarms, Maintenance, Leases)
- Interactive charts (Pie chart, Bar chart)
- Geographic site visualization (Leaflet map)
- Live activity feed
- Real-time data updates

**Database Tables**:
- `public.sites` - Site data
- `public.tasks` - Task metrics
- `public.notifications` - Activity feed

---

### 3. [Site Management](./03-site-management.md)
**Purpose**: Cell tower site tracking and management

**Key Topics**:
- Site CRUD operations
- Geographic location tracking
- Status monitoring (operational/maintenance/offline)
- Tenant and lease management
- Site-task-document linking

**Database Tables**:
- `public.sites` - Site information

---

### 4. [Task & Project Management](./04-task-management.md)
**Purpose**: Multi-view task management system

**Key Topics**:
- 5 view modes (Kanban, List, Calendar, Timeline, Dependencies)
- Drag-and-drop task management
- Subtask tracking with progress
- Task dependencies and blocking
- Bulk operations
- Advanced filtering

**Database Tables**:
- `public.tasks` - Task information
- `public.subtasks` - Task subtasks

---

### 5. [Workflow Builder](./05-workflow-builder.md)
**Purpose**: Visual workflow automation system

**Key Topics**:
- 3 creation modes (Templates, Manual, AI)
- 9 node types (Start, Task, Approval, Condition, etc.)
- Pre-built templates (Site Survey, Installation, Emergency)
- Visual workflow designer (React Flow)
- Workflow execution and monitoring

**Database Tables**:
- `public.workflow_templates` - Workflow definitions
- `public.workflow_executions` - Execution history

---

### 6. [Document Center](./06-document-center.md)
**Purpose**: Document management with AutoCAD integration

**Key Topics**:
- Document upload and storage
- Version control
- AutoCAD file support (DWG, DXF)
- AI-powered document analysis
- Document categorization (Plans, Reports, Permits, Photos, Contracts)
- Search and filtering

**Database Tables**:
- `public.documents` - Document metadata

---

### 7. [Team Management](./07-team-management.md)
**Purpose**: Team collaboration and workload monitoring

**Key Topics**:
- Team member profiles
- Workload distribution
- Activity tracking
- Team-based reporting

**Database Tables**:
- `public.users` - Team member information

---

### 8. [User Management](./08-user-management.md)
**Purpose**: Super admin user administration

**Key Topics**:
- User account creation
- Role assignment
- Custom permission management
- User activation/deactivation

**Database Tables**:
- `auth.users` - Authentication
- `public.users` - User profiles
- `public.user_custom_permissions` - Permission overrides

---

## Technology Stack

### Frontend
- **React** 18+ with TypeScript
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **TailwindCSS** - Styling

### UI Libraries
- **Lucide React** - Icons
- **Recharts** - Charts
- **React-Leaflet** - Maps
- **React Flow** - Workflow diagrams
- **date-fns** - Date formatting
- **@dnd-kit** - Drag and drop

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication (JWT)
  - Storage
  - Real-time subscriptions
  - Row-level security

---

## Database Schema Overview

### Core Tables
- **users** - User profiles and roles
- **sites** - Cell tower sites
- **tasks** - Project tasks
- **subtasks** - Task breakdown
- **documents** - Document metadata
- **workflow_templates** - Workflow definitions
- **workflow_executions** - Workflow runs
- **notifications** - System notifications
- **permissions** - System permissions
- **role_permissions** - Role-permission mappings
- **user_custom_permissions** - User-specific permissions

---

## Support & Maintenance

### Common Issues
- **Login fails**: Check Supabase credentials
- **RLS errors**: Verify user permissions
- **Data not loading**: Check network tab for errors

### Performance Tips
- Use indexes on frequently queried columns
- Implement pagination for large datasets
- Use memoization for expensive calculations
- Lazy load components when possible
