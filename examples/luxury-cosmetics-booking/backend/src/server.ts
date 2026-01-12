import 'dotenv/config';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { createAuthMiddleware, createAuthRoutes, corsMiddleware } from '@polaris/authentication';
import { log } from '@polaris/logger';
import productsRoutes from './routes/products.js';
import bookingsRoutes from './routes/bookings.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(
  corsMiddleware([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
  ])
);

// Middleware
app.use(express.json());

// Log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  log.info('Incoming request', {
    method: req.method,
    path: req.path,
  });
  next();
});

// Mock authentication middleware (dev only)
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    email: process.env.DEV_USER_EMAIL || 'demo.user@loreal.com',
    name: process.env.DEV_USER_NAME || 'Demo User',
    sub: process.env.DEV_USER_SUB || 'demo-user-123',
  };
  next();
};

// Public routes
app.get('/health', (req: Request, res: Response) => {
  log.info('Health check requested');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Auth routes
const authRoutes = createAuthRoutes();
app.get('/api/auth/me', authMiddleware, authRoutes.me);

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/bookings', authMiddleware, bookingsRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error('Server error', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  log.info('🚀 Luxury Cosmetics Booking API started', {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
  });
  console.log(`\n✨ L'Oréal Luxury Cosmetics Booking API`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`� Mock user: ${process.env.DEV_USER_EMAIL || 'demo.user@loreal.com'}\n`);
});
