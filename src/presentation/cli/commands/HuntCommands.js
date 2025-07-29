const { HuntDomainUseCase } = require('../../../application/usecases/HuntDomainUseCase');
const { OpenAIDomainGenerator } = require('../../../infrastructure/services/OpenAIDomainGenerator');
const { HttpSiteChecker } = require('../../../infrastructure/services/HttpSiteChecker');
const { FileDomainRepository } = require('../../../infrastructure/repositories/FileDomainRepository');
const { Logger } = require('../../../shared/utils/Logger');

/**
 * 🕵️ Hunt Commands - Domain avlama komutları
 */
class HuntCommands {
    constructor() {
        this.logger = new Logger('HuntCommands');
        this.setupDependencies();
    }

    /**
     * 🔧 Bağımlılıkları ayarla
     */
    setupDependencies() {
        this.domainGenerator = new OpenAIDomainGenerator();
        this.siteChecker = new HttpSiteChecker();
        this.domainRepository = new FileDomainRepository();
        this.domainValidationService = {
            isValidDomainName: (domain) => {
                // Basit domain validation
                return /^[a-z0-9-]+$/.test(domain) && 
                       domain.length >= 3 && 
                       domain.length <= 63 &&
                       !domain.startsWith('-') && 
                       !domain.endsWith('-') &&
                       !domain.includes('--');
            }
        };
        
        this.huntDomainUseCase = new HuntDomainUseCase(
            this.domainGenerator,
            this.siteChecker,
            this.domainRepository,
            this.domainValidationService
        );
    }

    /**
     * 📋 Hunt komutlarını döndür
     */
    getCommands() {
        return [
            {
                command: 'hunt <keywords...>',
                description: '🕵️ Kapsamlı domain avı - Müsait domainleri bulur ve analiz eder',
                action: (keywords, options) => this.huntDomains(keywords, options)
            },
            {
                command: 'quick-hunt <keyword>',
                description: '⚡ Hızlı domain avı - Tek kelimeyle anında sonuçlar',
                action: (keyword, options) => this.quickHunt(keyword, options)
            },
            {
                command: 'random-hunt [category]',
                description: '🎲 Rastgele domain avı - Şanslı keşifler yapmak için',
                action: (category, options) => this.randomHunt(category, options)
            },
            {
                command: 'premium-hunt <keywords...>',
                description: '💎 Premium domain avı - Değerli ve kısa domainleri hedefler',
                action: (keywords, options) => this.premiumHunt(keywords, options)
            },
            {
                command: 'bulk-hunt <file>',
                description: '📁 Toplu domain avı - Dosyadan anahtar kelime listesi ile',
                action: (file, options) => this.bulkHunt(file, options)
            }
        ];
    }

