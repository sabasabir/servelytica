// Express middleware setup for API routes
import type { Express, Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
  };
}

// CORS middleware
export function setupCors(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

// Body parser middleware (basic JSON)
export function setupBodyParser(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    let body = '';
    req.setEncoding('utf8');

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      if (req.headers['content-type']?.includes('application/json') && body) {
        try {
          (req as any).body = JSON.parse(body);
        } catch (e) {
          (req as any).body = {};
        }
      } else {
        (req as any).body = {};
      }
      next();
    });
  });
}

// Error handler
export function setupErrorHandler(app: Express) {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });
}

// Health check endpoint
export function setupHealthCheck(app: Express) {
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}
