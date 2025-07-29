const { Logger } = require('../../shared/utils/Logger');

/**
 * 🕵️ Domain Hunt Use Case
 * Domain avlama işlemlerini yönetir
 */
class HuntDomainUseCase {
    constructor(domainGenerator, siteChecker, domainRepository, domainValidationService) {
        this.domainGenerator = domainGenerator;
        this.siteChecker = siteChecker;
        this.domainRepository = domainRepository;
        this.domainValidationService = domainValidationService;
        this.logger = new Logger('HuntDomainUseCase');
    }

    /**
     * 🎯 Domain avlama işlemini başlatır
     */
    async execute(keywords, options = {}) {
        try {
            this.logger.info(`🕵️ Starting domain hunt for keywords: ${keywords.join(', ')}`);
            
            const {
                extensions = ['.com', '.net', '.org'],
                maxResults = 50,
                checkAvailability = true,
                filterPremium = false,
                minLength = 3,
                maxLength = 15,
                includeNumbers = false,
                includeDashes = false
            } = options;

            // 1. Domain önerileri üret
            const suggestions = await this.domainGenerator.generateDomains(keywords, {
                count: maxResults * 2, // Daha fazla öneri üret filtreleme için
                maxLength,
                includeNumbers,
                includeDashes
            });

            this.logger.info(`🎲 Generated ${suggestions.length} domain suggestions`);

            // 2. Domain'leri filtrele ve validate et
            const validDomains = this._filterAndValidateDomains(suggestions, {
                minLength,
                maxLength,
                includeNumbers,
                includeDashes
            });

            // 3. Extension'ları ekle
            const domainVariants = this._createDomainVariants(validDomains, extensions);
            
            // 4. Availability kontrolü (opsiyonel)
            let finalDomains = domainVariants;
            if (checkAvailability) {
                finalDomains = await this._checkDomainsAvailability(domainVariants);
            }

            // 5. Premium domain'leri filtrele (opsiyonel)
            if (filterPremium) {
                finalDomains = finalDomains.filter(domain => !domain.isPremium);
            }

            // 6. Sonuçları sınırla
            const limitedResults = finalDomains.slice(0, maxResults);

            // 7. Sonuçları kaydet
            await this._saveHuntResults(keywords, limitedResults, options);

            this.logger.info(`✅ Domain hunt completed: ${limitedResults.length} domains found`);

            return {
                success: true,
                message: `Found ${limitedResults.length} domains for your keywords`,
                data: {
                    keywords,
                    domains: limitedResults,
                    stats: this._generateStats(limitedResults),
                    timestamp: new Date().toISOString(),
                    huntId: this._generateHuntId()
                }
            };

        } catch (error) {
            this.logger.error('❌ Domain hunt failed', error);
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }

    /**
     * 🔍 Hızlı domain arama
     */
    async quickHunt(keyword, extension = '.com') {
        return await this.execute([keyword], {
            extensions: [extension],
            maxResults: 10,
            checkAvailability: true,
            filterPremium: true
        });
    }

    /**
     * 🎲 Rastgele domain önerileri
     */
    async randomHunt(category = 'tech', count = 20) {
        const randomDomains = await this.domainGenerator.generateRandomDomain(category);
        
        return await this.execute(randomDomains.slice(0, 3), {
            maxResults: count,
            checkAvailability: false
        });
    }

    /**
     * ✅ Domain'leri filtrele ve validate et
     */
    _filterAndValidateDomains(domains, options) {
        return domains.filter(domain => {
            // Length kontrolü
            if (domain.length < options.minLength || domain.length > options.maxLength) {
                return false;
            }

            // Number kontrolü
            if (!options.includeNumbers && /\d/.test(domain)) {
                return false;
            }

            // Dash kontrolü
            if (!options.includeDashes && domain.includes('-')) {
                return false;
            }

            // Domain validation service kullan
            return this.domainValidationService.isValidDomainName(domain);
        });
    }

    /**
     * 🔧 Domain varyantları oluştur
     */
    _createDomainVariants(domains, extensions) {
        const variants = [];
        
        domains.forEach(domain => {
            extensions.forEach(extension => {
                const fullDomain = domain + extension;
                // Basit domain object
                const domainObj = {
                    name: fullDomain,
                    available: null,
                    isPremium: fullDomain.length <= 5,
                    checkResult: null,
                    getName: function() { return this.name; },
                    getExtension: function() { 
                        const parts = this.name.split('.');
                        return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
                    },
                    isAvailable: function() { return this.available === true; },
                    updateAvailability: function(available) { this.available = available; },
                    setCheckResult: function(result) { this.checkResult = result; },
                    toJSON: function() {
                        return {
                            name: this.name,
                            available: this.available,
                            isPremium: this.isPremium,
                            checkResult: this.checkResult
                        };
                    }
                };
                variants.push(domainObj);
            });
        });

        return variants;
    }

    /**
     * 🌐 Domain'lerin müsaitlik durumunu kontrol et
     */
    async _checkDomainsAvailability(domains) {
        const checkedDomains = [];
        
        // Batch'ler halinde kontrol et (rate limiting için)
        const batchSize = 10;
        for (let i = 0; i < domains.length; i += batchSize) {
            const batch = domains.slice(i, i + batchSize);
            
            const promises = batch.map(async (domain) => {
                try {
                    const siteUrl = `https://${domain.getName()}`;
                    const checkResult = await this.siteChecker.checkSite(siteUrl);
                    
                    domain.updateAvailability(!checkResult.isActive);
                    domain.setCheckResult(checkResult);
                    
                    return domain;
                } catch (error) {
                    // Site ulaşılamıyorsa muhtemelen müsait
                    domain.updateAvailability(true);
                    return domain;
                }
            });
            
            const batchResults = await Promise.allSettled(promises);
            const validResults = batchResults
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);
                
            checkedDomains.push(...validResults);
            
            // Rate limiting
            await this._delay(200);
        }
        
        return checkedDomains;
    }

    /**
     * 💾 Hunt sonuçlarını kaydet
     */
    async _saveHuntResults(keywords, domains, options) {
        try {
            const huntData = {
                keywords,
                domains: domains.map(d => d.toJSON()),
                options,
                timestamp: new Date().toISOString(),
                huntId: this._generateHuntId()
            };

            await this.domainRepository.saveHistory(huntData);
        } catch (error) {
            this.logger.warn('⚠️ Failed to save hunt results', error);
        }
    }

    /**
     * 📊 İstatistikleri oluştur
     */
    _generateStats(domains) {
        const total = domains.length;
        const available = domains.filter(d => d.isAvailable()).length;
        const taken = total - available;
        const premium = domains.filter(d => d.isPremium).length;
        
        const extensionStats = {};
        domains.forEach(domain => {
            const ext = domain.getExtension();
            extensionStats[ext] = (extensionStats[ext] || 0) + 1;
        });

        return {
            total,
            available,
            taken,
            premium,
            availabilityRate: total > 0 ? (available / total * 100).toFixed(2) + '%' : '0%',
            extensions: extensionStats
        };
    }

    /**
     * 🆔 Hunt ID üretir
     */
    _generateHuntId() {
        return 'hunt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * ⏰ Delay utility
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = { HuntDomainUseCase };
