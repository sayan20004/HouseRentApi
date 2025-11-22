import { Router } from 'express';
import * as favoriteController from '../controllers/favorite.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { propertyIdSchema } from '../validations/property.validation';

const router = Router();

/**
 * @route   POST /api/v1/properties/:id/favorite
 * @desc    Add property to favorites
 * @access  Private
 */
router.post(
    '/properties/:id/favorite',
    authenticate,
    validate(propertyIdSchema, 'params'),
    favoriteController.addFavorite
);

/**
 * @route   DELETE /api/v1/properties/:id/favorite
 * @desc    Remove property from favorites
 * @access  Private
 */
router.delete(
    '/properties/:id/favorite',
    authenticate,
    validate(propertyIdSchema, 'params'),
    favoriteController.removeFavorite
);

/**
 * @route   GET /api/v1/favorites
 * @desc    Get user's favorite properties
 * @access  Private
 */
router.get('/favorites', authenticate, favoriteController.getFavorites);

export default router;
