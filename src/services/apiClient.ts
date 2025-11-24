// API Client for server-side database operations using Neon
// This replaces direct Supabase database queries

const API_BASE_URL = typeof window !== 'undefined' ? '' : 'http://localhost:5000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'API request failed',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Profile API endpoints
export const profileApi = {
  async getProfile(userId: string) {
    return apiCall(`/profiles/${userId}`);
  },
  
  async updateProfile(userId: string, profile: any) {
    return apiCall(`/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async createProfile(profile: any) {
    return apiCall('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },
};

// Video API endpoints
export const videoApi = {
  async getVideos(userId: string) {
    return apiCall(`/videos?userId=${userId}`);
  },

  async getVideo(videoId: string) {
    return apiCall(`/videos/${videoId}`);
  },

  async createVideo(video: any) {
    return apiCall('/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
  },

  async updateVideo(videoId: string, video: any) {
    return apiCall(`/videos/${videoId}`, {
      method: 'PUT',
      body: JSON.stringify(video),
    });
  },

  async deleteVideo(videoId: string) {
    return apiCall(`/videos/${videoId}`, {
      method: 'DELETE',
    });
  },
};

// Coach API endpoints
export const coachApi = {
  async getCoachProfile(userId: string) {
    return apiCall(`/coaches/profile/${userId}`);
  },

  async getAllCoaches() {
    return apiCall('/coaches');
  },

  async updateCoachProfile(userId: string, profile: any) {
    return apiCall(`/coaches/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },
};

// User Roles API endpoints
export const userRoleApi = {
  async getUserRoles(userId: string) {
    return apiCall(`/user-roles/${userId}`);
  },
};

// Subscription API endpoints
export const subscriptionApi = {
  async getUserSubscription(userId: string) {
    return apiCall(`/subscriptions/${userId}`);
  },
};
