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
  videoFeedback,
  comments,
  reactions,
  bookmarks,
  articles,
  surveyResponses,
} from '@shared/schema';
import { and } from 'drizzle-orm';

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
      // Ensure userId is present
      if (!data.userId) {
        throw new Error('userId is required');
      }
      
      // Map the incoming data to match the schema
      const profileInsert = {
        userId: data.userId,
        username: data.username,
        displayName: data.displayName || null,
        bio: data.bio || null,
        location: data.location || null,
        playingExperience: data.playingExperience || null,
        preferredPlayStyle: data.preferredPlayStyle || null,
        sportId: data.sportId || null,
      };

      console.log('Creating profile with data:', profileInsert);
      
      const created = await db.insert(profiles).values(profileInsert).returning();
      console.log('Profile created successfully:', created[0]);
      return created[0] || null;
    } catch (error) {
      console.error('Profile creation error:', error);
      throw new Error(`Failed to create profile: ${error instanceof Error ? error.message : error}`);
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

// Survey routes - COMPLETE CRUD
export const surveyRoutes = {
  async getSurveyResponse(userId: string) {
    try {
      const survey = await db.select().from(surveyResponses).where(eq(surveyResponses.userId, userId as any)).limit(1);
      return survey[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch survey: ${error}`);
    }
  },

  async createSurveyResponse(data: any) {
    try {
      if (!data.userId) {
        throw new Error('userId is required');
      }

      const surveyInsert = {
        userId: data.userId,
        leagueRating: data.leagueRating || null,
        tournamentRating: data.tournamentRating || null,
        tournamentsYearly: data.tournamentsYearly || null,
        leagueFrequency: data.leagueFrequency || null,
        purposeOfPlay: data.purposeOfPlay || null,
        practiceTime: data.practiceTime || null,
        coachingFrequency: data.coachingFrequency || null,
        favoriteClubs: data.favoriteClubs || null,
      };

      console.log('Creating survey response with data:', surveyInsert);

      const created = await db.insert(surveyResponses).values(surveyInsert).returning();
      console.log('Survey response created successfully:', created[0]);
      return created[0] || null;
    } catch (error) {
      console.error('Survey creation error:', error);
      throw new Error(`Failed to create survey: ${error instanceof Error ? error.message : error}`);
    }
  },

  async updateSurveyResponse(userId: string, data: any) {
    try {
      const surveyInsert = {
        leagueRating: data.leagueRating || null,
        tournamentRating: data.tournamentRating || null,
        tournamentsYearly: data.tournamentsYearly || null,
        leagueFrequency: data.leagueFrequency || null,
        purposeOfPlay: data.purposeOfPlay || null,
        practiceTime: data.practiceTime || null,
        coachingFrequency: data.coachingFrequency || null,
        favoriteClubs: data.favoriteClubs || null,
        updatedAt: new Date(),
      };

      const updated = await db
        .update(surveyResponses)
        .set(surveyInsert)
        .where(eq(surveyResponses.userId, userId as any))
        .returning();

      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update survey: ${error}`);
    }
  },

  async deleteSurveyResponse(userId: string) {
    try {
      await db.delete(surveyResponses).where(eq(surveyResponses.userId, userId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete survey: ${error}`);
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

// Video Feedback routes
export const videoFeedbackRoutes = {
  async getFeedback(videoId: string) {
    try {
      return await db.select().from(videoFeedback).where(eq(videoFeedback.videoId, videoId as any));
    } catch (error) {
      throw new Error(`Failed to fetch feedback: ${error}`);
    }
  },

  async createFeedback(data: any) {
    try {
      const created = await db.insert(videoFeedback).values(data).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to create feedback: ${error}`);
    }
  },

  async updateFeedback(feedbackId: string, data: any) {
    try {
      const updated = await db
        .update(videoFeedback)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(videoFeedback.id, feedbackId as any))
        .returning();
      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update feedback: ${error}`);
    }
  },

  async deleteFeedback(feedbackId: string) {
    try {
      await db.delete(videoFeedback).where(eq(videoFeedback.id, feedbackId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete feedback: ${error}`);
    }
  },
};

// Comments routes
export const commentRoutes = {
  async getComments(articleId: string) {
    try {
      return await db.select().from(comments).where(eq(comments.articleId, articleId as any));
    } catch (error) {
      throw new Error(`Failed to fetch comments: ${error}`);
    }
  },

  async createComment(data: any) {
    try {
      const created = await db.insert(comments).values(data).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to create comment: ${error}`);
    }
  },

  async updateComment(commentId: string, data: any) {
    try {
      const updated = await db
        .update(comments)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(comments.id, commentId as any))
        .returning();
      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update comment: ${error}`);
    }
  },

  async deleteComment(commentId: string) {
    try {
      await db.delete(comments).where(eq(comments.id, commentId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error}`);
    }
  },
};

// Reactions routes
export const reactionRoutes = {
  async getReactions(contentType: string, contentId: string) {
    try {
      return await db
        .select()
        .from(reactions)
        .where(and(
          eq(reactions.contentType, contentType),
          eq(reactions.contentId, contentId as any)
        ));
    } catch (error) {
      throw new Error(`Failed to fetch reactions: ${error}`);
    }
  },

  async addReaction(data: any) {
    try {
      const created = await db.insert(reactions).values(data).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to add reaction: ${error}`);
    }
  },

  async removeReaction(userId: string, contentType: string, contentId: string) {
    try {
      await db
        .delete(reactions)
        .where(
          and(
            eq(reactions.userId, userId as any),
            eq(reactions.contentType, contentType),
            eq(reactions.contentId, contentId as any)
          )
        );
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove reaction: ${error}`);
    }
  },
};

// Bookmarks routes
export const bookmarkRoutes = {
  async getBookmarks(userId: string) {
    try {
      return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId as any));
    } catch (error) {
      throw new Error(`Failed to fetch bookmarks: ${error}`);
    }
  },

  async addBookmark(data: any) {
    try {
      const created = await db.insert(bookmarks).values(data).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to add bookmark: ${error}`);
    }
  },

  async removeBookmark(userId: string, contentType: string, contentId: string) {
    try {
      await db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, userId as any),
            eq(bookmarks.contentType, contentType),
            eq(bookmarks.contentId, contentId as any)
          )
        );
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove bookmark: ${error}`);
    }
  },
};
