import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { sanitizeInput } from './utils/sanitize';
import routes from './routes';

/**
 * Create Express application
 */
const app: Application = express();

/**
 * Security middleware
 */
app.use(helmet()); // Set security headers

/**
 * CORS configuration
 */
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
    })
);

/**
 * Body parsing middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Input sanitization middleware
 */
app.use((req, _res, next) => {
    if (req.body) {
        req.body = sanitizeInput(req.body);
    }
    if (req.query) {
        req.query = sanitizeInput(req.query);
    }
    next();
});

/**
 * Rate limiting
 */
app.use('/api', apiRateLimiter);

/**
 * API routes
 */
app.use(`/api/${config.apiVersion}`, routes);

/**
 * Root endpoint
 */
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Welcome to House Rent API',
        version: config.apiVersion,
        documentation: `/api/${config.apiVersion}/health`,
    });
});

/**
 * 404 handler
 */
app.use(notFoundHandler);

/**
 * Error handler (must be last)
 */
app.use(errorHandler);

export default app;
