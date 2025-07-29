#!/usr/bin/env node

/**
 * 🌐 Modern Web Server Entry Point
 * Clean Architecture tabanlı web server
 */

const path = require('path');

// Modern Web Server'ı çalıştır
const WebServer = require('./src/presentation/web/WebServer');

async function main() {
    const port = process.env.PORT || 3001;
    
    try {
        const server = new WebServer(port);
        await server.start();
        
        console.log('🎯 Server Commands:');
        console.log('   📊 Health: http://localhost:' + port + '/health');
        console.log('   🌐 Web UI: http://localhost:' + port);
        console.log('   📡 API: http://localhost:' + port + '/api');
        console.log('   🛑 Stop: Ctrl+C\n');
        
    } catch (error) {
        console.error('❌ Server Error:', error.message);
        if (process.env.DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (require.main === module) {
    main();
}

module.exports = { main };