import { z } from 'zod';
import { VisitRequestStatus } from '../models/VisitRequest';

/**
 * Create visit request validation schema
 */
export const createVisitRequestSchema = z.object({
    preferredDateTime: z
        .string()
        .or(z.date())
        .transform(val => new Date(val))
        .refine(date => date > new Date(), {
            message: 'Preferred date must be in the future',
        }),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Update visit request status validation schema
 */
export const updateVisitRequestStatusSchema = z.object({
    status: z.enum([
        VisitRequestStatus.ACCEPTED,
        VisitRequestStatus.REJECTED,
        VisitRequestStatus.COMPLETED,
        VisitRequestStatus.CANCELLED,
    ]),
});

/**
 * Visit request ID param validation schema
 */
export const visitRequestIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid visit request ID'),
});
