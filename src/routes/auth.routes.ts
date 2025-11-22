import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    convertToOwnerSchema,
} from '../validations/auth.validation';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   PATCH /api/v1/users/me
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/me', authenticate, validate(updateProfileSchema), authController.updateProfile);

/**
 * @route   PATCH /api/v1/users/me/role
 * @desc    Convert tenant to owner
 * @access  Private
 */
router.patch(
    '/me/role',
    authenticate,
    validate(convertToOwnerSchema),
    authController.convertToOwner
);

export default router;