    /**
     * 🕵️ Ana domain avlama
     */
    async huntDomains(keywords, options = {}) {
        try {
            console.log(`🕵️ Starting domain hunt for: ${keywords.join(', ')}`);
            console.log('⏳ Scanning the digital landscape...\n');

            const result = await this.huntDomainUseCase.execute(keywords, {
                extensions: this._parseExtensions(options.extensions) || ['.com', '.net', '.org'],
                maxResults: options.limit || 50,
                checkAvailability: options.check !== false,
                filterPremium: options.premium === false,
                minLength: options.minLength || 3,
                maxLength: options.maxLength || 15,
                includeNumbers: options.numbers || false,
                includeDashes: options.dashes || false
            });

            if (result.success) {
                const { domains, stats, huntId } = result.data;
                
                console.log('🎯 Domain Hunt Results:');
                console.log(`   🆔 Hunt ID: ${huntId}`);
                console.log(`   📊 Total Found: ${stats.total}`);
                console.log(`   ✅ Available: ${stats.available}`);
                console.log(`   ❌ Taken: ${stats.taken}`);
                console.log(`   💎 Premium: ${stats.premium}`);
                console.log(`   📈 Availability Rate: ${stats.availabilityRate}\n`);

                if (stats.total > 0) {
                    console.log('💎 Available Domains:');
                    const availableDomains = domains.filter(d => d.isAvailable());
                    
                    if (availableDomains.length > 0) {
                        availableDomains
                            .slice(0, options.top || 20)
                            .forEach((domain, index) => {
                                const status = domain.isPremium ? '💎' : '✅';
                                const ext = domain.getExtension();
                                console.log(`   ${index + 1}. ${status} ${domain.getName()}`);
                                
                                if (options.detailed && domain.checkResult) {
                                    console.log(`       Response: ${domain.checkResult.statusCode || 'N/A'} | Time: ${domain.checkResult.responseTime || 'N/A'}ms`);
                                }
                            });
                    } else {
                        console.log('   😔 No available domains found with current criteria');
                        console.log('   💡 Try different keywords or extensions');
                    }

                    if (options.extensions && stats.extensions) {
                        console.log('\n🌐 Results by Extension:');
                        Object.entries(stats.extensions).forEach(([ext, count]) => {
                            console.log(`   ${ext}: ${count} domains`);
                        });
                    }
                } else {
                    console.log('😔 No domains found. Try different keywords or options.');
                }
                
            } else {
                console.error('❌ Domain hunt failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * ⚡ Hızlı domain avı
     */
    async quickHunt(keyword, options = {}) {
        try {
            console.log(`⚡ Quick hunt for: ${keyword}`);
            console.log('⏳ Lightning search...\n');

            const result = await this.huntDomainUseCase.quickHunt(keyword, options.extension || '.com');

            if (result.success) {
                const { domains } = result.data;
                const availableDomains = domains.filter(d => d.isAvailable());
                
                console.log('⚡ Quick Hunt Results:');
                if (availableDomains.length > 0) {
                    availableDomains.forEach((domain, index) => {
                        console.log(`   ${index + 1}. ✅ ${domain.getName()}`);
                    });
                } else {
                    console.log('   😔 No available domains found');
                    console.log('   💡 Try a different keyword or extension');
                }
                
            } else {
                console.error('❌ Quick hunt failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 🎲 Rastgele domain avı
     */
    async randomHunt(category = 'tech', options = {}) {
        try {
            console.log(`🎲 Random hunt in ${category} category`);
            console.log('⏳ Rolling digital dice...\n');

            const result = await this.huntDomainUseCase.randomHunt(category, options.count || 20);

            if (result.success) {
                const { domains } = result.data;
                const availableDomains = domains.filter(d => d.isAvailable());
                
                console.log(`🎲 Random ${category.toUpperCase()} Hunt Results:`);
                if (availableDomains.length > 0) {
                    availableDomains.forEach((domain, index) => {
                        console.log(`   ${index + 1}. 🎲 ${domain.getName()}`);
                    });
                } else {
                    console.log('   🎲 No available random domains found');
                    console.log('   💡 Try running the command again for different results');
                }
                
            } else {
                console.error('❌ Random hunt failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 💎 Premium domain avı
     */
    async premiumHunt(keywords, options = {}) {
        try {
            console.log(`💎 Premium hunt for: ${keywords.join(', ')}`);
            console.log('⏳ Searching for digital gems...\n');

            const result = await this.huntDomainUseCase.execute(keywords, {
                extensions: ['.com'],
                maxResults: 30,
                checkAvailability: true,
                filterPremium: false,
                minLength: 3,
                maxLength: 8, // Premium domains are usually shorter
                includeNumbers: false,
                includeDashes: false
            });

            if (result.success) {
                const { domains } = result.data;
                const premiumDomains = domains
                    .filter(d => d.isAvailable() && d.getName().length <= 8)
                    .sort((a, b) => a.getName().length - b.getName().length);
                
                console.log('💎 Premium Domain Opportunities:');
                if (premiumDomains.length > 0) {
                    premiumDomains
                        .slice(0, 15)
                        .forEach((domain, index) => {
                            const length = domain.getName().replace(/\.[^.]+$/, '').length;
                            const gem = length <= 5 ? '💎💎💎' : length <= 6 ? '💎💎' : '💎';
                            console.log(`   ${index + 1}. ${gem} ${domain.getName()} (${length} chars)`);
                        });
                } else {
                    console.log('   💎 No premium domains available');
                    console.log('   💡 Premium domains are rare - try different keywords');
                }
                
            } else {
                console.error('❌ Premium hunt failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 📁 Toplu domain avı
     */
    async bulkHunt(filepath, options = {}) {
        try {
            const fs = require('fs').promises;
            
            console.log(`📁 Bulk hunt from file: ${filepath}`);
            console.log('📖 Reading keywords...\n');

            const content = await fs.readFile(filepath, 'utf8');
            const keywordLines = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            if (keywordLines.length === 0) {
                console.error('❌ No keywords found in file');
                return;
            }

            console.log(`📋 Found ${keywordLines.length} keyword sets in file`);
            console.log('🚀 Starting bulk hunt...\n');

            for (let i = 0; i < keywordLines.length; i++) {
                const keywords = keywordLines[i].split(/[,\s]+/).filter(k => k);
                
                if (keywords.length > 0) {
                    console.log(`\n🔍 Hunt ${i + 1}/${keywordLines.length}: ${keywords.join(', ')}`);
                    await this.huntDomains(keywords, {
                        ...options,
                        limit: 10,
                        detailed: false
                    });
                    
                    // Rate limiting between hunts
                    if (i < keywordLines.length - 1) {
                        await this._delay(1000);
                    }
                }
            }

            console.log('\n🎉 Bulk hunt completed!');

        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error('❌ File not found:', filepath);
            } else {
                console.error('❌ Failed to read file:', error.message);
            }
        }
    }

    /**
     * 🔧 Extension listesini parse et
     */
    _parseExtensions(extensionsString) {
        if (!extensionsString) return null;
        
        return extensionsString
            .split(',')
            .map(ext => ext.trim())
            .map(ext => ext.startsWith('.') ? ext : '.' + ext);
    }

    /**
     * ⏰ Delay utility
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = { HuntCommands };
