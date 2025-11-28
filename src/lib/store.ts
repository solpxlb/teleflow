import { create } from 'zustand';
import {
  User, Site, Task, Notification, Story, Role,
  USERS, SITES, TASKS, NOTIFICATIONS, STORIES,
  WorkflowTemplate, WorkflowExecution, WORKFLOW_TEMPLATES,
  Resource, RESOURCES,
  Vendor, VENDORS,
  Document, AutoCADFile, DOCUMENTS, AUTOCAD_FILES,
  AIInsight, AI_INSIGHTS,
  ActivityLog, ACTIVITY_LOGS,
  TimeEntry, TIME_ENTRIES,
  CustomField,
} from './mockData';

interface AppState {
  // Existing state
  currentUser: User | null;
  sites: Site[];
  tasks: Task[];
  stories: Story[];
  notifications: Notification[];

  // New state
  workflowTemplates: WorkflowTemplate[];
  workflowExecutions: WorkflowExecution[];
  resources: Resource[];
  vendors: Vendor[];
  documents: Document[];
  autocadFiles: AutoCADFile[];
  aiInsights: AIInsight[];
  activityLogs: ActivityLog[];
  timeEntries: TimeEntry[];
  customFields: CustomField[];

  // Existing actions
  login: (role: Role) => void;
  logout: () => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  deleteTask: (id: string) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;

  // New workflow actions
  addWorkflowTemplate: (template: WorkflowTemplate) => void;
  updateWorkflowTemplate: (id: string, updates: Partial<WorkflowTemplate>) => void;
  deleteWorkflowTemplate: (id: string) => void;
  executeWorkflow: (templateId: string, variables: Record<string, any>) => void;
  updateWorkflowExecution: (id: string, updates: Partial<WorkflowExecution>) => void;

  // Resource actions
  addResource: (resource: Resource) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  scheduleResource: (resourceId: string, taskId: string, startDate: string, endDate: string) => void;

  // Vendor actions
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;

  // Document actions
  addDocument: (document: Document | AutoCADFile) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;

  // Activity log actions
  addActivityLog: (log: ActivityLog) => void;

  // Time tracking actions
  startTimeEntry: (taskId: string, userId: string) => void;
  stopTimeEntry: (id: string, notes?: string) => void;
  addTimeEntry: (entry: TimeEntry) => void;

  // Custom field actions
  addCustomField: (field: CustomField) => void;
  updateCustomField: (id: string, updates: Partial<CustomField>) => void;
  deleteCustomField: (id: string) => void;

  // Bulk actions
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  sites: SITES,
  tasks: TASKS,
  stories: STORIES,
  notifications: NOTIFICATIONS,
  workflowTemplates: WORKFLOW_TEMPLATES,
  workflowExecutions: [],
  resources: RESOURCES,
  vendors: VENDORS,
  documents: DOCUMENTS,
  autocadFiles: AUTOCAD_FILES,
  aiInsights: AI_INSIGHTS,
  activityLogs: ACTIVITY_LOGS,
  timeEntries: TIME_ENTRIES,
  customFields: [],

  // Existing actions
  login: (role: Role) => {
    const user = USERS.find(u => u.role === role);
    if (user) {
      set({ currentUser: user });
    }
  },

  logout: () => set({ currentUser: null }),

  addSite: (site) => {
    set((state) => ({ sites: [...state.sites, site] }));
    get().addActivityLog({
      id: `log-${Date.now()}`,
      entityType: 'site',
      entityId: site.id,
      action: 'created',
      userId: get().currentUser?.id || 'system',
      timestamp: new Date().toISOString(),
      details: `Created new site: ${site.name}`,
    });
  },

  updateSite: (id, updates) => {
    set((state) => ({
      sites: state.sites.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
    get().addActivityLog({
      id: `log-${Date.now()}`,
      entityType: 'site',
      entityId: id,
      action: 'updated',
      userId: get().currentUser?.id || 'system',
      timestamp: new Date().toISOString(),
      details: `Updated site ${id}`,
      changes: updates as any,
    });
  },

  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
    get().addActivityLog({
      id: `log-${Date.now()}`,
      entityType: 'task',
      entityId: task.id,
      action: 'created',
      userId: get().currentUser?.id || 'system',
      timestamp: new Date().toISOString(),
      details: `Created new task: ${task.title}`,
    });
  },

  updateTask: (id, updates) => {
    const oldTask = get().tasks.find(t => t.id === id);
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
    if (oldTask) {
      get().addActivityLog({
        id: `log-${Date.now()}`,
        entityType: 'task',
        entityId: id,
        action: 'updated',
        userId: get().currentUser?.id || 'system',
        timestamp: new Date().toISOString(),
        details: `Updated task ${oldTask.title}`,
        changes: updates as any,
      });
    }
  },

  moveTask: (taskId, newStatus) => {
    get().updateTask(taskId, { status: newStatus });
  },

  deleteTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
    if (task) {
      get().addActivityLog({
        id: `log-${Date.now()}`,
        entityType: 'task',
        entityId: id,
        action: 'deleted',
        userId: get().currentUser?.id || 'system',
        timestamp: new Date().toISOString(),
        details: `Deleted task: ${task.title}`,
      });
    }
  },

  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),

