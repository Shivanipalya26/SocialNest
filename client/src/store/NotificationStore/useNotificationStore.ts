import api from '@/lib/axios';
import { NotificationType } from '@/types';
import { toast } from 'sonner';
import { create } from 'zustand';

interface NotificationProps {
  isFetchingNotification: boolean;
  notifications: NotificationType[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: number) => Promise<void>;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationProps>(set => ({
  isFetchingNotification: false,
  notifications: [],
  fetchNotifications: async () => {
    set({ isFetchingNotification: true });
    try {
      const response = await api.get('/api/v1/notification/');
      console.log(response);
      set(state => {
        console.log('Previous notifications:', state.notifications);
        console.log('New notifications:', response.data.notifications);

        // Return new notifications (replace, not mutate)
        return { notifications: [...response.data.notifications] };
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ isFetchingNotification: false });
    }
  },
  markAsRead: async notificationId => {
    try {
      await api.post('/api/v1/notification/', { notificationId });
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read: ', error);
    }
  },
  markAllAsRead: async () => {
    try {
      await api.put('/api/v1/notification/');
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
  removeNotification: async notificationId => {
    try {
      await api.delete(`/api/v1/notification/${notificationId}`);
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
      }));
    } catch (error) {
      console.error('Failed to remove notifications:', error);
    }
  },
  clearAll: async () => {
    try {
      await api.delete('/api/v1/notification/clear');
      toast.success('Notifications cleared"', {
        description: 'All notifications have been removed.',
      });
      set({ notifications: [] });
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  },
}));
