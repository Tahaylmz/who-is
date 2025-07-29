#!/usr/bin/env node

/**
 * 🌐 Modern CLI Entry Point
 * Clean Architecture tabanlı yeni CLI sistemi
 */

const path = require('path');

// Clean Architecture CLI'ı çalıştır
const CLIApplication = require('./src/presentation/cli/CLIApplication');

async function main() {
    try {
        const cli = new CLIApplication();
        await cli.run();
    } catch (error) {
        console.error('❌ CLI Error:', error.message);
        if (process.env.DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (require.main === module) {
    main();
}

module.exports = { main };
