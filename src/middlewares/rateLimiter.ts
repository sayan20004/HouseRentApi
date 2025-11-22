import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

/**
 * Rate limiter for authentication routes (login, register)
 */
export const authRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 300, // 300 requests per minute
    message: {
        success: false,
        message: 'Too many requests, please slow down',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
