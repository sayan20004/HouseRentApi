import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import visitRequestRoutes from './visitRequest.routes';
import applicationRoutes from './application.routes';
import favoriteRoutes from './favorite.routes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'House Rent API is running',
        timestamp: new Date().toISOString(),
    });
});

/**
 * API routes
 */
router.use('/auth', authRoutes);
router.use('/users', authRoutes); // User profile routes
router.use('/', propertyRoutes); // Property routes
router.use('/', visitRequestRoutes); // Visit request routes
router.use('/', applicationRoutes); // Application routes
router.use('/', favoriteRoutes); // Favorite routes

export default router;
