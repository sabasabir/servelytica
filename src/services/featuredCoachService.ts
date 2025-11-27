// Featured Coaches Service - Handles API calls for featured coaches management
export const FeaturedCoachService = {
  async getFeaturedCoaches(limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`/api/featured-coaches?limit=${limit}`);
      if (!response.ok) {
        console.warn('Featured coaches API returned:', response.status);
        return [];
      }
      const text = await response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error fetching featured coaches:', error);
      return [];
    }
  },

  async getFeaturedCoachById(coachId: string): Promise<any> {
    try {
      const response = await fetch(`/api/featured-coaches/${coachId}`);
      if (!response.ok) throw new Error('Failed to fetch featured coach');
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured coach:', error);
      return null;
    }
  },

  async addFeaturedCoach(coachId: string, displayOrder: number, featured_since?: string): Promise<any> {
    try {
      const response = await fetch('/api/featured-coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId,
          displayOrder,
          featured_since,
        }),
      });
      if (!response.ok) throw new Error('Failed to add featured coach');
      return await response.json();
    } catch (error) {
      console.error('Error adding featured coach:', error);
      throw error;
    }
  },

  async updateFeaturedCoach(coachId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`/api/featured-coaches/${coachId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update featured coach');
      return await response.json();
    } catch (error) {
      console.error('Error updating featured coach:', error);
      throw error;
    }
  },

  async removeFeaturedCoach(coachId: string): Promise<any> {
    try {
      const response = await fetch(`/api/featured-coaches/${coachId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove featured coach');
      return await response.json();
    } catch (error) {
      console.error('Error removing featured coach:', error);
      throw error;
    }
  },

  async searchCoaches(query: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/featured-coaches/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search coaches');
      return await response.json();
    } catch (error) {
      console.error('Error searching coaches:', error);
      return [];
    }
  },
};
