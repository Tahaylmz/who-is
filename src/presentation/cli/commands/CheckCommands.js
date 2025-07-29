const { CheckSiteUseCase } = require('../../../application/usecases/CheckSiteUseCase');
const { HttpSiteChecker } = require('../../../infrastructure/services/HttpSiteChecker');
const { FileDomainRepository } = require('../../../infrastructure/repositories/FileDomainRepository');
const { Logger } = require('../../../shared/utils/Logger');

/**
 * 🔍 Check Commands
 * Site kontrolü komutları
 */
class CheckCommands {
    constructor() {
        this.logger = new Logger('CheckCommands');
        this.setupDependencies();
    }

    /**
     * 🔧 Bağımlılıkları ayarla
     */
    setupDependencies() {
        this.siteChecker = new HttpSiteChecker();
        this.domainRepository = new FileDomainRepository();
        this.checkSiteUseCase = new CheckSiteUseCase(
            this.siteChecker,
            this.domainRepository,
            this.logger
        );
    }

    /**
     * 📋 Check komutlarını döndür
     */
    getCommands() {
        return [
            {
                command: 'site <url>',
                description: '🔍 Bir web sitesinin durumunu kontrol eder',
                action: (url, options) => this.checkSite(url, options)
            },
            {
                command: 'batch <urls...>',
                description: '📊 Birden fazla siteyi kontrol eder',
                action: (urls, options) => this.checkMultipleSites(urls, options)
            },
            {
                command: 'file <filepath>',
                description: '📁 Dosyadan URL listesi ile kontrol',
                action: (filepath, options) => this.checkFromFile(filepath, options)
            }
        ];
    }

    /**
     * 🔍 Tek site kontrolü
     */
    async checkSite(url, options = {}) {
        try {
            console.log(`🔍 Checking site: ${url}`);
            console.log('⏳ Please wait...\n');

            const result = await this.checkSiteUseCase.execute(url, {
                timeout: options.timeout || 10000
            });

            console.log('✅ Site Check Results:');
            console.log(`   🌐 URL: ${result.url}`);
            console.log(`   📊 Status: ${result.status === 'online' ? '🟢 Online' : '🔴 Offline'}`);
            console.log(`   📈 Status Code: ${result.statusCode || 'N/A'}`);
            console.log(`   ⚡ Response Time: ${result.responseTime ? result.responseTime + 'ms' : 'N/A'}`);
            
            if (result.server) {
                console.log(`   🖥️  Server: ${result.server}`);
            }
            
            if (result.redirectUrl) {
                console.log(`   🔄 Redirected to: ${result.redirectUrl}`);
            }
            
            console.log(`   🕐 Checked at: ${new Date(result.timestamp).toLocaleString()}`);

        } catch (error) {
            console.error('❌ Site check failed:');
            console.error(`   Error: ${error.message}`);
        }
    }

    /**
     * 📊 Çoklu site kontrolü
     */
    async checkMultipleSites(urls, options = {}) {
        try {
            console.log(`📊 Checking ${urls.length} sites`);
            console.log('⏳ Please wait...\n');

            const results = await this.checkSiteUseCase.executeMultiple(urls, {
                concurrency: options.concurrency || 10,
                timeout: options.timeout || 10000
            });

            console.log('📊 Batch Check Results:');
            const online = results.filter(r => r.status === 'online').length;
            const offline = results.filter(r => r.status === 'offline').length;

            console.log(`   📈 Total Sites: ${results.length}`);
            console.log(`   🟢 Online: ${online}`);
            console.log(`   🔴 Offline: ${offline}`);
            console.log(`   📊 Success Rate: ${((online / results.length) * 100).toFixed(2)}%\n`);

            results.forEach((result, index) => {
                const status = result.status === 'online' ? '🟢' : '🔴';
                console.log(`   ${index + 1}. ${status} ${result.url} - ${result.statusCode || result.error || 'N/A'}`);
            });

        } catch (error) {
            console.error('❌ Batch check failed:');
            console.error(`   Error: ${error.message}`);
        }
    }

    /**
     * 📁 Dosyadan site kontrolü
     */
    async checkFromFile(filepath, options = {}) {
        try {
            console.log(`📁 Reading sites from file: ${filepath}`);
            console.log('⏳ Please wait...\n');

            const results = await this.checkSiteUseCase.executeFromFile(filepath, {
                concurrency: options.concurrency || 10,
                timeout: options.timeout || 10000
            });

            console.log('📁 File-based Check Results:');
            const online = results.filter(r => r.status === 'online').length;
            const offline = results.filter(r => r.status === 'offline').length;

            console.log(`   📈 Total Sites: ${results.length}`);
            console.log(`   🟢 Online: ${online}`);
            console.log(`   🔴 Offline: ${offline}`);
            console.log(`   📊 Success Rate: ${((online / results.length) * 100).toFixed(2)}%\n`);

            results.forEach((result, index) => {
                const status = result.status === 'online' ? '🟢' : '🔴';
                console.log(`   ${index + 1}. ${status} ${result.url} - ${result.responseTime || 0}ms`);
            });

        } catch (error) {
            console.error('❌ File-based check failed:');
            console.error(`   Error: ${error.message}`);
        }
    }
}

module.exports = { CheckCommands };
