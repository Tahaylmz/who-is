/**
 * Domain Repository Interface - Domain Layer
 * Defines the contract for domain data persistence
 */
class IDomainRepository {
    /**
     * Save domain information
     * @param {Domain} domain - Domain entity to save
     * @returns {Promise<Domain>} Saved domain entity
     */
    async save(domain) {
        throw new Error('save method must be implemented');
    }

    /**
     * Save multiple domains
     * @param {Domain[]} domains - Array of Domain entities to save
     * @returns {Promise<Domain[]>} Array of saved domain entities
     */
    async saveMultiple(domains) {
        throw new Error('saveMultiple method must be implemented');
    }

    /**
     * Find domain by name and extension
     * @param {string} name - Domain name
     * @param {string} extension - Domain extension
     * @returns {Promise<Domain|null>} Domain entity or null if not found
     */
    async findByNameAndExtension(name, extension) {
        throw new Error('findByNameAndExtension method must be implemented');
    }

    /**
     * Find available domains
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Domain[]>} Array of available Domain entities
     */
    async findAvailable(criteria = {}) {
        throw new Error('findAvailable method must be implemented');
    }

    /**
     * Find domains by category
     * @param {string} category - Domain category
     * @param {Object} options - Query options
     * @returns {Promise<Domain[]>} Array of Domain entities
     */
    async findByCategory(category, options = {}) {
        throw new Error('findByCategory method must be implemented');
    }

    /**
     * Find premium domains
     * @param {Object} options - Query options
     * @returns {Promise<Domain[]>} Array of premium Domain entities
     */
    async findPremium(options = {}) {
        throw new Error('findPremium method must be implemented');
    }

    /**
     * Get domain statistics
     * @returns {Promise<Object>} Domain statistics object
     */
    async getStatistics() {
        throw new Error('getStatistics method must be implemented');
    }

    /**
     * Delete domain
     * @param {string} name - Domain name
     * @param {string} extension - Domain extension
     * @returns {Promise<boolean>} True if deleted successfully
     */
    async delete(name, extension) {
        throw new Error('delete method must be implemented');
    }

    /**
     * Clear all domains from a category
     * @param {string} category - Category to clear
     * @returns {Promise<number>} Number of deleted domains
     */
    async clearCategory(category) {
        throw new Error('clearCategory method must be implemented');
    }

    /**
     * Clear all domains
     * @returns {Promise<number>} Number of deleted domains
     */
    async clearAll() {
        throw new Error('clearAll method must be implemented');
    }
}

module.exports = IDomainRepository;
