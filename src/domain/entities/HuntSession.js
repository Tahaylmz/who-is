/**
 * Hunt Session Entity - Domain Layer
 * Represents a domain hunting session
 */
class HuntSession {
    constructor(options = {}) {
        this.id = this.generateId();
        this.startTime = new Date();
        this.endTime = null;
        this.status = 'active'; // 'active' | 'paused' | 'completed' | 'cancelled'
        
        // Configuration
        this.categories = options.categories || ['premium', 'tech', 'business'];
        this.extensions = options.extensions || ['.com', '.net', '.org'];
        this.sector = options.sector || null;
        this.useAI = options.useAI || false;
        this.interval = options.interval || 2000;
        this.limit = options.limit || 0; // 0 = unlimited
        
        // Statistics
        this.stats = {
            totalChecked: 0,
            availableFound: 0,
            premiumFound: 0,
            shortFound: 0,
            errorCount: 0,
            averageResponseTime: 0,
            lastCheckTime: null
        };
        
        // Results
        this.availableDomains = [];
        this.errors = [];
    }

    /**
     * Generate unique session ID
     */
    generateId() {
        return `hunt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Start the hunting session
     */
    start() {
        this.status = 'active';
        this.startTime = new Date();
    }

    /**
     * Pause the hunting session
     */
    pause() {
        this.status = 'paused';
    }

    /**
     * Resume the hunting session
     */
    resume() {
        this.status = 'active';
    }

    /**
     * Complete the hunting session
     */
    complete() {
        this.status = 'completed';
        this.endTime = new Date();
    }

    /**
     * Cancel the hunting session
     */
    cancel() {
        this.status = 'cancelled';
        this.endTime = new Date();
    }

    /**
     * Add checked domain to statistics
     */
    addCheckedDomain(domain, responseTime = null, error = null) {
        this.stats.totalChecked++;
        this.stats.lastCheckTime = new Date();
        
        if (error) {
            this.stats.errorCount++;
            this.errors.push({
                domain: domain.fullDomain,
                error: error.message,
                timestamp: new Date()
            });
        }
        
        if (responseTime) {
            // Update average response time
            const currentAvg = this.stats.averageResponseTime;
            const count = this.stats.totalChecked - this.stats.errorCount;
            this.stats.averageResponseTime = ((currentAvg * (count - 1)) + responseTime) / count;
        }
    }

    /**
     * Add available domain to results
     */
    addAvailableDomain(domain) {
        this.stats.availableFound++;
        
        if (domain.isPremium()) {
            this.stats.premiumFound++;
        }
        
        if (domain.isShort()) {
            this.stats.shortFound++;
        }
        
        this.availableDomains.push({
            ...domain.toObject(),
            foundAt: new Date(),
            sessionId: this.id
        });
    }

    /**
     * Check if limit reached
     */
    isLimitReached() {
        return this.limit > 0 && this.stats.totalChecked >= this.limit;
    }

    /**
     * Get session duration
     */
    getDuration() {
        const endTime = this.endTime || new Date();
        return endTime - this.startTime;
    }

    /**
     * Get formatted duration
     */
    getFormattedDuration() {
        const duration = this.getDuration();
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        
        return `${seconds}s`;
    }

    /**
     * Get success rate percentage
     */
    getSuccessRate() {
        if (this.stats.totalChecked === 0) return 0;
        return ((this.stats.totalChecked - this.stats.errorCount) / this.stats.totalChecked * 100).toFixed(2);
    }

    /**
     * Get domains per minute rate
     */
    getDomainsPerMinute() {
        const durationMinutes = this.getDuration() / (1000 * 60);
        return durationMinutes > 0 ? (this.stats.totalChecked / durationMinutes).toFixed(2) : 0;
    }

    /**
     * Get availability rate percentage
     */
    getAvailabilityRate() {
        if (this.stats.totalChecked === 0) return 0;
        return (this.stats.availableFound / this.stats.totalChecked * 100).toFixed(2);
    }

    /**
     * Get session summary
     */
    getSummary() {
        return {
            id: this.id,
            status: this.status,
            duration: this.getFormattedDuration(),
            totalChecked: this.stats.totalChecked,
            availableFound: this.stats.availableFound,
            premiumFound: this.stats.premiumFound,
            shortFound: this.stats.shortFound,
            errorCount: this.stats.errorCount,
            successRate: this.getSuccessRate(),
            availabilityRate: this.getAvailabilityRate(),
            domainsPerMinute: this.getDomainsPerMinute(),
            averageResponseTime: Math.round(this.stats.averageResponseTime)
        };
    }

    /**
     * Convert to plain object
     */
    toObject() {
        return {
            id: this.id,
            startTime: this.startTime,
            endTime: this.endTime,
            status: this.status,
            categories: this.categories,
            extensions: this.extensions,
            sector: this.sector,
            useAI: this.useAI,
            interval: this.interval,
            limit: this.limit,
            stats: this.stats,
            availableDomains: this.availableDomains,
            errors: this.errors.slice(-10) // Keep only last 10 errors
        };
    }

    /**
     * Create from plain object
     */
    static fromObject(obj) {
        const session = new HuntSession({
            categories: obj.categories,
            extensions: obj.extensions,
            sector: obj.sector,
            useAI: obj.useAI,
            interval: obj.interval,
            limit: obj.limit
        });
        
        session.id = obj.id;
        session.startTime = new Date(obj.startTime);
        session.endTime = obj.endTime ? new Date(obj.endTime) : null;
        session.status = obj.status;
        session.stats = obj.stats || session.stats;
        session.availableDomains = obj.availableDomains || [];
        session.errors = obj.errors || [];
        
        return session;
    }
}

module.exports = HuntSession;
