// Minimal Zustand store for TeleFlow
import { create } from 'zustand';
import { supabase, auth } from './supabase';
import { getUserPermissions } from './auth';
import { transformKeys } from './dataTransform';
import { User, Site, Task, WorkflowTemplate, WorkflowExecution, Document, Notification, Story } from './mockData';

interface AppState {
  // State
  isLoading: boolean;
  error: string | null;
  currentUser: User | null;
  userPermissions: string[];
  users: User[];
  sites: Site[];
  tasks: Task[];
  documents: Document[];
  workflowTemplates: WorkflowTemplate[];
  workflowExecutions: WorkflowExecution[];
  notifications: Notification[];
  stories: Story[];

  // Actions
  fetchInitialData: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  moveTask: (taskId: string, newStatus: Task['status']) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addWorkflowTemplate: (template: WorkflowTemplate) => Promise<void>;
  deleteWorkflowTemplate: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,
  currentUser: null,
  userPermissions: [],
  users: [],
  sites: [],
  tasks: [],
  documents: [],
  workflowTemplates: [],
  workflowExecutions: [],
  notifications: [],
  stories: [],

  // Fetch data and normalize
  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await auth.getCurrentUser();
      if (!currentUser) {
        set({ isLoading: false });
        return;
      }
      const permissions = await getUserPermissions(currentUser.id);

      const [{ data: users }, { data: sites }, { data: tasks }, { data: documents }, { data: templates }, { data: executions }, { data: subtasks }] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('sites').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('documents').select('*'),
        supabase.from('workflow_templates').select('*'),
        supabase.from('workflow_executions').select('*'),
        supabase.from('subtasks').select('*'),
      ]);

      const transformedUsers = transformKeys(users || []);
      const transformedSites = transformKeys(sites || []);
      const transformedTasks = transformKeys(tasks || []);
      const transformedDocuments = transformKeys(documents || []);
      const transformedTemplates = transformKeys(templates || []);
      const transformedExecutions = transformKeys(executions || []);
      const transformedSubtasks = transformKeys(subtasks || []);

      const tasksWithRelations = (transformedTasks as any[]).map((task: any) => {
        const relatedSubtasks = (transformedSubtasks as any[]).filter(st => st.task_id === task.id);
        return {
          ...task,
          subtasks: relatedSubtasks || [],
          dependencies: task.dependencies || [],
        };
      });

      set({
        currentUser,
        userPermissions: permissions,
        users: transformedUsers,
        sites: transformedSites,
        tasks: tasksWithRelations,
        documents: transformedDocuments,
        workflowTemplates: transformedTemplates,
        workflowExecutions: transformedExecutions,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // Auth actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await auth.signIn(email, password);
      const user = await auth.getCurrentUser();
      if (user) {
        const perms = await getUserPermissions(user.id);
        set({ currentUser: user, userPermissions: perms, isLoading: false });
        await get().fetchInitialData();
      }
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },
  logout: async () => {
    await auth.signOut();
    set({
      currentUser: null,
      userPermissions: [],
      users: [],
      sites: [],
      tasks: [],
      documents: [],
      workflowTemplates: [],
      workflowExecutions: [],
    });
  },
  checkAuth: async () => {
    try {
      const user = await auth.getCurrentUser();
      if (user) {
        const perms = await getUserPermissions(user.id);
        set({ currentUser: user, userPermissions: perms });
      }
    } catch (e) {
      console.error('Auth check failed:', e);
    }
  },

  // Task management
  moveTask: async (taskId, newStatus) => {
    const { tasks } = get();
    const updated = tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    set({ tasks: updated });
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  },
  addTask: async (task) => {
    const { tasks } = get();
    set({ tasks: [...tasks, { ...task, subtasks: [], dependencies: [] }] });
    await supabase.from('tasks').insert(task);
  },
  updateTask: async (id, updates) => {
    const { tasks } = get();
    const updated = tasks.map(t => (t.id === id ? { ...t, ...updates } : t));
    set({ tasks: updated });
    await supabase.from('tasks').update(updates).eq('id', id);
  },
  deleteTask: async (id) => {
    const { tasks } = get();
    set({ tasks: tasks.filter(t => t.id !== id) });
    await supabase.from('tasks').delete().eq('id', id);
  },
  addWorkflowTemplate: async (template) => {
    const { workflowTemplates } = get();
    set({ workflowTemplates: [...workflowTemplates, template] });
    await supabase.from('workflow_templates').insert(template);
  },
  deleteWorkflowTemplate: async (id) => {
    const { workflowTemplates } = get();
    set({ workflowTemplates: workflowTemplates.filter(t => t.id !== id) });
    await supabase.from('workflow_templates').delete().eq('id', id);
  },
}));
