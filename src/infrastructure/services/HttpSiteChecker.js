const { Logger } = require('../../shared/utils/Logger');
const axios = require('axios');

/**
 * 🌐 HTTP Site Checker Implementation
 * HTTP istekleri ile site durumunu kontrol eder
 */
class HttpSiteChecker {
    constructor(config = {}) {
        this.timeout = config.timeout || 10000;
        this.userAgent = config.userAgent || 'Who-Is Site Checker 1.0';
        this.maxRedirects = config.maxRedirects || 5;
        this.logger = new Logger('HttpSiteChecker');
    }

    /**
     * 🔍 Site'ın aktif olup olmadığını kontrol eder
     */
    async checkSite(url) {
        try {
            this.logger.info(`🔍 Checking site: ${url}`);
            
            // URL formatını düzenle
            const formattedUrl = this._formatUrl(url);
            
            const startTime = Date.now();
            
            const response = await axios.get(formattedUrl, {
                timeout: this.timeout,
                maxRedirects: this.maxRedirects,
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                validateStatus: (status) => status < 500 // 5xx hariç tüm statuslar OK
            });

            const responseTime = Date.now() - startTime;
            
            const result = {
                url: formattedUrl,
                status: response.status < 400 ? 'online' : 'offline',
                isActive: response.status < 400,
                statusCode: response.status,
                statusText: response.statusText,
                responseTime,
                headers: response.headers,
                redirectUrl: response.request.res.responseUrl !== formattedUrl ? response.request.res.responseUrl : null,
                contentLength: response.headers['content-length'] || response.data.length,
                lastModified: response.headers['last-modified'],
                server: response.headers.server,
                timestamp: new Date().toISOString()
            };

            this.logger.info(`✅ Site check completed: ${url} - Status: ${response.status} - Time: ${responseTime}ms`);
            return result;

        } catch (error) {
            this.logger.error(`❌ Site check failed: ${url}`, error);
            
            return {
                url: url,
                status: 'offline',
                isActive: false,
                statusCode: error.response?.status || null,
                statusText: error.response?.statusText || error.message,
                responseTime: null,
                error: {
                    code: error.code,
                    message: error.message,
                    type: this._getErrorType(error)
                },
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * 📊 Birden fazla site'ı paralel kontrol eder
     */
    async checkMultipleSites(urls) {
        this.logger.info(`🔍 Checking ${urls.length} sites in parallel`);
        
        const promises = urls.map(url => this.checkSite(url));
        const results = await Promise.allSettled(promises);
        
        return results.map((result, index) => ({
            url: urls[index],
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null
        }));
    }

    /**
     * 🔄 URL formatını düzenler
     */
    _formatUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }

    /**
     * 🏷️ Error tipini belirler
     */
    _getErrorType(error) {
        if (error.code === 'ENOTFOUND') return 'DNS_RESOLUTION_FAILED';
        if (error.code === 'ECONNREFUSED') return 'CONNECTION_REFUSED';
        if (error.code === 'ETIMEDOUT') return 'TIMEOUT';
        if (error.code === 'ECONNRESET') return 'CONNECTION_RESET';
        if (error.response?.status >= 400) return 'HTTP_ERROR';
        return 'UNKNOWN_ERROR';
    }
}

module.exports = { HttpSiteChecker };
