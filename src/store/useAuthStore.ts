import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number | string;
  name: string;
  email: string;
  imageUrl?: string | null;
  bio?: string | null;
}

interface Preferences {
  theme?: "light" | "dark" | "system";
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

interface Notification {
  id: number | string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedInvestmentId?: number | string | null;
}

interface AuthState {
  // User state
  user: User | null;
  role: "Investor" | "Admin" | "Company" | null;
  isAuthenticated: boolean;
  
  // Preferences
  preferences: Preferences;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  setUser: (user: User | null) => void;
  setRole: (role: "Investor" | "Admin" | "Company" | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setPreferences: (preferences: Partial<Preferences>) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: number | string) => void;
  markAllNotificationsAsRead: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      role: null,
      isAuthenticated: false,
      preferences: {
        theme: "system",
        language: "en",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
      notifications: [],
      unreadCount: 0,

      // Actions
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markNotificationAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      clearAuth: () =>
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          notifications: [],
          unreadCount: 0,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
        // Don't persist notifications - they should be fetched fresh
      }),
    }
  )
);

