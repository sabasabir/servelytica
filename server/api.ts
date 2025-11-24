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

  app.get('/api/coaches', async (req: any, res: any) => {
    try {
      const coaches = await coachRoutes.getAllCoaches();
      sendJson(res, coaches);
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
}
