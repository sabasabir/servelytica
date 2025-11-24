// Express API middleware for handling database requests
import {
  profileRoutes,
  videoRoutes,
  coachRoutes,
  userRoleRoutes,
  subscriptionRoutes,
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
}
