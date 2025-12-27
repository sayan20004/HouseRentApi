import { Response, NextFunction } from 'express';
import { Property, PropertyStatus } from '../models/Property';
import { successResponse, paginatedResponse } from '../utils/ApiResponse';
import { NotFoundError, ForbiddenError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

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

export const getOwnerProperties = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const properties = await Property.find({ owner: req.user!.userId })
            .sort({ createdAt: -1 })
            .populate('owner', 'name email phone');

        res.json(successResponse(properties));
    } catch (error) {
        next(error);
    }
};

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
            lat,
            lng,
            radius = 10 
        } = req.query;

        const filter: any = { status: PropertyStatus.ACTIVE };

        if (lat && lng) {
            filter['location.geo'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $maxDistance: Number(radius) * 1000 
                }
            };
        } else {
            if (city) filter['location.city'] = new RegExp(city as string, 'i');
            if (area) filter['location.area'] = new RegExp(area as string, 'i');
        }

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

        let sort: any = { createdAt: -1 };
        if (sortBy === 'rent_low_to_high') {
            sort = { rent: 1 };
        } else if (sortBy === 'rent_high_to_low') {
            sort = { rent: -1 };
        }

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

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

export const updateProperty = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        if (property.owner.toString() !== req.user!.userId) {
            throw new ForbiddenError('You are not authorized to update this property');
        }

        Object.assign(property, req.body);
        await property.save();
        await property.populate('owner', 'name email phone');

        res.json(successResponse(property, 'Property updated successfully'));
    } catch (error) {
        next(error);
    }
};

export const deleteProperty = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        if (property.owner.toString() !== req.user!.userId) {
            throw new ForbiddenError('You are not authorized to delete this property');
        }

        property.status = PropertyStatus.PAUSED;
        await property.save();

        res.json(successResponse({ id: property._id }, 'Property deleted successfully'));
    } catch (error) {
        next(error);
    }
};