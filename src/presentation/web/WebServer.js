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
        // Security & Performance
        try {
            const helmet = require('helmet');
            const compression = require('compression');
            const morgan = require('morgan');
            
            this.app.use(helmet({
                contentSecurityPolicy: false // Allow inline scripts for simplicity
            }));
            this.app.use(compression());
            this.app.use(morgan('combined'));
        } catch (e) {
            console.log('Optional middleware not available, continuing...');
        }
        
        this.app.use(cors({
            origin: process.env.NODE_ENV === 'production' ? false : true,
            credentials: true
        }));
        
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Serve static files from public directory
        this.app.use(express.static(path.join(__dirname, '../../../public')));
        
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
        // Serve main page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../../public/index.html'));
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '2.0.0',
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            });
        });

        // API Status
        this.app.get('/api/status', (req, res) => {
            res.json({
                status: 'online',
                features: {
                    siteCheck: true,
                    domainHunt: true,
                    aiGeneration: true,
                    bulkOperations: true
                },
                timestamp: new Date().toISOString()
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
                    data: {
                        url: url,
                        isOnline: result.isOnline,
                        statusCode: result.statusCode,
                        responseTime: result.responseTime,
                        error: result.error,
                        timestamp: new Date().toISOString()
                    }
                });

            } catch (error) {
                this.logger.error('Site check failed', error);
                res.status(500).json({
                    success: false,
                    error: 'Site check failed',
                    message: error.message
                });
            }
        });

        // Bulk site checking
        this.app.post('/api/check-bulk', async (req, res) => {
            try {
                const { urls, timeout = 5000 } = req.body;
                
                if (!urls || !Array.isArray(urls)) {
                    return res.status(400).json({
                        success: false,
                        error: 'URLs array is required'
                    });
                }

                const results = await Promise.allSettled(
                    urls.map(url => this.checkSiteUseCase.execute(url, { timeout }))
                );

                const processedResults = results.map((result, index) => {
                    if (result.status === 'fulfilled') {
                        return {
                            url: urls[index],
                            isOnline: result.value.isOnline,
                            statusCode: result.value.statusCode,
                            responseTime: result.value.responseTime,
                            error: result.value.error
                        };
                    } else {
                        return {
                            url: urls[index],
                            isOnline: false,
                            error: 'Check failed',
                            responseTime: 0
                        };
                    }
                });

                res.json({
                    success: true,
                    data: processedResults
                });

            } catch (error) {
                this.logger.error('Bulk site check failed', error);
                res.status(500).json({
                    success: false,
                    error: 'Bulk site check failed'
                });
            }
        });

        // Domain hunting
        this.app.post('/api/hunt', async (req, res) => {
            try {
                const { keywords, extensions = ['com'], maxLength = 10, count = 20 } = req.body;
                
                if (!keywords || !Array.isArray(keywords)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Keywords array is required'
                    });
                }

                const result = await this.huntDomainUseCase.execute({
                    keywords,
                    extensions,
                    maxLength,
                    count
                });

                res.json({
                    success: true,
                    data: result.domains || []
                });

            } catch (error) {
                this.logger.error('Domain hunt failed', error);
                res.status(500).json({
                    success: false,
                    error: 'Domain hunt failed',
                    message: error.message
                });
            }
        });

        // Domain availability checking
        this.app.post('/api/check-domains', async (req, res) => {
            try {
                const { domains } = req.body;
                
                if (!domains || !Array.isArray(domains)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Domains array is required'
                    });
                }

                // Simulate domain checking (replace with actual WHOIS or domain API)
                const results = domains.map(domain => ({
                    name: domain,
                    available: Math.random() > 0.7, // Simulate availability
                    premium: Math.random() > 0.9,
                    registrar: Math.random() > 0.5 ? 'GoDaddy' : 'Namecheap'
                }));

                res.json({
                    success: true,
                    data: results
                });

            } catch (error) {
                this.logger.error('Domain check failed', error);
                res.status(500).json({
                    success: false,
                    error: 'Domain check failed'
                });
            }
        });

        // AI Domain Generation
        this.app.post('/api/generate', async (req, res) => {
            try {
                const { 
                    description, 
                    category = 'tech', 
                    count = 20, 
                    extensions = ['com'],
                    options = {} 
                } = req.body;
                
                if (!description) {
                    return res.status(400).json({
                        success: false,
                        error: 'Business description is required'
                    });
                }

                // Simulate AI generation results
                const aiDomains = this.generateMockDomains(description, category, count, extensions);

                res.json({
                    success: true,
                    data: aiDomains
                });

            } catch (error) {
                this.logger.error('AI generation failed', error);
                res.status(500).json({
                    success: false,
                    error: 'AI generation failed',
                    message: error.message
                });
            }
        });

        // Analytics endpoint
        this.app.get('/api/analytics', (req, res) => {
            res.json({
                success: true,
                data: {
                    totalChecks: 1234,
                    onlineSites: 987,
                    availableDomains: 456,
                    trends: {
                        '.ai': '+25%',
                        '.io': '+18%',
                        '.com': 'stable'
                    },
                    recentActivity: [
                        { type: 'check', description: 'Site check completed', timestamp: new Date().toISOString() },
                        { type: 'hunt', description: 'Domain hunt finished', timestamp: new Date().toISOString() },
                        { type: 'ai-generate', description: 'AI domains generated', timestamp: new Date().toISOString() }
                    ]
                }
            });
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
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });
    }

    generateMockDomains(description, category, count, extensions) {
        // Mock AI domain generation
        const prefixes = {
            tech: ['smart', 'tech', 'digital', 'cyber', 'cloud', 'data', 'ai', 'auto'],
            business: ['pro', 'biz', 'corp', 'trade', 'market', 'hub', 'center'],
            creative: ['studio', 'design', 'art', 'creative', 'pixel', 'canvas'],
            health: ['health', 'med', 'care', 'wellness', 'fit', 'bio'],
            finance: ['fin', 'pay', 'coin', 'fund', 'capital', 'invest'],
            education: ['edu', 'learn', 'study', 'academy', 'school'],
            ecommerce: ['shop', 'store', 'mart', 'buy', 'sell', 'cart']
        };

        const suffixes = ['ly', 'io', 'app', 'hub', 'lab', 'pro', 'zone', 'tech', 'soft'];
        const words = description.toLowerCase().split(/\s+/).slice(0, 3);
        const categoryPrefixes = prefixes[category] || prefixes.tech;

        const domains = [];
        
        for (let i = 0; i < count; i++) {
            const prefix = categoryPrefixes[Math.floor(Math.random() * categoryPrefixes.length)];
            const word = words[Math.floor(Math.random() * words.length)] || 'app';
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            const extension = extensions[Math.floor(Math.random() * extensions.length)];
            
            const domainName = Math.random() > 0.5 
                ? `${prefix}${word}.${extension}` 
                : `${word}${suffix}.${extension}`;
            
            domains.push({
                name: domainName,
                available: Math.random() > 0.6,
                description: `AI generated domain for ${category} business`,
                score: Math.floor(Math.random() * 100) + 1
            });
        }

        return domains;
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

module.exports = WebServer;
