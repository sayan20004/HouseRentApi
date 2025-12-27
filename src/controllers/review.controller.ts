import { Response, NextFunction } from 'express';
import { Review } from '../models/Review';
import { successResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth';
import { BadRequestError } from '../utils/ApiError';

export const createReview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { propertyId, userId, rating, comment } = req.body;
        const reviewerId = req.user!.userId;

        if (userId === reviewerId) {
            throw new BadRequestError('You cannot review yourself');
        }

        const reviewData: any = {
            reviewer: reviewerId,
            rating,
            comment
        };

        if (propertyId) reviewData.property = propertyId;
        if (userId) reviewData.user = userId;

        const review = await Review.create(reviewData);
        await review.populate('reviewer', 'name');

        res.status(201).json(successResponse(review, 'Review submitted successfully'));
    } catch (error) {
        next(error);
    }
};

export const getPropertyReviews = async (
    req: AuthRequest | any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ property: id })
            .sort({ createdAt: -1 })
            .populate('reviewer', 'name');
            
        res.json(successResponse(reviews));
    } catch (error) {
        next(error);
    }
};