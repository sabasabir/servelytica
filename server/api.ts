// Express API middleware for handling database requests
import {
  profileRoutes,
  videoRoutes,
  coachRoutes,
  userRoleRoutes,
  subscriptionRoutes,
  videoFeedbackRoutes,
  commentRoutes,
  reactionRoutes,
  bookmarkRoutes,
  surveyRoutes,
  connectionRequestRoutes,
  connectionRoutes,
  analysisSessionRoutes,
  featuredCoachesRoutes,
} from './routes';

const sendJson = (res: any, data: any, status = 200) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(JSON.stringify(data));
};

const sendError = (res: any, error: any, status = 400) => {
  sendJson(res, { error: error instanceof Error ? error.message : 'Unknown error' }, status);
};

export function setupApiRoutes(app: any) {
  // Profile endpoints
  app.get('/api/profiles/:userId', async (req: any, res: any) => {
    try {
      const profile = await profileRoutes.getProfile(req.params.userId);
      if (!profile) {
        return sendError(res, 'Profile not found', 404);
      }
      sendJson(res, profile);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/profiles/:userId', async (req: any, res: any) => {
    try {
      const profile = await profileRoutes.updateProfile(req.params.userId, req.body);
      sendJson(res, profile);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/profiles', async (req: any, res: any) => {
    try {
      const profile = await profileRoutes.createProfile(req.body);
      sendJson(res, profile, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Video endpoints
  app.get('/api/videos', async (req: any, res: any) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return sendError(res, 'userId query parameter required', 400);
      }
      const videos = await videoRoutes.getVideos(userId);
      sendJson(res, videos);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/videos/:videoId', async (req: any, res: any) => {
    try {
      const video = await videoRoutes.getVideo(req.params.videoId);
      if (!video) {
        return sendError(res, 'Video not found', 404);
      }
      sendJson(res, video);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/videos', async (req: any, res: any) => {
    try {
      const video = await videoRoutes.createVideo(req.body);
      sendJson(res, video, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/videos/:videoId', async (req: any, res: any) => {
    try {
      const video = await videoRoutes.updateVideo(req.params.videoId, req.body);
      sendJson(res, video);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/videos/:videoId', async (req: any, res: any) => {
    try {
      const result = await videoRoutes.deleteVideo(req.params.videoId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Coach endpoints
  // Coach endpoints - COMPLETE CRUD
  app.get('/api/coaches/profile/:userId', async (req: any, res: any) => {
    try {
      const coach = await coachRoutes.getCoachProfile(req.params.userId);
      if (!coach) {
        return sendError(res, 'Coach profile not found', 404);
      }
      sendJson(res, coach);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/coaches/:coachId', async (req: any, res: any) => {
    try {
      const coach = await coachRoutes.getCoachById(req.params.coachId);
      if (!coach) {
        return sendError(res, 'Coach not found', 404);
      }
      sendJson(res, coach);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/coaches', async (req: any, res: any) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const coaches = await coachRoutes.getAllCoaches(limit);
      sendJson(res, coaches);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/coaches', async (req: any, res: any) => {
    try {
      const coach = await coachRoutes.createCoachProfile(req.body);
      sendJson(res, coach, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/coaches/profile/:userId', async (req: any, res: any) => {
    try {
      const coach = await coachRoutes.updateCoachProfile(req.params.userId, req.body);
      sendJson(res, coach);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/coaches/profile/:userId', async (req: any, res: any) => {
    try {
      const result = await coachRoutes.deleteCoachProfile(req.params.userId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/coaches/search/:query', async (req: any, res: any) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const coaches = await coachRoutes.searchCoaches(req.params.query, limit);
      sendJson(res, coaches);
    } catch (error) {
      sendError(res, error);
    }
  });

  // User Roles endpoints
  app.get('/api/user-roles/:userId', async (req: any, res: any) => {
    try {
      const roles = await userRoleRoutes.getUserRoles(req.params.userId);
      sendJson(res, roles);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Subscription endpoints
  app.get('/api/subscriptions/:userId', async (req: any, res: any) => {
    try {
      const subscription = await subscriptionRoutes.getUserSubscription(req.params.userId);
      sendJson(res, subscription);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/pricing', async (req: any, res: any) => {
    try {
      const plans = await subscriptionRoutes.getPricingPlans();
      sendJson(res, plans);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Video Feedback endpoints
  app.get('/api/feedback/:videoId', async (req: any, res: any) => {
    try {
      const feedback = await videoFeedbackRoutes.getFeedback(req.params.videoId);
      sendJson(res, feedback);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/feedback', async (req: any, res: any) => {
    try {
      const feedback = await videoFeedbackRoutes.createFeedback(req.body);
      sendJson(res, feedback, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/feedback/:feedbackId', async (req: any, res: any) => {
    try {
      const feedback = await videoFeedbackRoutes.updateFeedback(req.params.feedbackId, req.body);
      sendJson(res, feedback);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/feedback/:feedbackId', async (req: any, res: any) => {
    try {
      const result = await videoFeedbackRoutes.deleteFeedback(req.params.feedbackId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Comments endpoints
  app.get('/api/comments/:articleId', async (req: any, res: any) => {
    try {
      const cmts = await commentRoutes.getComments(req.params.articleId);
      sendJson(res, cmts);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/comments', async (req: any, res: any) => {
    try {
      const comment = await commentRoutes.createComment(req.body);
      sendJson(res, comment, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/comments/:commentId', async (req: any, res: any) => {
    try {
      const comment = await commentRoutes.updateComment(req.params.commentId, req.body);
      sendJson(res, comment);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/comments/:commentId', async (req: any, res: any) => {
    try {
      const result = await commentRoutes.deleteComment(req.params.commentId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Reactions endpoints
  app.get('/api/reactions', async (req: any, res: any) => {
    try {
      const contentType = req.query.contentType;
      const contentId = req.query.contentId;
      if (!contentType || !contentId) {
        return sendError(res, 'contentType and contentId required', 400);
      }
      const reacts = await reactionRoutes.getReactions(contentType, contentId);
      sendJson(res, reacts);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/reactions', async (req: any, res: any) => {
    try {
      const reaction = await reactionRoutes.addReaction(req.body);
      sendJson(res, reaction, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/reactions', async (req: any, res: any) => {
    try {
      const result = await reactionRoutes.removeReaction(
        req.query.userId,
        req.query.contentType,
        req.query.contentId
      );
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Bookmarks endpoints
  app.get('/api/bookmarks/:userId', async (req: any, res: any) => {
    try {
      const bm = await bookmarkRoutes.getBookmarks(req.params.userId);
      sendJson(res, bm);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/bookmarks', async (req: any, res: any) => {
    try {
      const bookmark = await bookmarkRoutes.addBookmark(req.body);
      sendJson(res, bookmark, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/bookmarks', async (req: any, res: any) => {
    try {
      const result = await bookmarkRoutes.removeBookmark(
        req.query.userId,
        req.query.contentType,
        req.query.contentId
      );
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Survey endpoints - COMPLETE CRUD
  app.get('/api/surveys/:userId', async (req: any, res: any) => {
    try {
      const survey = await surveyRoutes.getSurveyResponse(req.params.userId);
      if (!survey) {
        return sendJson(res, null);
      }
      sendJson(res, survey);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/surveys', async (req: any, res: any) => {
    try {
      const survey = await surveyRoutes.createSurveyResponse(req.body);
      sendJson(res, survey, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/surveys/:userId', async (req: any, res: any) => {
    try {
      const survey = await surveyRoutes.updateSurveyResponse(req.params.userId, req.body);
      sendJson(res, survey);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/surveys/:userId', async (req: any, res: any) => {
    try {
      const result = await surveyRoutes.deleteSurveyResponse(req.params.userId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Connection Requests endpoints - COMPLETE CRUD
  app.get('/api/connection-requests/received/:userId', async (req: any, res: any) => {
    try {
      const requests = await connectionRequestRoutes.getReceivedRequests(req.params.userId);
      sendJson(res, requests);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/connection-requests/sent/:userId', async (req: any, res: any) => {
    try {
      const requests = await connectionRequestRoutes.getSentRequests(req.params.userId);
      sendJson(res, requests);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/connection-requests', async (req: any, res: any) => {
    try {
      const request = await connectionRequestRoutes.createConnectionRequest(req.body);
      sendJson(res, request, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/connection-requests/:requestId', async (req: any, res: any) => {
    try {
      const request = await connectionRequestRoutes.updateConnectionRequest(req.params.requestId, req.body);
      sendJson(res, request);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/connection-requests/:requestId', async (req: any, res: any) => {
    try {
      const result = await connectionRequestRoutes.deleteConnectionRequest(req.params.requestId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Connections endpoints - COMPLETE CRUD
  app.get('/api/connections/:userId', async (req: any, res: any) => {
    try {
      const conns = await connectionRoutes.getUserConnections(req.params.userId);
      sendJson(res, conns);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/connections', async (req: any, res: any) => {
    try {
      const conn = await connectionRoutes.createConnection(req.body);
      sendJson(res, conn, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/connections/:connectionId', async (req: any, res: any) => {
    try {
      const conn = await connectionRoutes.updateConnection(req.params.connectionId, req.body);
      sendJson(res, conn);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/connections/:connectionId', async (req: any, res: any) => {
    try {
      const result = await connectionRoutes.deleteConnection(req.params.connectionId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Analysis Session endpoints - COMPLETE CRUD
  app.get('/api/analysis-sessions/:userId/:role', async (req: any, res: any) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const sessions = await analysisSessionRoutes.getSessions(
        req.params.userId,
        req.params.role as 'coach' | 'player',
        limit
      );
      sendJson(res, sessions);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/analysis-sessions/:sessionId', async (req: any, res: any) => {
    try {
      const session = await analysisSessionRoutes.getSessionById(req.params.sessionId);
      if (!session) {
        return sendError(res, 'Session not found', 404);
      }
      sendJson(res, session);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/analysis-sessions', async (req: any, res: any) => {
    try {
      const session = await analysisSessionRoutes.createSession(req.body);
      sendJson(res, session, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/analysis-sessions/:sessionId', async (req: any, res: any) => {
    try {
      const session = await analysisSessionRoutes.updateSession(req.params.sessionId, req.body);
      sendJson(res, session);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/analysis-sessions/:sessionId', async (req: any, res: any) => {
    try {
      const result = await analysisSessionRoutes.deleteSession(req.params.sessionId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Session Comments endpoints
  app.post('/api/analysis-sessions/:sessionId/comments', async (req: any, res: any) => {
    try {
      const comment = await analysisSessionRoutes.addSessionComment(req.body);
      sendJson(res, comment, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/analysis-sessions/:sessionId/comments', async (req: any, res: any) => {
    try {
      const comments = await analysisSessionRoutes.getSessionComments(req.params.sessionId);
      sendJson(res, comments);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/analysis-sessions/:sessionId/comments/:commentId', async (req: any, res: any) => {
    try {
      const result = await analysisSessionRoutes.deleteSessionComment(req.params.commentId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Session Notes endpoints
  app.post('/api/analysis-sessions/:sessionId/notes', async (req: any, res: any) => {
    try {
      const note = await analysisSessionRoutes.addSessionNote(req.body);
      sendJson(res, note, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/analysis-sessions/:sessionId/notes', async (req: any, res: any) => {
    try {
      const notes = await analysisSessionRoutes.getSessionNotes(req.params.sessionId);
      sendJson(res, notes);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/analysis-sessions/:sessionId/notes/:noteId', async (req: any, res: any) => {
    try {
      const result = await analysisSessionRoutes.deleteSessionNote(req.params.noteId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Featured Coaches endpoints (most specific routes first)
  app.get('/api/featured-coaches/search', async (req: any, res: any) => {
    try {
      const query = req.query.query || '';
      const results = await featuredCoachesRoutes.searchCoaches(query);
      sendJson(res, results);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/featured-coaches', async (req: any, res: any) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const coaches = await featuredCoachesRoutes.getFeaturedCoaches(limit);
      sendJson(res, coaches);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/featured-coaches', async (req: any, res: any) => {
    try {
      const coach = await featuredCoachesRoutes.addFeaturedCoach(req.body);
      sendJson(res, coach, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/featured-coaches/:coachId', async (req: any, res: any) => {
    try {
      const coach = await featuredCoachesRoutes.getFeaturedCoachById(req.params.coachId);
      if (!coach) {
        return sendError(res, 'Featured coach not found', 404);
      }
      sendJson(res, coach);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/featured-coaches/:coachId', async (req: any, res: any) => {
    try {
      const coach = await featuredCoachesRoutes.updateFeaturedCoach(req.params.coachId, req.body);
      sendJson(res, coach);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/featured-coaches/:coachId', async (req: any, res: any) => {
    try {
      const result = await featuredCoachesRoutes.removeFeaturedCoach(req.params.coachId);
      sendJson(res, result);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Dashboard endpoints
  app.get('/api/dashboard/items/:userId', async (req: any, res: any) => {
    try {
      // Return mock dashboard items - in production, fetch from database
      const items = [];
      sendJson(res, items);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post('/api/dashboard/items', async (req: any, res: any) => {
    try {
      // Create new dashboard item
      const item = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sendJson(res, item, 201);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/dashboard/items/:itemId', async (req: any, res: any) => {
    try {
      // Update dashboard item
      const item = {
        id: req.params.itemId,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      sendJson(res, item);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete('/api/dashboard/items/:itemId', async (req: any, res: any) => {
    try {
      sendJson(res, { success: true });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get('/api/dashboard/stats/:userId', async (req: any, res: any) => {
    try {
      const stats = {
        totalItems: 0,
        completedItems: 0,
        inProgressItems: 0,
      };
      sendJson(res, stats);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.put('/api/profile/:userId', async (req: any, res: any) => {
    try {
      const profile = { id: req.params.userId, ...req.body };
      sendJson(res, profile);
    } catch (error) {
      sendError(res, error);
    }
  });
}
