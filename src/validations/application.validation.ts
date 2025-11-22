import { z } from 'zod';
import { ApplicationStatus } from '../models/RentalApplication';

/**
 * Create rental application validation schema
 */
export const createApplicationSchema = z.object({
    message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
    monthlyRentOffered: z.number().min(0, 'Rent offered cannot be negative').optional(),
    moveInDate: z
        .string()
        .or(z.date())
        .transform(val => new Date(val))
        .refine(date => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
            message: 'Move-in date must be today or in the future',
        }),
});

/**
 * Update application status validation schema
 */
export const updateApplicationStatusSchema = z.object({
    status: z.enum([
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.CANCELLED,
    ]),
});

/**
 * Application ID param validation schema
 */
export const applicationIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid application ID'),
});
