import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment variables schema using Zod for validation
 */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
    CORS_ORIGIN: z.string().default('*'),
    API_VERSION: z.string().default('v1'),
});

/**
 * Validate and parse environment variables
 */
const parseEnv = () => {
    try {
        const parsed = envSchema.parse(process.env);
        return {
            nodeEnv: parsed.NODE_ENV,
            port: parseInt(parsed.PORT, 10),
            mongodbUri: parsed.MONGODB_URI,
            jwt: {
                secret: parsed.JWT_SECRET,
                expiresIn: parsed.JWT_EXPIRES_IN,
            },
            rateLimit: {
                windowMs: parseInt(parsed.RATE_LIMIT_WINDOW_MS, 10),
                maxRequests: parseInt(parsed.RATE_LIMIT_MAX_REQUESTS, 10),
            },
            corsOrigin: parsed.CORS_ORIGIN,
            apiVersion: parsed.API_VERSION,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

export const config = parseEnv();
