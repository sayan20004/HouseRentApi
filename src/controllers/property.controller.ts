import { Response, NextFunction } from 'express';
import { Property, PropertyStatus } from '../models/Property';
import { successResponse, paginatedResponse } from '../utils/ApiResponse';
import { NotFoundError, ForbiddenError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

/**
 * Create new property
 * POST /properties
 */
export const createProperty = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const propertyData = {
            ...req.body,
            owner: req.user!.userId,
        };

        const property = await Property.create(propertyData);
        await property.populate('owner', 'name email phone');

        res.status(201).json(successResponse(property, 'Property created successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Get owner's properties
 * GET /owner/properties
 */
export const getOwnerProperties = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // FIX 1: Added .populate() to return the full owner object instead of just ID
        const properties = await Property.find({ owner: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate('owner', 'name email phone');

        res.json(successResponse(properties));
    } catch (error) {
        next(error);
    }
};

/**
 * Get all properties with filters and pagination
 * GET /properties
 */
export const getProperties = async (
    req: AuthRequest | any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            city,
            area,
            minRent,
            maxRent,
            bhk,
            furnishing,
            propertyType,
            allowedTenants,
            petsAllowed,
            sortBy,
            page,
            limit,
        } = req.query;

        // Build filter query
        const filter: any = { status: PropertyStatus.ACTIVE };

        if (city) filter['location.city'] = new RegExp(city as string, 'i');
        if (area) filter['location.area'] = new RegExp(area as string, 'i');
        if (minRent || maxRent) {
            filter.rent = {};
            if (minRent) filter.rent.$gte = Number(minRent);
            if (maxRent) filter.rent.$lte = Number(maxRent);
        }
        if (bhk) filter.bhk = Number(bhk);
        if (furnishing) filter.furnishing = furnishing;
        if (propertyType) filter.propertyType = propertyType;
        if (allowedTenants) filter.allowedTenants = allowedTenants;
        if (petsAllowed !== undefined) filter.petsAllowed = petsAllowed === 'true';

        // Build sort query
        let sort: any = { createdAt: -1 }; // default: newest first
        if (sortBy === 'rent_low_to_high') {
            sort = { rent: 1 };
        } else if (sortBy === 'rent_high_to_low') {
            sort = { rent: -1 };
        }

        // FIX 2: Explicitly cast page and limit to Numbers
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const [properties, totalItems] = await Promise.all([
            Property.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .populate('owner', 'name email phone'),
            Property.countDocuments(filter),
        ]);

        res.json(paginatedResponse(properties, pageNum, limitNum, totalItems));
    } catch (error) {
        next(error);
    }
};

/**
 * Get property by ID
 * GET /properties/:id
 */
export const getPropertyById = async (
    req: AuthRequest | any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id).populate('owner', 'name email phone');

        if (!property) {
            throw new NotFoundError('Property not found');
        }

        res.json(successResponse(property));
    } catch (error) {
        next(error);
    }
};

/**
 * Update property
 * PATCH /properties/:id
 */
export const updateProperty = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        // Find property
        const property = await Property.findById(id);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        // Verify ownership
        if (property.owner.toString() !== req.user!.userId) {
            throw new ForbiddenError('You are not authorized to update this property');
        }

        // Update property
        Object.assign(property, req.body);
        await property.save();
        await property.populate('owner', 'name email phone');

        res.json(successResponse(property, 'Property updated successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Delete property (soft delete by marking as paused)
 * DELETE /properties/:id
 */
export const deleteProperty = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        // Find property
        const property = await Property.findById(id);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        // Verify ownership
        if (property.owner.toString() !== req.user!.userId) {
            throw new ForbiddenError('You are not authorized to delete this property');
        }

        // Soft delete by marking as paused
        property.status = PropertyStatus.PAUSED;
        await property.save();

        res.json(successResponse({ id: property._id }, 'Property deleted successfully'));
    } catch (error) {
        next(error);
    }
};