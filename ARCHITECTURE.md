# TeleFlow - Technical Architecture Documentation

## System Overview

TeleFlow is a modern React-based single-page application (SPA) built with TypeScript, designed for managing telecom infrastructure operations.

### Technology Stack

**Frontend:**
- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Zustand**: State management
- **React Flow**: Workflow visualization
- **DnD Kit**: Drag-and-drop functionality
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **date-fns**: Date manipulation
- **Tailwind CSS**: Utility-first styling

**Development:**
- **ESLint**: Code linting
- **TypeScript Compiler**: Type checking
- **Vite HMR**: Hot module replacement

---

## Project Structure

```
teleflow/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   │   ├── projects/       # Project-specific components
│   │   ├── tasks/          # Task management components
│   │   ├── workflow/       # Workflow builder components
│   │   └── autocad/        # AutoCAD-related components
│   ├── pages/              # Route-level page components
│   │   ├── Dashboard.tsx
│   │   ├── Sites.tsx
│   │   ├── Projects.tsx
│   │   ├── Workflow.tsx
│   │   ├── Analytics.tsx
│   │   ├── TeamManagement.tsx
│   │   ├── DocumentCenter.tsx
│   │   └── Settings.tsx
│   ├── lib/                # Core utilities and data
│   │   ├── mockData.ts     # Type definitions and mock data
│   │   └── store.ts        # Zustand state management
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── dist/                   # Production build output
└── package.json            # Dependencies and scripts
```

---

## Data Architecture

### Type System

All data types are defined in `src/lib/mockData.ts`:

#### Core Entities

**User**
```typescript
interface User {
  id: string;
  name: string;
  role: Role;  // 'super_admin' | 'admin' | 'pm' | 'team_lead' | 'member' | 'tech'
  avatar: string;
  email: string;
  skills?: string[];
  certifications?: string[];
  availability?: 'available' | 'busy' | 'offline';
  hourlyRate?: number;
  workload?: number;  // 0-100
}
```

**Site**
```typescript
interface Site {
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
```

**Task**
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
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
}
```

**WorkflowNode**
```typescript
interface WorkflowNode {
  id: string;
  type: 'start' | 'task' | 'approval' | 'condition' | 'parallel' | 
        'delay' | 'notification' | 'document' | 'autocad' | 'end';
  data: {
    label: string;
    config?: {
      assigneeId?: string;
      dueDays?: number;
      description?: string;
      estimatedHours?: number;
      approverRole?: string;
      slaHours?: number;
      conditionType?: string;
      expression?: string;
      delayDays?: number;
      notificationType?: string;
      message?: string;
      allowedTypes?: string[];
      analysisTypes?: string[];
      autoApprove?: boolean;
    };
  };
  position: { x: number; y: number };
}
```

**Document**
```typescript
interface Document {
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
```

---

## State Management

### Zustand Store (`src/lib/store.ts`)

TeleFlow uses Zustand for global state management with a single store containing all application state.

**Store Structure:**
```typescript
interface TeleFlowStore {
  // Data
  tasks: Task[];
  sites: Site[];
  stories: Story[];
  documents: Document[];
  workflowTemplates: WorkflowTemplate[];
  workflowExecutions: WorkflowExecution[];
  resources: Resource[];
  
  // Task Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
  
  // Site Actions
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  
  // Document Actions
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  // Workflow Actions
  createWorkflowTemplate: (template: WorkflowTemplate) => void;
  executeWorkflow: (templateId: string, variables: Record<string, any>) => void;
  
