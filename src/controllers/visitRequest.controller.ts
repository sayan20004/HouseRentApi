import { Response, NextFunction } from 'express';
import { VisitRequest } from '../models/VisitRequest';
import { Property } from '../models/Property';
import { successResponse } from '../utils/ApiResponse';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

/**
 * Create visit request
 * POST /properties/:id/visit-requests
 */
export const createVisitRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id: propertyId } = req.params;
        const { preferredDateTime, notes } = req.body;

        // Find property
        const property = await Property.findById(propertyId);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        // Check if user is trying to visit their own property
        if (property.owner.toString() === req.user!.userId) {
            throw new BadRequestError('You cannot request to visit your own property');
        }

        // Create visit request
        const visitRequest = await VisitRequest.create({
            property: propertyId,
            tenant: req.user!.userId,
            owner: property.owner,
            preferredDateTime,
            notes,
        });

        await visitRequest.populate([
            { path: 'property', select: 'title' },
            { path: 'tenant', select: 'name email phone' },
            { path: 'owner', select: 'name email phone' },
        ]);

        res.status(201).json(successResponse(visitRequest, 'Visit request created successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Get tenant's visit requests
 * GET /visit-requests/me
 */
export const getTenantVisitRequests = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const visitRequests = await VisitRequest.find({ tenant: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate('property', 'title location rent')
            .populate('owner', 'name email phone');

        res.json(successResponse(visitRequests));
    } catch (error) {
        next(error);
    }
};

/**
 * Get owner's visit requests
 * GET /owner/visit-requests
 */
export const getOwnerVisitRequests = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const visitRequests = await VisitRequest.find({ owner: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate('property', 'title location rent')
            .populate('tenant', 'name email phone');

        res.json(successResponse(visitRequests));
    } catch (error) {
        next(error);
    }
};

/**
 * Update visit request status
 * PATCH /visit-requests/:id
 */
export const updateVisitRequestStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find visit request
        const visitRequest = await VisitRequest.findById(id);
        if (!visitRequest) {
            throw new NotFoundError('Visit request not found');
        }

        // Verify ownership (only property owner can update status)
        if (visitRequest.owner.toString() !== req.user!.userId) {
            throw new ForbiddenError('You are not authorized to update this visit request');
        }

        // Update status
        visitRequest.status = status;
        await visitRequest.save();
        await visitRequest.populate([
            { path: 'property', select: 'title' },
            { path: 'tenant', select: 'name email phone' },
            { path: 'owner', select: 'name email phone' },
        ]);

        res.json(successResponse(visitRequest, 'Visit request status updated successfully'));
    } catch (error) {
        next(error);
    }
};
