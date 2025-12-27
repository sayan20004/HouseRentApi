import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod'; // Changed from AnyZodObject to ZodSchema

/**
 * Validation target type
 */
type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Generic validation middleware using Zod schemas
 */
export const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataToValidate = req[target];
            await schema.parseAsync(dataToValidate);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors,
                });
                return;
            }
            next(error);
        }
    };
};