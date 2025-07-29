/**
 * Domain Generator Interface - Domain Layer
 * Defines the contract for domain generation operations
 */
class IDomainGenerator {
    /**
     * Generate random domains based on categories
     * @param {string[]} categories - Categories to generate domains for
     * @param {Object} options - Generation options
     * @returns {Promise<Domain[]>} Array of generated Domain entities
     */
    async generateDomains(categories, options = {}) {
        throw new Error('generateDomains method must be implemented');
    }

    /**
     * Generate domains based on a keyword
     * @param {string} keyword - Base keyword
     * @param {Object} options - Generation options
     * @returns {Promise<Domain[]>} Array of generated Domain entities
     */
    async generateFromKeyword(keyword, options = {}) {
        throw new Error('generateFromKeyword method must be implemented');
    }

    /**
     * Generate AI-powered domain suggestions
     * @param {string} description - Business/project description
     * @param {Object} options - Generation options
     * @returns {Promise<Domain[]>} Array of AI-generated Domain entities
     */
    async generateAISuggestions(description, options = {}) {
        throw new Error('generateAISuggestions method must be implemented');
    }

    /**
     * Generate trend-based domains
     * @param {Object} options - Generation options
     * @returns {Promise<Domain[]>} Array of trend-based Domain entities
     */
    async generateTrendDomains(options = {}) {
        throw new Error('generateTrendDomains method must be implemented');
    }

    /**
     * Generate sector-specific domains
     * @param {string} sector - Target sector
     * @param {Object} options - Generation options
     * @returns {Promise<Domain[]>} Array of sector-specific Domain entities
     */
    async generateSectorDomains(sector, options = {}) {
        throw new Error('generateSectorDomains method must be implemented');
    }
}

module.exports = IDomainGenerator;
