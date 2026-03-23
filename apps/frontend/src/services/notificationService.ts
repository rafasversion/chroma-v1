import { fetchApi } from './api';
import type { NotificationAPI } from '../types/notificationApi';

export const getNotificationsService = async () => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ notifications: NotificationAPI[]; unread: number }>('/api/notifications', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markNotificationsAsReadService = async () => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ success: boolean }>('/api/notifications/read', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};