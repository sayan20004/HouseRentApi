import { z } from 'zod';
import { PropertyType, Furnishing, AllowedTenants } from '../models/Property';

const locationSchema = z.object({
    city: z.string().min(1, 'City is required'),
    area: z.string().min(1, 'Area is required'),
    landmark: z.string().optional(),
    pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be a valid 6-digit number'),
    geo: z
        .object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
        })
        .optional(),
});

const maintenanceSchema = z.object({
    amount: z.number().min(0, 'Maintenance amount cannot be negative').default(0),
    included: z.boolean().default(false),
});

export const createPropertySchema = z.object({
    title: z.string().min(10, 'Title must be at least 10 characters').max(200),
    description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
    propertyType: z.enum([
        PropertyType.APARTMENT,
        PropertyType.INDEPENDENT_HOUSE,
        PropertyType.PG,
        PropertyType.STUDIO,
        PropertyType.SHARED_FLAT,
    ]),
    bhk: z.number().int().min(1, 'BHK must be at least 1').max(10),
    furnishing: z.enum([Furnishing.UNFURNISHED, Furnishing.SEMI_FURNISHED, Furnishing.FULLY_FURNISHED]),
    rent: z.number().min(1000, 'Rent must be at least 1000'),
    securityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
    maintenance: maintenanceSchema.optional(),
    builtUpArea: z.number().min(50, 'Built-up area must be at least 50 sq ft'),
    availableFrom: z.string().or(z.date()).transform(val => new Date(val)),
    minLockInPeriodMonths: z.number().int().min(0).max(36).optional().default(0),
    allowedTenants: z
        .enum([AllowedTenants.FAMILY, AllowedTenants.BACHELORS, AllowedTenants.STUDENTS, AllowedTenants.ANY])
        .optional()
        .default(AllowedTenants.ANY),
    petsAllowed: z.boolean().optional().default(false),
    smokingAllowed: z.boolean().optional().default(false),
    location: locationSchema,
    amenities: z.array(z.string()).optional().default([]),
    images: z.array(z.string().url('Each image must be a valid URL')).optional().default([]),
});

export const updatePropertySchema = createPropertySchema.partial();

export const searchPropertySchema = z.object({
    city: z.string().optional(),
    area: z.string().optional(),
    minRent: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    maxRent: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    bhk: z.string().transform(Number).pipe(z.number().int().min(1)).optional(),
    furnishing: z.enum([Furnishing.UNFURNISHED, Furnishing.SEMI_FURNISHED, Furnishing.FULLY_FURNISHED]).optional(),
    propertyType: z
        .enum([
            PropertyType.APARTMENT,
            PropertyType.INDEPENDENT_HOUSE,
            PropertyType.PG,
            PropertyType.STUDIO,
            PropertyType.SHARED_FLAT,
        ])
        .optional(),
    allowedTenants: z
        .enum([AllowedTenants.FAMILY, AllowedTenants.BACHELORS, AllowedTenants.STUDENTS, AllowedTenants.ANY])
        .optional(),
    petsAllowed: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    sortBy: z.enum(['newest', 'rent_low_to_high', 'rent_high_to_low']).optional().default('newest'),
    page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('10'),
    lat: z.string().transform(Number).pipe(z.number().min(-90).max(90)).optional(),
    lng: z.string().transform(Number).pipe(z.number().min(-180).max(180)).optional(),
    radius: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

export const propertyIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID'),
});