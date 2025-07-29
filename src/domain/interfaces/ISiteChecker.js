/**
 * Site Checker Interface - Domain Layer
 * Defines the contract for site checking operations
 */
class ISiteChecker {
    /**
     * Check a single site status
     * @param {string} url - The URL to check
     * @param {Object} options - Check options
     * @returns {Promise<Site>} Site entity with status
     */
    async checkSite(url, options = {}) {
        throw new Error('checkSite method must be implemented');
    }

    /**
     * Check multiple sites status
     * @param {string[]} urls - Array of URLs to check
     * @param {Object} options - Check options
     * @returns {Promise<Site[]>} Array of Site entities
     */
    async checkMultipleSites(urls, options = {}) {
        throw new Error('checkMultipleSites method must be implemented');
    }

    /**
     * Check domain extensions for a given domain name
     * @param {string} domainName - Domain name without extension
     * @param {string[]} extensions - Array of extensions to check
     * @param {Object} options - Check options
     * @returns {Promise<Site[]>} Array of Site entities
     */
    async checkDomainExtensions(domainName, extensions, options = {}) {
        throw new Error('checkDomainExtensions method must be implemented');
    }

    /**
     * Check domain availability using WHOIS
     * @param {string} domainName - Domain name without extension
     * @param {string[]} extensions - Array of extensions to check
     * @param {Object} options - Check options
     * @returns {Promise<Domain[]>} Array of Domain entities with availability info
     */
    async checkDomainAvailability(domainName, extensions, options = {}) {
        throw new Error('checkDomainAvailability method must be implemented');
    }
}

module.exports = ISiteChecker;
