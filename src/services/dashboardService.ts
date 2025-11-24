// Dashboard Service - Handles all CRUD operations for user dashboard
import { supabase } from '@/integrations/supabase/client';

export interface DashboardItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'goal' | 'note' | 'task' | 'achievement';
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const DashboardService = {
  // Fetch all dashboard items for user
  async getDashboardItems(userId: string): Promise<DashboardItem[]> {
    try {
      const response = await fetch(`/api/dashboard/items/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard items:', error);
      return [];
    }
  },

  // Create new dashboard item
  async createDashboardItem(item: Omit<DashboardItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DashboardItem | null> {
    try {
      const response = await fetch('/api/dashboard/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to create dashboard item');
      return await response.json();
    } catch (error) {
      console.error('Error creating dashboard item:', error);
      throw error;
    }
  },

  // Update dashboard item
  async updateDashboardItem(itemId: string, updates: Partial<DashboardItem>): Promise<DashboardItem | null> {
    try {
      const response = await fetch(`/api/dashboard/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update dashboard item');
      return await response.json();
    } catch (error) {
      console.error('Error updating dashboard item:', error);
      throw error;
    }
  },

  // Delete dashboard item
  async deleteDashboardItem(itemId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/dashboard/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete dashboard item');
      return true;
    } catch (error) {
      console.error('Error deleting dashboard item:', error);
      throw error;
    }
  },

  // Get dashboard stats
  async getDashboardStats(userId: string) {
    try {
      const response = await fetch(`/api/dashboard/stats/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { totalItems: 0, completedItems: 0, inProgressItems: 0 };
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};