  updateStory: (id, updates) => set((state) => ({
    stories: state.stories.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  // Workflow actions
  addWorkflowTemplate: (template) => set((state) => ({
    workflowTemplates: [...state.workflowTemplates, template]
  })),

  updateWorkflowTemplate: (id, updates) => set((state) => ({
    workflowTemplates: state.workflowTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  deleteWorkflowTemplate: (id) => set((state) => ({
    workflowTemplates: state.workflowTemplates.filter(t => t.id !== id)
  })),

  executeWorkflow: (templateId, variables) => {
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      templateId,
      status: 'running',
      startTime: new Date().toISOString(),
      variables,
      triggeredBy: get().currentUser?.id || 'system',
    };
    set((state) => ({
      workflowExecutions: [...state.workflowExecutions, execution]
    }));
  },

  updateWorkflowExecution: (id, updates) => set((state) => ({
    workflowExecutions: state.workflowExecutions.map(e => e.id === id ? { ...e, ...updates } : e)
  })),

  // Resource actions
  addResource: (resource) => set((state) => ({
    resources: [...state.resources, resource]
  })),

  updateResource: (id, updates) => set((state) => ({
    resources: state.resources.map(r => r.id === id ? { ...r, ...updates } : r)
  })),

  scheduleResource: (resourceId, taskId, startDate, endDate) => {
    get().updateResource(resourceId, {
      availability: 'in_use',
      assignedTo: taskId,
      nextAvailable: endDate,
    });
  },

  // Vendor actions
  addVendor: (vendor) => set((state) => ({
    vendors: [...state.vendors, vendor]
  })),

  updateVendor: (id, updates) => set((state) => ({
    vendors: state.vendors.map(v => v.id === id ? { ...v, ...updates } : v)
  })),

  // Document actions
  addDocument: (document) => {
    set((state) => ({
      documents: [...state.documents, document],
      autocadFiles: document.type === 'autocad' ? [...state.autocadFiles, document as AutoCADFile] : state.autocadFiles,
    }));
    get().addActivityLog({
      id: `log-${Date.now()}`,
      entityType: 'document',
      entityId: document.id,
      action: 'uploaded',
      userId: get().currentUser?.id || 'system',
      timestamp: new Date().toISOString(),
      details: `Uploaded document: ${document.name}`,
    });
  },

  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d),
    autocadFiles: state.autocadFiles.map(d => d.id === id ? { ...d, ...updates } : d),
  })),

  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id),
    autocadFiles: state.autocadFiles.filter(d => d.id !== id),
  })),

  // Activity log actions
  addActivityLog: (log) => set((state) => ({
    activityLogs: [log, ...state.activityLogs]
  })),

  // Time tracking actions
  startTimeEntry: (taskId, userId) => {
    const entry: TimeEntry = {
      id: `te-${Date.now()}`,
      taskId,
      userId,
      startTime: new Date().toISOString(),
      duration: 0,
    };
    set((state) => ({
      timeEntries: [...state.timeEntries, entry]
    }));
  },

  stopTimeEntry: (id, notes) => {
    const entry = get().timeEntries.find(e => e.id === id);
    if (entry && !entry.endTime) {
      const endTime = new Date();
      const startTime = new Date(entry.startTime);
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // minutes

      set((state) => ({
        timeEntries: state.timeEntries.map(e =>
          e.id === id
            ? { ...e, endTime: endTime.toISOString(), duration, notes }
            : e
        )
      }));

      // Update task actual hours
      const task = get().tasks.find(t => t.id === entry.taskId);
      if (task) {
        const totalMinutes = get().timeEntries
          .filter(e => e.taskId === entry.taskId && e.endTime)
          .reduce((sum, e) => sum + e.duration, 0) + duration;
        get().updateTask(entry.taskId, { actualHours: totalMinutes / 60 });
      }
    }
  },

  addTimeEntry: (entry) => set((state) => ({
    timeEntries: [...state.timeEntries, entry]
  })),

  // Custom field actions
  addCustomField: (field) => set((state) => ({
    customFields: [...state.customFields, field]
  })),

  updateCustomField: (id, updates) => set((state) => ({
    customFields: state.customFields.map(f => f.id === id ? { ...f, ...updates } : f)
  })),

  deleteCustomField: (id) => set((state) => ({
    customFields: state.customFields.filter(f => f.id !== id)
  })),

  // Bulk actions
  bulkUpdateTasks: (taskIds, updates) => {
    set((state) => ({
      tasks: state.tasks.map(t =>
        taskIds.includes(t.id) ? { ...t, ...updates } : t
      )
    }));
    get().addActivityLog({
      id: `log-${Date.now()}`,
      entityType: 'task',
      entityId: taskIds.join(','),
      action: 'updated',
      userId: get().currentUser?.id || 'system',
      timestamp: new Date().toISOString(),
      details: `Bulk updated ${taskIds.length} tasks`,
    });
  },

  bulkDeleteTasks: (taskIds) => {
    set((state) => ({
      tasks: state.tasks.filter(t => !taskIds.includes(t.id))
    }));
    get().addActivityLog({
      id: `log-${Date.now()}`,
      entityType: 'task',
      entityId: taskIds.join(','),
      action: 'deleted',
      userId: get().currentUser?.id || 'system',
      timestamp: new Date().toISOString(),
      details: `Bulk deleted ${taskIds.length} tasks`,
    });
  },
}));