  // Resource Actions
  updateResource: (id: string, updates: Partial<Resource>) => void;
  scheduleResource: (resourceId: string, taskId: string, startDate: string, endDate: string) => void;
}
```

**Usage Example:**
```typescript
import { useStore } from '@/lib/store';

const MyComponent = () => {
  const { tasks, addTask, updateTask } = useStore();
  
  const handleCreateTask = () => {
    addTask({
      id: `T${Date.now()}`,
      title: 'New Task',
      // ... other properties
    });
  };
  
  return <div>{/* component JSX */}</div>;
};
```

---

## Component Architecture

### Layout Components

**Layout** (`src/components/layout/Layout.tsx`)
- Main application shell
- Renders Sidebar and Header
- Provides Outlet for page content
- Handles responsive layout

**Sidebar** (`src/components/layout/Sidebar.tsx`)
- Navigation menu
- Active route highlighting
- Role-based menu items
- Collapsible on mobile

**Header** (`src/components/layout/Header.tsx`)
- User profile
- Notifications
- Quick actions
- Search functionality

### Page Components

Each page is a route-level component:

**Dashboard** - Overview and quick stats  
**Sites** - Site list and map view  
**Projects** - Task management with multiple views  
**Workflow** - Workflow builder and execution  
**Analytics** - Charts and reports  
**TeamManagement** - Team member management  
**DocumentCenter** - Document repository  
**Settings** - Application configuration  

### Feature Components

**Task Management:**
- `TaskListView`: Table view of tasks
- `TaskCalendarView`: Calendar visualization
- `TaskTimelineView`: Gantt-style timeline
- `DependencyGraph`: Task dependency visualization
- `TaskFilters`: Advanced filtering UI
- `BulkActions`: Multi-task operations
- `TaskDetailModal`: Task details and editing

**Workflow Builder:**
- `WorkflowTemplates`: Pre-built workflow library
- `WorkflowNodeEditor`: Node configuration modal
- `WorkflowTriggers`: Trigger configuration
- `WorkflowExecutionPanel`: Execution monitoring

**AutoCAD:**
- `AIInsightsPanel`: AI analysis results display

---

## Routing Architecture

React Router v6 with nested routes:

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="sites" element={<Sites />} />
      <Route path="projects" element={<Projects />} />
      <Route path="stories" element={<Stories />} />
      <Route path="workflow" element={<Workflow />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="team" element={<TeamManagement />} />
      <Route path="documents" element={<DocumentCenter />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Navigation Flow:**
1. User clicks sidebar link
2. React Router updates URL
3. Layout persists (Sidebar, Header)
4. Page component renders in Outlet
5. Component fetches data from Zustand store

---

## Workflow Builder Architecture

### React Flow Integration

The Workflow Builder uses `react-flow-renderer` for visual workflow design.

**Key Concepts:**

**Nodes**: Visual representations of workflow steps
- Each node type has custom rendering
- Nodes store configuration in `data` property
- Position tracked for layout

**Edges**: Connections between nodes
- Represent flow direction
- Can be animated
- Support labels

**React Flow Instance**: Provides API for:
- Adding/removing nodes
- Creating connections
- Zooming/panning
- Exporting workflow

### Node Configuration Flow

1. User drags node from palette to canvas
2. Node created with default configuration
3. User clicks node to edit
4. `WorkflowNodeEditor` modal opens
5. User configures:
   - Node label
   - Assignee (team member)
   - Node-specific settings
6. Configuration saved to node.data.config
7. Modal closes, canvas updates

### Workflow Execution

**Execution Process:**
1. User clicks "Test Run"
2. `WorkflowExecutionPanel` opens
3. System converts React Flow nodes to WorkflowNodes
4. Execution starts at Start node
5. Each node:
   - Executes its action (create task, send notification, etc.)
   - Updates execution state
   - Moves to next connected node
6. Execution completes at End node
7. Results logged and displayed

**Execution State:**
```typescript
interface WorkflowExecution {
  id: string;
  templateId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: string;
  endTime?: string;
  currentNode?: string;
  variables: Record<string, any>;
  triggeredBy: string;
}
```

---

## Drag-and-Drop Architecture

### DnD Kit Integration

TeleFlow uses `@dnd-kit/core` for drag-and-drop functionality in the Kanban board.

**Key Components:**

**DndContext**: Wraps draggable area
- Handles drag events
- Manages sensors (pointer, keyboard)
- Collision detection

**SortableContext**: Defines droppable zones
- Columns (To Do, In Progress, Review, Completed)
- Vertical list sorting strategy

**useSortable Hook**: Makes items draggable
- Provides drag handles
- Manages transform/transition
- Reports drag state

**Drag Flow:**
1. User grabs task card
2. `handleDragStart` sets activeId
3. DragOverlay shows dragging preview
4. User drops on column
5. `handleDragEnd` updates task status
6. Zustand store updates
7. UI re-renders with new position

---

## Data Flow Patterns

### Unidirectional Data Flow

```
User Action → Component Handler → Zustand Action → State Update → Re-render
```

**Example: Updating Task Status**

1. User drags task to "In Progress" column
2. `handleDragEnd` called with task ID and new status
3. Calls `moveTask(taskId, 'in_progress')`
4. Zustand updates tasks array
5. All components using tasks re-render
6. UI reflects new status

### Derived State

Components compute derived data from store:

```typescript
const filteredTasks = useMemo(() => {
  return tasks.filter(task => {
    if (filters.assignees.length > 0 && 
        !filters.assignees.includes(task.assigneeId)) return false;
    if (filters.priorities.length > 0 && 
        !filters.priorities.includes(task.priority)) return false;
    return true;
  });
}, [tasks, filters]);
```

**Benefits:**
- Keeps store minimal
- Recomputes only when dependencies change
- Prevents unnecessary re-renders

---

## Performance Optimizations

### React Optimizations

**useMemo**: Cache expensive computations
```typescript
const sortedTasks = useMemo(() => 
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
  [tasks]
);
```

**useCallback**: Memoize event handlers
```typescript
const handleTaskClick = useCallback((task: Task) => {
  setSelectedTask(task);
}, []);
```

**React.memo**: Prevent unnecessary re-renders
```typescript
const TaskCard = React.memo(({ task, onClick }) => {
  // Component only re-renders if task or onClick changes
});
```

### Zustand Optimizations

**Selective Subscriptions**: Only subscribe to needed state
```typescript
// Good: Only re-renders when tasks change
const tasks = useStore(state => state.tasks);

// Bad: Re-renders on any store change
const store = useStore();
```

**Batch Updates**: Group related state changes
```typescript
bulkUpdateTasks: (taskIds, updates) => {
  set(state => ({
    tasks: state.tasks.map(task =>
      taskIds.includes(task.id) ? { ...task, ...updates } : task
    )
  }));
}
```

---

## Styling Architecture

### Tailwind CSS Utility Classes

TeleFlow uses Tailwind CSS for styling with a dark theme.

**Color Palette:**
- Background: `slate-950`, `slate-900`, `slate-800`
- Text: `white`, `slate-200`, `slate-400`
- Borders: `slate-700`, `slate-800`
- Primary: `blue-600`, `blue-500`
- Success: `emerald-500`
- Warning: `amber-500`
- Error: `rose-500`

**Common Patterns:**
```typescript
// Card
className="bg-slate-800 p-4 rounded-xl border border-slate-700"

// Button Primary
className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"

// Input
className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
```

### Responsive Design

Mobile-first approach with breakpoints:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

**Example:**
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

---

## Build & Deployment

### Development

```bash
npm run dev
```
- Starts Vite dev server on port 5173
- Hot module replacement enabled
- TypeScript type checking in watch mode

### Production Build

```bash
npm run build
```
- TypeScript compilation (`tsc`)
- Vite production build
- Output to `dist/` directory
- Minification and tree-shaking
- Asset optimization

**Build Output:**
- `dist/index.html` - Entry HTML
- `dist/assets/index-[hash].css` - Bundled styles (~45KB gzipped)
- `dist/assets/index-[hash].js` - Bundled JavaScript (~327KB gzipped)

### Deployment

Static hosting compatible (Vercel, Netlify, AWS S3, etc.):

1. Run `npm run build`
2. Upload `dist/` contents to hosting
3. Configure SPA routing (redirect all to index.html)
4. Set environment variables if needed

---

## Testing Strategy

### Type Safety

TypeScript provides compile-time type checking:
- All data structures typed
- Props validated
- Function signatures enforced
- Null/undefined handling

### Manual Testing

Key test scenarios:
1. **Task Management**: Create, update, delete, drag-drop
2. **Workflow Builder**: Create workflow, configure nodes, execute
3. **Filtering**: Apply filters, save filters, clear filters
4. **Bulk Actions**: Select multiple, update status, reassign
5. **Document Upload**: Upload files, categorize, search
6. **Responsive**: Test on mobile, tablet, desktop

---

## Future Enhancements

### Backend Integration

Replace mock data with real API:
- RESTful API or GraphQL
- Authentication (JWT, OAuth)
- Real-time updates (WebSockets)
- File upload to cloud storage

### Database Schema

Recommended structure:
- Users table
- Sites table
- Tasks table (foreign keys to users, sites)
- Documents table (foreign keys to sites, tasks)
- Workflows table
- Workflow_executions table
- Comments table
- Activity_logs table

### Additional Features

- **Real-time Collaboration**: Multiple users editing simultaneously
- **Mobile App**: Native iOS/Android apps
- **Offline Mode**: Service workers for offline access
- **Advanced Analytics**: Machine learning predictions
- **Integrations**: Slack, Email, Calendar, AutoCAD API
- **Custom Fields**: User-defined task/site properties
- **Audit Trail**: Complete change history
- **Role-based Permissions**: Granular access control

---

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use functional components with hooks
- Prefer const over let
- Use descriptive variable names
- Add comments for complex logic

### Component Guidelines

- Keep components small and focused
- Extract reusable logic to custom hooks
- Use props for configuration
- Avoid prop drilling (use Zustand for global state)
- Handle loading and error states

### State Management

- Use Zustand for global state
- Use useState for local component state
- Use useMemo for derived state
- Batch related updates
- Keep store actions pure

### Performance

- Use React.memo for expensive components
- Use useCallback for event handlers
- Use useMemo for expensive computations
- Lazy load routes if bundle size grows
- Optimize images and assets

---

## Troubleshooting

### Common Issues

**Build Errors:**
- Run `npm install` to ensure dependencies installed
- Check TypeScript errors with `tsc --noEmit`
- Clear node_modules and reinstall if needed

**State Not Updating:**
- Ensure Zustand action called correctly
- Check if component subscribed to correct state slice
- Verify state mutation (should create new objects, not mutate)

**Drag-and-Drop Not Working:**
- Check DndContext wraps draggable items
- Verify SortableContext items array
- Ensure unique IDs for all draggable items

**Workflow Execution Fails:**
- Check all nodes have required configuration
- Verify edges connect properly
- Check console for error messages

---

## API Reference

### Zustand Store Actions

**Task Actions:**
```typescript
addTask(task: Task): void
updateTask(id: string, updates: Partial<Task>): void
deleteTask(id: string): void
moveTask(taskId: string, newStatus: Task['status']): void
bulkUpdateTasks(taskIds: string[], updates: Partial<Task>): void
bulkDeleteTasks(taskIds: string[]): void
```

**Site Actions:**
```typescript
addSite(site: Site): void
updateSite(id: string, updates: Partial<Site>): void
deleteSite(id: string): void
```

**Document Actions:**
```typescript
addDocument(document: Document): void
updateDocument(id: string, updates: Partial<Document>): void
deleteDocument(id: string): void
```

**Workflow Actions:**
```typescript
createWorkflowTemplate(template: WorkflowTemplate): void
executeWorkflow(templateId: string, variables: Record<string, any>): void
```

---

## Conclusion

TeleFlow's architecture prioritizes:

✅ **Type Safety**: TypeScript throughout  
✅ **Performance**: Optimized rendering and state management  
✅ **Maintainability**: Clear structure and separation of concerns  
✅ **Scalability**: Modular components and efficient state  
✅ **Developer Experience**: Hot reload, type checking, linting  

This architecture provides a solid foundation for building a robust telecom management platform.
