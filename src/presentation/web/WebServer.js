/**
 * 🌐 Web Server - Clean Architecture ile Express.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { CheckSiteUseCase } = require('../../application/usecases/CheckSiteUseCase');
const { GenerateDomainUseCase } = require('../../application/usecases/GenerateDomainUseCase');
const { HuntDomainUseCase } = require('../../application/usecases/HuntDomainUseCase');
const { HttpSiteChecker } = require('../../infrastructure/services/HttpSiteChecker');
const { OpenAIDomainGenerator } = require('../../infrastructure/services/OpenAIDomainGenerator');
const { FileDomainRepository } = require('../../infrastructure/repositories/FileDomainRepository');
const { Logger } = require('../../shared/utils/Logger');

class WebServer {
    constructor(port = 3001) {
        this.app = express();
        this.port = port;
        this.logger = new Logger('WebServer');
        this.setupDependencies();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupDependencies() {
        // Infrastructure services
        this.siteChecker = new HttpSiteChecker();
        this.domainGenerator = new OpenAIDomainGenerator();
        this.domainRepository = new FileDomainRepository();

        // Use cases
        this.checkSiteUseCase = new CheckSiteUseCase(
            this.siteChecker,
            this.domainRepository,
            this.logger
        );
        
        this.generateDomainUseCase = new GenerateDomainUseCase(
            this.domainGenerator,
            { isValidDomainName: (domain) => /^[a-z0-9-]+$/.test(domain) },
            this.domainRepository
        );
        
        this.huntDomainUseCase = new HuntDomainUseCase(
            this.domainGenerator,
            this.siteChecker,
            this.domainRepository,
            { isValidDomainName: (domain) => /^[a-z0-9-]+$/.test(domain) }
        );
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // Request logging
        this.app.use((req, res, next) => {
            this.logger.info(`${req.method} ${req.path}`, { 
                ip: req.ip, 
                userAgent: req.get('User-Agent') 
            });
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '2.0.0',
                uptime: process.uptime()
            });
        });

        // Site checking endpoints
        this.app.post('/api/check', async (req, res) => {
            try {
                const { url, timeout = 5000 } = req.body;
                
                if (!url) {
                    return res.status(400).json({
                        success: false,
                        error: 'URL is required'
                    });
                }

                const result = await this.checkSiteUseCase.execute(url, { timeout });
                
                res.json({
                    success: true,
                    data: result
                });

            } catch (error) {
                this.logger.error('Site check failed', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        this.app.post('/api/check-multiple', async (req, res) => {
            try {
                const { urls, concurrency = 10 } = req.body;
                
                if (!urls || !Array.isArray(urls)) {
                    return res.status(400).json({
                        success: false,
                        error: 'URLs array is required'
                    });
                }

                const results = await this.checkSiteUseCase.executeMultiple(urls, concurrency);
                
                res.json({
                    success: true,
                    data: results,
                    stats: {
                        total: results.length,
                        online: results.filter(r => r.status === 'online').length,
                        offline: results.filter(r => r.status === 'offline').length
                    }
                });

            } catch (error) {
                this.logger.error('Multiple site check failed', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Domain endpoints
        this.app.post('/api/domain-check', async (req, res) => {
            try {
                const { domain, extensions = ['.com', '.net', '.org'] } = req.body;
                
                if (!domain) {
                    return res.status(400).json({
                        success: false,
                        error: 'Domain is required'
                    });
                }

                const results = await this.bridge.checkDomainExtensions(domain, extensions);
                
                res.json({
                    success: true,
                    data: results
                });

            } catch (error) {
                this.logger.error('Domain check failed', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        this.app.post('/api/domain-availability', async (req, res) => {
            try {
                const { domain } = req.body;
                
                if (!domain) {
                    return res.status(400).json({
                        success: false,
                        error: 'Domain is required'
                    });
                }

                const result = await this.bridge.checkDomainAvailability(domain);
                
                res.json({
                    success: true,
                    data: result
                });

            } catch (error) {
                this.logger.error('Domain availability check failed', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // AI domain generation
        this.app.post('/api/ai-domains', async (req, res) => {
            try {
                const { keywords, count = 10, style = 'modern' } = req.body;
                
                if (!keywords || !Array.isArray(keywords)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Keywords array is required'
                    });
                }

                const domains = await this.generateDomainUseCase.execute(keywords, { count, style });
                
                res.json({
                    success: true,
                    data: domains
                });

            } catch (error) {
                this.logger.error('AI domain generation failed', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Domain hunting
        this.app.post('/api/hunt', async (req, res) => {
            try {
                const { 
                    keywords, 
                    extensions = ['.com', '.net', '.org'],
                    limit = 100,
                    checkAvailability = true 
                } = req.body;
                
                if (!keywords || !Array.isArray(keywords)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Keywords array is required'
                    });
                }

                const result = await this.huntDomainUseCase.execute(keywords, {
                    extensions,
                    limit,
                    checkAvailability
                });
                
                res.json({
                    success: true,
                    data: result
                });

            } catch (error) {
                this.logger.error('Domain hunt failed', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Web interface
        this.app.get('/', (req, res) => {
            res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>🌐 Who Is - Domain & Site Checker</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container { 
            background: rgba(255,255,255,0.95); 
            border-radius: 15px; 
            padding: 30px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            color: #333;
        }
        h1 { 
            text-align: center; 
            color: #4a5568; 
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 20px;
            border-radius: 10px;
            color: white;
            text-align: center;
        }
        .feature-card h3 {
            margin-top: 0;
            font-size: 1.3em;
        }
        .api-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .endpoint {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8em;
            margin-right: 10px;
        }
        .post { background: #28a745; color: white; }
        .get { background: #007bff; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Who Is - Modern Domain & Site Checker</h1>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>⚡ Site Health Checker</h3>
                <p>Anında site durumu ve performans analizi</p>
            </div>
            <div class="feature-card">
                <h3>🌐 Domain Scanner</h3>
                <p>Domain uzantıları ve erişilebilirlik kontrolü</p>
            </div>
            <div class="feature-card">
                <h3>🤖 AI Domain Generator</h3>
                <p>GPT destekli brandable domain önerileri</p>
            </div>
            <div class="feature-card">
                <h3>🕵️ Domain Hunter</h3>
                <p>Otomatik domain keşif ve analiz motoru</p>
            </div>
        </div>

        <div class="api-section">
            <h2>🔌 API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method post">POST</span><code>/api/check</code>
                <p>Tek site kontrolü</p>
                <p><strong>Body:</strong> <code>{ "url": "https://example.com", "timeout": 5000 }</code></p>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span><code>/api/check-multiple</code>
                <p>Çoklu site kontrolü</p>
                <p><strong>Body:</strong> <code>{ "urls": ["url1", "url2"], "concurrency": 10 }</code></p>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span><code>/api/domain-check</code>
                <p>Domain uzantı kontrolü</p>
                <p><strong>Body:</strong> <code>{ "domain": "example", "extensions": [".com", ".net"] }</code></p>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span><code>/api/domain-availability</code>
                <p>Domain müsaitlik kontrolü</p>
                <p><strong>Body:</strong> <code>{ "domain": "example.com" }</code></p>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span><code>/api/ai-domains</code>
                <p>AI domain üretimi</p>
                <p><strong>Body:</strong> <code>{ "keywords": ["tech", "startup"], "count": 10 }</code></p>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span><code>/api/hunt</code>
                <p>Domain avcısı</p>
                <p><strong>Body:</strong> <code>{ "keywords": ["tech"], "extensions": [".com"], "limit": 100 }</code></p>
            </div>

            <div class="endpoint">
                <span class="method get">GET</span><code>/health</code>
                <p>Server sağlık durumu</p>
            </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #6c757d;">
            <p>🚀 Clean Architecture ile güçlendirilmiş</p>
            <p>Version 2.0.0 - Modern, hızlı ve güvenilir</p>
        </div>
    </div>
</body>
</html>
            `);
        });

        // Error handling
        this.app.use((err, req, res, next) => {
            this.logger.error('Unhandled error', err);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        });

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });
    }

    start() {
        return new Promise((resolve) => {
            this.server = this.app.listen(this.port, () => {
                this.logger.info(`🌐 Modern Web Server started on port ${this.port}`);
                this.logger.info(`🔗 Web interface: http://localhost:${this.port}`);
                this.logger.info(`📡 API base: http://localhost:${this.port}/api`);
                resolve();
            });
        });
    }

    stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    this.logger.info('🛑 Web server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

// Export for use as module
module.exports = WebServer;

// Start server if run directly
if (require.main === module) {
    const server = new WebServer(process.env.PORT || 3001);
    
    server.start().catch(error => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('🛑 Received SIGTERM, shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });
}
