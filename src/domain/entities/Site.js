/**
 * Site Entity - Domain Layer
 * Represents a website/domain in the system
 */
class Site {
    constructor(url, status = null, responseTime = null, statusCode = null, error = null, timestamp = null) {
        this.url = this.normalizeUrl(url);
        this.status = status; // 'online' | 'offline' | 'pending'
        this.responseTime = responseTime;
        this.statusCode = statusCode;
        this.error = error;
        this.timestamp = timestamp || new Date();
        this.domain = this.extractDomain(this.url);
        this.extension = this.extractExtension(this.domain);
    }

    /**
     * Normalize URL format
     */
    normalizeUrl(url) {
        if (!url) throw new Error('URL is required');
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }
        
        return url.toLowerCase().trim();
    }

    /**
     * Extract domain from URL
     */
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            // Fallback for simple domain names
            return url.replace(/^https?:\/\//, '').split('/')[0];
        }
    }

    /**
     * Extract extension from domain
     */
    extractExtension(domain) {
        const parts = domain.split('.');
        return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
    }

    /**
     * Check if site is online
     */
    isOnline() {
        return this.status === 'online';
    }

    /**
     * Check if site is offline
     */
    isOffline() {
        return this.status === 'offline';
    }

    /**
     * Check if check is pending
     */
    isPending() {
        return this.status === 'pending';
    }

    /**
     * Update site status
     */
    updateStatus(status, responseTime = null, statusCode = null, error = null) {
        this.status = status;
        this.responseTime = responseTime;
        this.statusCode = statusCode;
        this.error = error;
        this.timestamp = new Date();
    }

    /**
     * Get domain without extension
     */
    getDomainName() {
        return this.domain.replace(this.extension, '');
    }

    /**
     * Check if site has valid response time
     */
    hasValidResponseTime() {
        return this.responseTime !== null && this.responseTime > 0;
    }

    /**
     * Get response time in human readable format
     */
    getFormattedResponseTime() {
        if (!this.hasValidResponseTime()) return 'N/A';
        
        if (this.responseTime < 1000) {
            return `${this.responseTime}ms`;
        }
        
        return `${(this.responseTime / 1000).toFixed(2)}s`;
    }

    /**
     * Convert to plain object
     */
    toObject() {
        return {
            url: this.url,
            domain: this.domain,
            extension: this.extension,
            status: this.status,
            responseTime: this.responseTime,
            statusCode: this.statusCode,
            error: this.error,
            timestamp: this.timestamp
        };
    }

    /**
     * Create from plain object
     */
    static fromObject(obj) {
        const site = new Site(obj.url);
        site.status = obj.status;
        site.responseTime = obj.responseTime;
        site.statusCode = obj.statusCode;
        site.error = obj.error;
        site.timestamp = obj.timestamp ? new Date(obj.timestamp) : new Date();
        return site;
    }
}

module.exports = Site;
