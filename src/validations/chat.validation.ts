import { z } from 'zod';

export const startConversationSchema = z.object({
    propertyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID'),
    ownerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid owner ID'),
});

export const sendMessageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').max(1000),
});

export const conversationIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation ID'),
});