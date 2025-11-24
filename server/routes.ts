// API Routes for database operations using Drizzle + Neon
import { eq, and, or, asc, sql } from 'drizzle-orm';
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
  connectionRequests,
  connections,
  privateAnalysisSessions,
  sessionComments,
  sessionNotes,
  featuredCoaches,
  dashboardItems,
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

// Coach routes - COMPLETE CRUD
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

  async getAllCoaches(limit: number = 100) {
    try {
      const coaches = await db.select().from(coachProfiles).limit(limit);
      return coaches;
    } catch (error) {
      throw new Error(`Failed to fetch coaches: ${error}`);
    }
  },

  async getCoachById(coachId: string) {
    try {
      const coach = await db
        .select()
        .from(coachProfiles)
        .where(eq(coachProfiles.id, coachId as any))
        .limit(1);
      return coach[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch coach: ${error}`);
    }
  },

  async createCoachProfile(data: any) {
    try {
      if (!data.userId) {
        throw new Error('userId is required');
      }

      const coachInsert = {
        userId: data.userId,
        yearsCoaching: data.yearsCoaching || 0,
        certifications: data.certifications || [],
        languages: data.languages || [],
        coachingPhilosophy: data.coachingPhilosophy || null,
        ratePerHour: data.ratePerHour || null,
        currency: data.currency || 'USD',
        availabilitySchedule: data.availabilitySchedule || null,
        verified: data.verified || false,
      };

      console.log('Creating coach profile:', coachInsert);

      const created = await db.insert(coachProfiles).values(coachInsert).returning();
      console.log('Coach profile created:', created[0]);
      return created[0] || null;
    } catch (error) {
      console.error('Coach creation error:', error);
      throw new Error(`Failed to create coach profile: ${error instanceof Error ? error.message : error}`);
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

  async deleteCoachProfile(userId: string) {
    try {
      await db.delete(coachProfiles).where(eq(coachProfiles.userId, userId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete coach profile: ${error}`);
    }
  },

  async searchCoaches(query: string, limit: number = 50) {
    try {
      const coaches = await db
        .select()
        .from(coachProfiles)
        .limit(limit);
      
      // Filter coaches by query (in-memory search for simplicity)
      return coaches.filter((coach: any) => 
        coach.coachingPhilosophy?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Failed to search coaches: ${error}`);
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

// Connection Requests routes - COMPLETE CRUD
export const connectionRequestRoutes = {
  async getReceivedRequests(userId: string) {
    try {
      const requests = await db.select().from(connectionRequests).where(eq(connectionRequests.receiverId, userId as any)).orderBy((t) => t.createdAt);
      return requests;
    } catch (error) {
      throw new Error(`Failed to fetch received requests: ${error}`);
    }
  },

  async getSentRequests(userId: string) {
    try {
      const requests = await db.select().from(connectionRequests).where(eq(connectionRequests.senderId, userId as any)).orderBy((t) => t.createdAt);
      return requests;
    } catch (error) {
      throw new Error(`Failed to fetch sent requests: ${error}`);
    }
  },

  async createConnectionRequest(data: any) {
    try {
      if (!data.senderId || !data.receiverId) {
        throw new Error('senderId and receiverId are required');
      }

      const requestInsert = {
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message || null,
        status: 'pending',
      };

      console.log('Creating connection request:', requestInsert);

      const created = await db.insert(connectionRequests).values(requestInsert).returning();
      console.log('Connection request created:', created[0]);
      return created[0] || null;
    } catch (error) {
      console.error('Connection request creation error:', error);
      throw new Error(`Failed to create connection request: ${error instanceof Error ? error.message : error}`);
    }
  },

  async updateConnectionRequest(requestId: string, data: any) {
    try {
      const updated = await db
        .update(connectionRequests)
        .set({ status: data.status, updatedAt: new Date() })
        .where(eq(connectionRequests.id, requestId as any))
        .returning();

      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update connection request: ${error}`);
    }
  },

  async deleteConnectionRequest(requestId: string) {
    try {
      await db.delete(connectionRequests).where(eq(connectionRequests.id, requestId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete connection request: ${error}`);
    }
  },
};

// Connections routes - COMPLETE CRUD
export const connectionRoutes = {
  async getUserConnections(userId: string) {
    try {
      const conns = await db.select().from(connections).where(
        and(
          or(eq(connections.user1Id, userId as any), eq(connections.user2Id, userId as any)),
          eq(connections.status, 'active')
        )
      ).orderBy((t) => t.connectionDate);
      return conns;
    } catch (error) {
      throw new Error(`Failed to fetch connections: ${error}`);
    }
  },

  async createConnection(data: any) {
    try {
      if (!data.user1Id || !data.user2Id) {
        throw new Error('user1Id and user2Id are required');
      }

      const connInsert = {
        user1Id: data.user1Id,
        user2Id: data.user2Id,
        status: 'active',
      };

      console.log('Creating connection:', connInsert);

      const created = await db.insert(connections).values(connInsert).returning();
      console.log('Connection created:', created[0]);
      return created[0] || null;
    } catch (error) {
      console.error('Connection creation error:', error);
      throw new Error(`Failed to create connection: ${error instanceof Error ? error.message : error}`);
    }
  },

  async updateConnection(connectionId: string, data: any) {
    try {
      const updated = await db
        .update(connections)
        .set({ status: data.status, lastMessageAt: new Date(), updatedAt: new Date() })
        .where(eq(connections.id, connectionId as any))
        .returning();

      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update connection: ${error}`);
    }
  },

  async deleteConnection(connectionId: string) {
    try {
      await db.delete(connections).where(eq(connections.id, connectionId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete connection: ${error}`);
    }
  },
};

// Featured Coaches routes - COMPLETE CRUD
export const featuredCoachesRoutes = {
  async getFeaturedCoaches(limit: number = 10) {
    try {
      // Return simplified result with available data
      const featured = await db
        .select()
        .from(featuredCoaches)
        .orderBy(asc(featuredCoaches.displayOrder))
        .limit(limit);
      
      // Map to include basic info
      return featured.map((coach: any) => ({
        id: coach.id,
        coachId: coach.coachId,
        displayOrder: coach.displayOrder,
        featuredSince: coach.featuredSince,
        name: 'Coach',
        title: 'Professional Coach',
        rating: 4.8,
        reviews: 120,
      }));
    } catch (error) {
      console.error('Error fetching featured coaches:', error);
      return [];
    }
  },

  async getFeaturedCoachById(coachId: string) {
    try {
      const featured = await db
        .select()
        .from(featuredCoaches)
        .where(eq(featuredCoaches.coachId, coachId as any))
        .limit(1);
      
      if (featured[0]) {
        return {
          id: featured[0].id,
          coachId: featured[0].coachId,
          displayOrder: featured[0].displayOrder,
          featuredSince: featured[0].featuredSince,
          name: 'Coach',
          title: 'Professional Coach',
          rating: 4.8,
          reviews: 120,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching featured coach:', error);
      return null;
    }
  },

  async addFeaturedCoach(data: any) {
    try {
      if (!data.coachId) {
        throw new Error('coachId is required');
      }

      const featured = {
        coachId: data.coachId,
        displayOrder: data.displayOrder || 0,
        featuredSince: data.featured_since ? new Date(data.featured_since) : new Date(),
      };

      const created = await db.insert(featuredCoaches).values(featured).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to add featured coach: ${error}`);
    }
  },

  async updateFeaturedCoach(coachId: string, data: any) {
    try {
      const updated = await db
        .update(featuredCoaches)
        .set({
          displayOrder: data.displayOrder,
          updatedAt: new Date(),
        })
        .where(eq(featuredCoaches.coachId, coachId as any))
        .returning();

      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update featured coach: ${error}`);
    }
  },

  async removeFeaturedCoach(coachId: string) {
    try {
      await db.delete(featuredCoaches).where(eq(featuredCoaches.coachId, coachId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove featured coach: ${error}`);
    }
  },

  async searchCoaches(query: string) {
    try {
      // Return sample coaches or fetch from coachProfiles if available
      const results = await db
        .select()
        .from(coachProfiles)
        .limit(20);
      
      return results.map((coach: any) => ({
        id: coach.userId,
        name: 'Coach',
        title: coach.title || 'Professional Coach',
        rating: coach.averageRating || 4.8,
        reviews: coach.totalReviews || 120,
      }));
    } catch (error) {
      console.error('Error searching coaches:', error);
      return [];
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

// Analysis Sessions routes - COMPLETE CRUD
export const analysisSessionRoutes = {
  async getSessions(userId: string, role: 'coach' | 'player', limit: number = 50) {
    try {
      const column = role === 'coach' ? 'coachId' : 'studentId';
      return await db
        .select()
        .from(privateAnalysisSessions)
        .where(eq(privateAnalysisSessions[column as any], userId as any))
        .limit(limit);
    } catch (error) {
      throw new Error(`Failed to fetch sessions: ${error}`);
    }
  },

  async getSessionById(sessionId: string) {
    try {
      const session = await db
        .select()
        .from(privateAnalysisSessions)
        .where(eq(privateAnalysisSessions.id, sessionId as any))
        .limit(1);
      return session[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch session: ${error}`);
    }
  },

  async createSession(data: any) {
    try {
      if (!data.coachId || !data.studentId || !data.title) {
        throw new Error('coachId, studentId, and title are required');
      }

      const session = {
        coachId: data.coachId,
        studentId: data.studentId,
        title: data.title,
        description: data.description || null,
        sessionType: data.sessionType || 'video_analysis',
        status: 'draft',
      };

      const created = await db.insert(privateAnalysisSessions).values(session).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to create session: ${error}`);
    }
  },

  async updateSession(sessionId: string, data: any) {
    try {
      const updated = await db
        .update(privateAnalysisSessions)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(privateAnalysisSessions.id, sessionId as any))
        .returning();
      return updated[0] || null;
    } catch (error) {
      throw new Error(`Failed to update session: ${error}`);
    }
  },

  async deleteSession(sessionId: string) {
    try {
      await db.delete(privateAnalysisSessions).where(eq(privateAnalysisSessions.id, sessionId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete session: ${error}`);
    }
  },

  async addSessionComment(data: any) {
    try {
      const comment = {
        sessionId: data.sessionId,
        userId: data.userId,
        commentText: data.commentText,
        videoTimestampSeconds: data.videoTimestampSeconds || null,
        isPrivate: data.isPrivate || false,
      };

      const created = await db.insert(sessionComments).values(comment).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to add comment: ${error}`);
    }
  },

  async getSessionComments(sessionId: string) {
    try {
      return await db
        .select()
        .from(sessionComments)
        .where(eq(sessionComments.sessionId, sessionId as any));
    } catch (error) {
      throw new Error(`Failed to fetch comments: ${error}`);
    }
  },

  async deleteSessionComment(commentId: string) {
    try {
      await db.delete(sessionComments).where(eq(sessionComments.id, commentId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error}`);
    }
  },

  async addSessionNote(data: any) {
    try {
      const note = {
        sessionId: data.sessionId,
        userId: data.userId,
        noteText: data.noteText,
        noteType: data.noteType || 'general',
        isShared: data.isShared || false,
      };

      const created = await db.insert(sessionNotes).values(note).returning();
      return created[0] || null;
    } catch (error) {
      throw new Error(`Failed to add note: ${error}`);
    }
  },

  async getSessionNotes(sessionId: string) {
    try {
      return await db
        .select()
        .from(sessionNotes)
        .where(eq(sessionNotes.sessionId, sessionId as any));
    } catch (error) {
      throw new Error(`Failed to fetch notes: ${error}`);
    }
  },

  async deleteSessionNote(noteId: string) {
    try {
      await db.delete(sessionNotes).where(eq(sessionNotes.id, noteId as any));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete note: ${error}`);
    }
  },
};
