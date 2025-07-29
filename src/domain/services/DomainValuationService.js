/**
 * Domain Valuation Service - Domain Layer
 * Provides domain valuation business logic
 */
class DomainValuationService {
    /**
     * Calculate estimated domain value
     * @param {Domain} domain - Domain entity to value
     * @returns {Object} Valuation result
     */
    static calculateValue(domain) {
        const factors = {};
        let baseValue = 10; // Minimum base value

        // Length factor
        factors.length = this.calculateLengthValue(domain.getLength());
        
        // Extension factor
        factors.extension = this.calculateExtensionValue(domain.extension);
        
        // Quality factor
        factors.quality = this.calculateQualityValue(domain.name);
        
        // Category factor
        factors.category = this.calculateCategoryValue(domain.getCategory());
        
        // SEO factor
        factors.seo = this.calculateSEOValue(domain.name, domain.extension);

        // Calculate total multiplier
        const totalMultiplier = Object.values(factors).reduce((a, b) => a + b, 0);
        const estimatedValue = Math.round(baseValue * totalMultiplier);

        return {
            estimatedValue,
            factors,
            confidence: this.calculateConfidence(factors),
            valueRange: this.calculateValueRange(estimatedValue),
            category: this.getValueCategory(estimatedValue)
        };
    }

    /**
     * Calculate length-based value multiplier
     * @param {number} length - Domain length
     * @returns {number} Length multiplier
     */
    static calculateLengthValue(length) {
        if (length <= 3) return 50; // Ultra premium
        if (length <= 4) return 25; // Premium
        if (length <= 6) return 15; // Very good
        if (length <= 8) return 8;  // Good
        if (length <= 10) return 4; // Average
        if (length <= 12) return 2; // Below average
        return 1; // Poor
    }

    /**
     * Calculate extension-based value multiplier
     * @param {string} extension - Domain extension
     * @returns {number} Extension multiplier
     */
    static calculateExtensionValue(extension) {
        const premiumExtensions = {
            '.com': 20,
            '.net': 8,
            '.org': 6
        };

        const goodExtensions = {
            '.io': 12,
            '.co': 10,
            '.ai': 15,
            '.app': 8,
            '.tech': 6,
            '.dev': 8
        };

        const standardExtensions = {
            '.info': 2,
            '.biz': 2,
            '.online': 2,
            '.site': 2
        };

        if (premiumExtensions[extension]) {
            return premiumExtensions[extension];
        }

        if (goodExtensions[extension]) {
            return goodExtensions[extension];
        }

        if (standardExtensions[extension]) {
            return standardExtensions[extension];
        }

        return 1; // Unknown extensions
    }

    /**
     * Calculate quality-based value multiplier
     * @param {string} domainName - Domain name
     * @returns {number} Quality multiplier
     */
    static calculateQualityValue(domainName) {
        let multiplier = 1;

        // Pronounceability
        const vowels = (domainName.match(/[aeiou]/g) || []).length;
        const vowelRatio = vowels / domainName.length;
        if (vowelRatio >= 0.2 && vowelRatio <= 0.6) {
            multiplier += 2;
        }

        // No hyphens bonus
        if (!domainName.includes('-')) {
            multiplier += 3;
        }

        // No numbers bonus
        if (!/\d/.test(domainName)) {
            multiplier += 2;
        }

        // Dictionary word bonus
        if (this.isDictionaryWord(domainName)) {
            multiplier += 5;
        }

        // Brandable pattern bonus
        if (this.isBrandablePattern(domainName)) {
            multiplier += 3;
        }

        return multiplier;
    }

    /**
     * Calculate category-based value multiplier
     * @param {string} category - Domain category
     * @returns {number} Category multiplier
     */
    static calculateCategoryValue(category) {
        const categoryMultipliers = {
            'ultra-short': 20,
            'short': 10,
            'brandable': 8,
            'numeric': 3,
            'hyphenated': 2,
            'mixed': 2,
            'standard': 4
        };

        return categoryMultipliers[category] || 1;
    }

