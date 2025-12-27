import { z } from 'zod';

export const createReviewSchema = z.object({
    propertyId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
}).refine(data => data.propertyId || data.userId, {
    message: "Must review either a property or a user"
});