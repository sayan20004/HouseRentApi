import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { generateToken } from '../utils/jwt';
import { successResponse } from '../utils/ApiResponse';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: role || UserRole.TENANT,
        });

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            kycStatus: user.kycStatus,
            createdAt: user.createdAt,
        };

        res.status(201).json(
            successResponse(
                {
                    user: userData,
                    token,
                },
                'User registered successfully'
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            kycStatus: user.kycStatus,
            createdAt: user.createdAt,
        };

        res.json(
            successResponse(
                {
                    user: userData,
                    token,
                },
                'Login successful'
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /auth/me
 */
export const getMe = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await User.findById(req.user!.userId);
        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        res.json(successResponse(user));
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * PATCH /users/me
 */
export const updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user!.userId,
            { $set: { name, phone } },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        res.json(successResponse(user, 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Convert tenant to owner
 * PATCH /users/me/role
 */
export const convertToOwner = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await User.findById(req.user!.userId);
        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        if (user.role === UserRole.OWNER) {
            throw new BadRequestError('User is already an owner');
        }

        if (user.role === UserRole.ADMIN) {
            throw new BadRequestError('Cannot change admin role');
        }

        user.role = UserRole.OWNER;
        await user.save();

        res.json(successResponse(user, 'Role updated to owner successfully'));
    } catch (error) {
        next(error);
    }
};
