const { Logger } = require('../../shared/utils/Logger');

/**
 * 🔍 Check Site Use Case
 * Site kontrolü iş mantığını yönetir
 */
class CheckSiteUseCase {
    constructor(siteChecker, domainRepository, logger) {
        this.siteChecker = siteChecker;
        this.domainRepository = domainRepository;
        this.logger = logger || new Logger('CheckSiteUseCase');
    }

    /**
     * 🔍 Tek site kontrolü
     */
    async execute(url, options = {}) {
        try {
            this.logger.info(`🔍 Checking site: ${url}`);
            
            // URL validation
            if (!this.isValidUrl(url)) {
                throw new Error('Invalid URL format');
            }

            // Site kontrolü yap
            const result = await this.siteChecker.checkSite(url, options);
            
            // Sonucu logla
            this.logger.info(`✅ Site check completed for ${url}: ${result.status}`);
            
            return result;
            
        } catch (error) {
            this.logger.error(`❌ Site check failed for ${url}:`, error);
            throw error;
        }
    }

    /**
     * 📊 Çoklu site kontrolü
     */
    async executeMultiple(urls, options = {}) {
        try {
            this.logger.info(`📊 Checking ${urls.length} sites`);
            
            const concurrency = options.concurrency || 10;
            const results = [];
            
            // Batch'lere böl
            for (let i = 0; i < urls.length; i += concurrency) {
                const batch = urls.slice(i, i + concurrency);
                const batchPromises = batch.map(url => 
                    this.execute(url, options).catch(error => ({
                        url,
                        status: 'error',
                        error: error.message,
                        timestamp: new Date().toISOString()
                    }))
                );
                
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
                
                // Rate limiting
                if (i + concurrency < urls.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            this.logger.info(`✅ Multiple site check completed: ${results.length} sites`);
            return results;
            
        } catch (error) {
            this.logger.error('❌ Multiple site check failed:', error);
            throw error;
        }
    }

    /**
     * ✅ URL validation
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = { CheckSiteUseCase };
