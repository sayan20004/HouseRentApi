import { z } from 'zod';
import { UserRole } from '../models/User';

/**
 * Register validation schema
 */
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be a valid 10-digit number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum([UserRole.TENANT, UserRole.OWNER]).optional().default(UserRole.TENANT),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^[0-9]{10}$/).optional(),
});

/**
 * Convert to owner validation schema
 */
export const convertToOwnerSchema = z.object({
    confirmRole: z.literal('owner', {
        errorMap: () => ({ message: 'Must confirm role as owner' }),
    }),
});
