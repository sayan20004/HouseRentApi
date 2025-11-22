import { Response, NextFunction } from 'express';
import { Favorite } from '../models/Favorite';
import { Property } from '../models/Property';
import { successResponse } from '../utils/ApiResponse';
import { NotFoundError, ConflictError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

/**
 * Add property to favorites
 * POST /properties/:id/favorite
 */
export const addFavorite = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id: propertyId } = req.params;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            tenant: req.user!.userId,
            property: propertyId,
        });

        if (existingFavorite) {
            throw new ConflictError('Property already in favorites');
        }

        // Add to favorites
        const favorite = await Favorite.create({
            tenant: req.user!.userId,
            property: propertyId,
        });

        res.status(201).json(successResponse(favorite, 'Property added to favorites'));
    } catch (error) {
        next(error);
    }
};

/**
 * Remove property from favorites
 * DELETE /properties/:id/favorite
 */
export const removeFavorite = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id: propertyId } = req.params;

        const result = await Favorite.findOneAndDelete({
            tenant: req.user!.userId,
            property: propertyId,
        });

        if (!result) {
            throw new NotFoundError('Favorite not found');
        }

        res.json(successResponse({ id: result._id }, 'Property removed from favorites'));
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's favorite properties
 * GET /favorites
 */
export const getFavorites = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const favorites = await Favorite.find({ tenant: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'property',
                populate: {
                    path: 'owner',
                    select: 'name email phone',
                },
            });

        res.json(successResponse(favorites));
    } catch (error) {
        next(error);
    }
};
