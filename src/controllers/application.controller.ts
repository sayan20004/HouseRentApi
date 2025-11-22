import { Response, NextFunction } from 'express';
import { RentalApplication } from '../models/RentalApplication';
import { Property } from '../models/Property';
import { successResponse } from '../utils/ApiResponse';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

/**
 * Create rental application
 * POST /properties/:id/applications
 */
export const createApplication = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id: propertyId } = req.params;
        const { message, monthlyRentOffered, moveInDate } = req.body;

        // Find property
        const property = await Property.findById(propertyId);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        // Check if user is trying to apply for their own property
        if (property.owner.toString() === req.user!.userId) {
            throw new BadRequestError('You cannot apply for your own property');
        }

        // Create application
        const application = await RentalApplication.create({
            property: propertyId,
            tenant: req.user!.userId,
            owner: property.owner,
            message,
            monthlyRentOffered,
            moveInDate,
        });

        await application.populate([
            { path: 'property', select: 'title' },
            { path: 'tenant', select: 'name email phone' },
            { path: 'owner', select: 'name email phone' },
        ]);

        res.status(201).json(successResponse(application, 'Application submitted successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Get tenant's applications
 * GET /applications/me
 */
export const getTenantApplications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const applications = await RentalApplication.find({ tenant: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate('property', 'title location rent')
            .populate('owner', 'name email phone');

        res.json(successResponse(applications));
    } catch (error) {
        next(error);
    }
};

/**
 * Get owner's applications
 * GET /owner/applications
 */
export const getOwnerApplications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const applications = await RentalApplication.find({ owner: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate('property', 'title location rent')
            .populate('tenant', 'name email phone');

        res.json(successResponse(applications));
    } catch (error) {
        next(error);
    }
};

/**
 * Update application status
 * PATCH /applications/:id
 */
export const updateApplicationStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find application
        const application = await RentalApplication.findById(id);
        if (!application) {
            throw new NotFoundError('Application not found');
        }

        // Verify ownership (only property owner can update status)
        if (application.owner.toString() !== req.user!.userId) {
            throw new ForbiddenError('You are not authorized to update this application');
        }

        // Update status
        application.status = status;
        await application.save();
        await application.populate([
            { path: 'property', select: 'title' },
            { path: 'tenant', select: 'name email phone' },
            { path: 'owner', select: 'name email phone' },
        ]);

        res.json(successResponse(application, 'Application status updated successfully'));
    } catch (error) {
        next(error);
    }
};
