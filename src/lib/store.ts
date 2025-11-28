import { create } from 'zustand';
import { User, Site, Task, Notification, Story, USERS, SITES, TASKS, NOTIFICATIONS, STORIES, Role } from './mockData';

interface AppState {
  currentUser: User | null;
  sites: Site[];
  tasks: Task[];
  stories: Story[];
  notifications: Notification[];

  // Actions
  login: (role: Role) => void;
  logout: () => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  addNotification: (notification: Notification) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  sites: SITES,
  tasks: TASKS,
  stories: STORIES,
  notifications: NOTIFICATIONS,

  login: (role: Role) => {
    const user = USERS.find(u => u.role === role);
    if (user) {
      set({ currentUser: user });
    }
  },

  logout: () => set({ currentUser: null }),

  addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),

  updateSite: (id, updates) => set((state) => ({
    sites: state.sites.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
  })),

  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),

  updateStory: (id, updates) => set((state) => ({
    stories: state.stories.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
}));
