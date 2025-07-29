#!/usr/bin/env node

/**
 * 🚀 Who-Is CLI Entry Point
 * Clean Architecture implementation
 */

const { CLIApplication } = require('./CLIApplication');

async function main() {
    try {
        const cliApp = new CLIApplication();
        await cliApp.run();
    } catch (error) {
        console.error('❌ Application failed to start:', error.message);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Start the application
main();
