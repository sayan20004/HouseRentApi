import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

/**
 * Error response format
 */
interface ErrorResponse {
    success: false;
    message: string;
    errors?: any[];
    stack?: string;
}

/**
 * Centralized error handler middleware
 */
export const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: any[] | undefined;

    // Handle ApiError
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle Mongoose validation errors
    else if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.values(err.errors).map((error: any) => ({
            field: error.path,
            message: error.message,
        }));
    }
    // Handle Mongoose duplicate key errors
    else if ((err as any).code === 11000) {
        statusCode = 409;
        const field = Object.keys((err as any).keyPattern)[0];
        message = `${field} already exists`;
    }
    // Handle Mongoose cast errors
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    // Generic error
    else {
        message = err.message || message;
    }

    const response: ErrorResponse = {
        success: false,
        message,
        ...(errors && { errors }),
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    console.error('Error:', {
        statusCode,
        message,
        stack: err.stack,
    });

    res.status(statusCode).json(response);
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
