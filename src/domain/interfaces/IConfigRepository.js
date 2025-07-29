/**
 * Configuration Repository Interface - Domain Layer
 * Defines the contract for configuration data persistence
 */
class IConfigRepository {
    /**
     * Get configuration value
     * @param {string} key - Configuration key
     * @param {*} defaultValue - Default value if key not found
     * @returns {Promise<*>} Configuration value
     */
    async get(key, defaultValue = null) {
        throw new Error('get method must be implemented');
    }

    /**
     * Set configuration value
     * @param {string} key - Configuration key
     * @param {*} value - Configuration value
     * @returns {Promise<void>}
     */
    async set(key, value) {
        throw new Error('set method must be implemented');
    }

    /**
     * Get all configuration
     * @returns {Promise<Object>} All configuration as object
     */
    async getAll() {
        throw new Error('getAll method must be implemented');
    }

    /**
     * Set multiple configuration values
     * @param {Object} config - Configuration object
     * @returns {Promise<void>}
     */
    async setMultiple(config) {
        throw new Error('setMultiple method must be implemented');
    }

    /**
     * Delete configuration key
     * @param {string} key - Configuration key to delete
     * @returns {Promise<boolean>} True if deleted successfully
     */
    async delete(key) {
        throw new Error('delete method must be implemented');
    }

    /**
     * Check if configuration key exists
     * @param {string} key - Configuration key
     * @returns {Promise<boolean>} True if key exists
     */
    async exists(key) {
        throw new Error('exists method must be implemented');
    }

    /**
     * Reset configuration to defaults
     * @returns {Promise<void>}
     */
    async reset() {
        throw new Error('reset method must be implemented');
    }

    /**
     * Get active extensions list
     * @returns {Promise<string[]>} Array of active extensions
     */
    async getActiveExtensions() {
        throw new Error('getActiveExtensions method must be implemented');
    }

    /**
     * Set active extensions list
     * @param {string[]} extensions - Array of extensions
     * @returns {Promise<void>}
     */
    async setActiveExtensions(extensions) {
        throw new Error('setActiveExtensions method must be implemented');
    }

    /**
     * Add extension to active list
     * @param {string} extension - Extension to add
     * @returns {Promise<void>}
     */
    async addExtension(extension) {
        throw new Error('addExtension method must be implemented');
    }

    /**
     * Remove extension from active list
     * @param {string} extension - Extension to remove
     * @returns {Promise<void>}
     */
    async removeExtension(extension) {
        throw new Error('removeExtension method must be implemented');
    }
}

module.exports = IConfigRepository;
