// API Routes for database operations using Drizzle + Neon
import { eq } from 'drizzle-orm';
import { db } from './db';
import {
  profiles,
  userRoles,
  videos,
  coachProfiles,
  usersSubscription,
  pricing,
} from '@shared/schema';

export interface RouteHandler {
  [key: string]: (req: any, res: any) => Promise<void>;
}

// Helper to send JSON responses
const sendJson = (res: any, data: any, status = 200) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(JSON.stringify(data));
};

// Profile routes
export const profileRoutes = {
  async getProfile(userId: string) {
    try {
      const profile = await db.select().from(profiles).where(eq(profiles.userId, userId as any)).limit(1);
      return profile[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error}`);
    }
  },

  async updateProfile(userId: string, data: any) {
    try {
      const updated = await db
        .update(profiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profiles.userId, userId as any))
        .returning();
      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error}`);
    }
  },

  async createProfile(data: any) {
    try {
      const created = await db.insert(profiles).values(data).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to create profile: ${error}`);
    }
  },
};

// Video routes
export const videoRoutes = {
  async getVideos(userId: string) {
    try {
      const userVideos = await db.select().from(videos).where(eq(videos.userId, userId as any));
      return userVideos;
    } catch (error) {
      throw new Error(`Failed to fetch videos: ${error}`);
    }
  },

  async getVideo(videoId: string) {
    try {
      const video = await db.select().from(videos).where(eq(videos.id, videoId as any)).limit(1);
      return video[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch video: ${error}`);
    }
  },

  async createVideo(data: any) {
    try {
      const created = await db.insert(videos).values(data).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to create video: ${error}`);
    }
  },

  async updateVideo(videoId: string, data: any) {
    try {
      const updated = await db
        .update(videos)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(videos.id, videoId as any))
        .returning();
      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update video: ${error}`);
    }
  },

  async deleteVideo(videoId: string) {
    try {
      await db.delete(videos).where(eq(videos.id, videoId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete video: ${error}`);
    }
  },
};

// Coach routes
export const coachRoutes = {
  async getCoachProfile(userId: string) {
    try {
      const coach = await db
        .select()
        .from(coachProfiles)
        .where(eq(coachProfiles.userId, userId as any))
        .limit(1);
      return coach[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch coach profile: ${error}`);
    }
  },

  async getAllCoaches() {
    try {
      const coaches = await db.select().from(coachProfiles).limit(100);
      return coaches;
    } catch (error) {
      throw new Error(`Failed to fetch coaches: ${error}`);
    }
  },

  async updateCoachProfile(userId: string, data: any) {
    try {
      const updated = await db
        .update(coachProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(coachProfiles.userId, userId as any))
        .returning();
      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update coach profile: ${error}`);
    }
  },
};

// User Roles routes
export const userRoleRoutes = {
  async getUserRoles(userId: string) {
    try {
      const roles = await db.select().from(userRoles).where(eq(userRoles.userId, userId as any));
      return roles;
    } catch (error) {
      throw new Error(`Failed to fetch user roles: ${error}`);
    }
  },
};

// Subscription routes
export const subscriptionRoutes = {
  async getUserSubscription(userId: string) {
    try {
      const subscription = await db
        .select()
        .from(usersSubscription)
        .where(eq(usersSubscription.userId, userId as any))
        .limit(1);
      return subscription[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch subscription: ${error}`);
    }
  },

  async getPricingPlans() {
    try {
      const plans = await db.select().from(pricing);
      return plans;
    } catch (error) {
      throw new Error(`Failed to fetch pricing plans: ${error}`);
    }
  },
};
