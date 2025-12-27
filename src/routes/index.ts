import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import visitRequestRoutes from './visitRequest.routes';
import applicationRoutes from './application.routes';
import favoriteRoutes from './favorite.routes';
import chatRoutes from './chat.routes';
import reviewRoutes from './review.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'House Rent API is running',
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRoutes);
router.use('/users', authRoutes);
router.use('/', propertyRoutes);
router.use('/', visitRequestRoutes);
router.use('/', applicationRoutes);
router.use('/', favoriteRoutes);
router.use('/', chatRoutes);
router.use('/', reviewRoutes);

export default router;