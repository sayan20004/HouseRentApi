import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import { User, UserRole } from '../models/User';

/**
 * Extended Express Request with user
 */
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
    };
}

/**
 * Authentication middleware - verify JWT token
 */
export const authenticate = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        // Check if user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new UnauthorizedError('User no longer exists');
        }

        // Attach user to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role as UserRole,
        };

        next();
    } catch (error: any) {
        next(new UnauthorizedError(error.message || 'Invalid token'));
    }
};

/**
 * Require owner role middleware
 */
export const requireOwner = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.role !== UserRole.OWNER && req.user.role !== UserRole.ADMIN) {
        return next(new ForbiddenError('Owner role required'));
    }

    next();
};

/**
 * Require admin role middleware
 */
export const requireAdmin = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.role !== UserRole.ADMIN) {
        return next(new ForbiddenError('Admin role required'));
    }

    next();
};
