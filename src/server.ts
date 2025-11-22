import app from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        await connectDatabase();

        // Start listening
        const server = app.listen(config.port, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║            🏠 House Rent API Server Started 🏠           ║
║                                                           ║
║  Environment: ${config.nodeEnv.padEnd(42)}║
║  Port:        ${config.port.toString().padEnd(42)}║
║  API Version: ${config.apiVersion.padEnd(42)}║
║                                                           ║
║  Server URL:  http://localhost:${config.port.toString().padEnd(28)}║
║  API Base:    http://localhost:${config.port}/api/${config.apiVersion.padEnd(20)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
        });

        /**
         * Graceful shutdown
         */
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('HTTP server closed');

                // Close database connection
                await disconnectDatabase();

                console.log('Graceful shutdown completed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('unhandledRejection');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