    /**
     * Calculate SEO-based value multiplier
     * @param {string} domainName - Domain name
     * @param {string} extension - Domain extension
     * @returns {number} SEO multiplier
     */
    static calculateSEOValue(domainName, extension) {
        let multiplier = 1;

        // Length SEO factor
        if (domainName.length >= 4 && domainName.length <= 12) {
            multiplier += 2;
        }

        // Extension SEO factor
        if (['.com', '.net', '.org'].includes(extension)) {
            multiplier += 3;
        }

        // Clean domain factor
        if (!domainName.includes('-') && !/\d/.test(domainName)) {
            multiplier += 2;
        }

        return multiplier;
    }

    /**
     * Check if domain name is a dictionary word
     * @param {string} domainName - Domain name
     * @returns {boolean} True if dictionary word
     */
    static isDictionaryWord(domainName) {
        // Common English words that add value
        const valuableWords = [
            'app', 'web', 'net', 'tech', 'digital', 'smart', 'pro', 'expert',
            'global', 'world', 'best', 'top', 'prime', 'max', 'plus', 'ultra',
            'super', 'mega', 'fast', 'quick', 'easy', 'simple', 'auto', 'mobile',
            'cloud', 'data', 'secure', 'safe', 'gold', 'diamond', 'star', 'ace'
        ];

        return valuableWords.includes(domainName.toLowerCase());
    }

    /**
     * Check if domain has brandable pattern
     * @param {string} domainName - Domain name
     * @returns {boolean} True if brandable pattern
     */
    static isBrandablePattern(domainName) {
        // Check for alternating consonant-vowel patterns
        const pattern1 = /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz][aeiou]/i;
        const pattern2 = /^[aeiou][bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]/i;
        
        return pattern1.test(domainName) || pattern2.test(domainName);
    }

    /**
     * Calculate confidence level
     * @param {Object} factors - Valuation factors
     * @returns {number} Confidence percentage
     */
    static calculateConfidence(factors) {
        // Higher confidence for domains with multiple strong factors
        let confidence = 50; // Base confidence

        const strongFactors = Object.values(factors).filter(value => value >= 10).length;
        confidence += strongFactors * 10;

        // Cap at 95%
        return Math.min(confidence, 95);
    }

    /**
     * Calculate value range
     * @param {number} estimatedValue - Estimated value
     * @returns {Object} Value range object
     */
    static calculateValueRange(estimatedValue) {
        const variance = 0.3; // 30% variance
        const lowerBound = Math.round(estimatedValue * (1 - variance));
        const upperBound = Math.round(estimatedValue * (1 + variance));

        return {
            low: lowerBound,
            high: upperBound,
            estimated: estimatedValue
        };
    }

    /**
     * Get value category
     * @param {number} value - Domain value
     * @returns {string} Value category
     */
    static getValueCategory(value) {
        if (value >= 100000) return 'Ultra Premium';
        if (value >= 50000) return 'Premium Plus';
        if (value >= 10000) return 'Premium';
        if (value >= 5000) return 'High Value';
        if (value >= 1000) return 'Good Value';
        if (value >= 500) return 'Average';
        if (value >= 100) return 'Basic';
        return 'Low Value';
    }

    /**
     * Compare domain values
     * @param {Domain[]} domains - Array of domains to compare
     * @returns {Object} Comparison result
     */
    static compareDomains(domains) {
        const valuations = domains.map(domain => ({
            domain,
            valuation: this.calculateValue(domain)
        }));

        // Sort by estimated value
        valuations.sort((a, b) => b.valuation.estimatedValue - a.valuation.estimatedValue);

        return {
            rankings: valuations,
            bestValue: valuations[0],
            totalValue: valuations.reduce((sum, v) => sum + v.valuation.estimatedValue, 0),
            averageValue: Math.round(valuations.reduce((sum, v) => sum + v.valuation.estimatedValue, 0) / valuations.length)
        };
    }

    /**
     * Get market trends factor
     * @param {string} extension - Domain extension
     * @returns {number} Trend multiplier
     */
    static getMarketTrendsFactor(extension) {
        // 2024-2025 market trends
        const trendingExtensions = {
            '.ai': 2.5,
            '.io': 1.8,
            '.app': 1.5,
            '.dev': 1.4,
            '.tech': 1.3,
            '.co': 1.2
        };

        const decliningExtensions = {
            '.info': 0.8,
            '.biz': 0.7
        };

        if (trendingExtensions[extension]) {
            return trendingExtensions[extension];
        }

        if (decliningExtensions[extension]) {
            return decliningExtensions[extension];
        }

        return 1.0; // Neutral
    }
}

module.exports = DomainValuationService;
