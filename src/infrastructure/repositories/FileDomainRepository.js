const { Logger } = require('../../shared/utils/Logger');
const path = require('path');

/**
 * 📁 File Domain Repository Implementation
 * Domain verilerini dosya sisteminde saklar
 */
class FileDomainRepository {
    constructor(config = {}) {
        this.dataPath = config.dataPath || path.join(process.cwd(), 'data');
        this.domainsFile = path.join(this.dataPath, 'domains.json');
        this.historyFile = path.join(this.dataPath, 'history.json');
        this.favoriteFile = path.join(this.dataPath, 'favorites.json');
        this.logger = new Logger('FileDomainRepository');
        this.fileHelper = {
            exists: (path) => require('fs').existsSync(path),
            createDirectory: (path) => require('fs').mkdirSync(path, { recursive: true }),
            readFile: (path) => require('fs').promises.readFile(path, 'utf8'),
            writeFile: (path, content) => require('fs').promises.writeFile(path, content)
        };
        
        this._ensureDataDirectory();
    }

    /**
     * 💾 Domain kaydeder
     */
    async saveDomain(domain) {
        try {
            this.logger.info(`💾 Saving domain: ${domain.name}`);
            
            const domains = await this._loadDomains();
            const existingIndex = domains.findIndex(d => d.name === domain.name);
            
            if (existingIndex >= 0) {
                domains[existingIndex] = {
                    ...domains[existingIndex],
                    ...domain,
                    updatedAt: new Date().toISOString()
                };
            } else {
                domains.push({
                    ...domain,
                    id: this._generateId(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            
            await this._saveDomains(domains);
            this.logger.info(`✅ Domain saved successfully: ${domain.name}`);
            
            return domain;
        } catch (error) {
            this.logger.error(`❌ Failed to save domain: ${domain.name}`, error);
            throw error;
        }
    }

    /**
     * 🔍 Domain'i isimle bulur
     */
    async findByName(name) {
        try {
            const domains = await this._loadDomains();
            return domains.find(d => d.name === name) || null;
        } catch (error) {
            this.logger.error(`❌ Failed to find domain: ${name}`, error);
            return null;
        }
    }

    /**
     * 📋 Tüm domainleri listeler
     */
    async findAll(filters = {}) {
        try {
            let domains = await this._loadDomains();
            
            // Status filtreleme
            if (filters.status) {
                domains = domains.filter(d => d.status === filters.status);
            }
            
            // Extension filtreleme
            if (filters.extension) {
                domains = domains.filter(d => d.extension === filters.extension);
            }
            
            // Arama terimi filtreleme
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                domains = domains.filter(d => 
                    d.name.toLowerCase().includes(searchTerm) ||
                    d.description?.toLowerCase().includes(searchTerm)
                );
            }
            
            // Sıralama
            if (filters.sortBy) {
                domains.sort((a, b) => {
                    const aVal = a[filters.sortBy];
                    const bVal = b[filters.sortBy];
                    return filters.sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                });
            }
            
            // Sayfalama
            if (filters.limit) {
                const offset = filters.offset || 0;
                domains = domains.slice(offset, offset + filters.limit);
            }
            
            return domains;
        } catch (error) {
            this.logger.error('❌ Failed to load domains', error);
            return [];
        }
    }

    /**
     * 🗑️ Domain siler
     */
    async delete(name) {
        try {
            this.logger.info(`🗑️ Deleting domain: ${name}`);
            
            const domains = await this._loadDomains();
            const filteredDomains = domains.filter(d => d.name !== name);
            
            if (domains.length === filteredDomains.length) {
                this.logger.warn(`⚠️ Domain not found for deletion: ${name}`);
                return false;
            }
            
            await this._saveDomains(filteredDomains);
            this.logger.info(`✅ Domain deleted successfully: ${name}`);
            
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to delete domain: ${name}`, error);
            throw error;
        }
    }

    /**
     * 📊 Domain istatistikleri
     */
    async getStats() {
        try {
            const domains = await this._loadDomains();
            
            const stats = {
                total: domains.length,
                available: domains.filter(d => d.status === 'available').length,
                taken: domains.filter(d => d.status === 'taken').length,
                premium: domains.filter(d => d.isPremium === true).length,
                extensions: {}
            };
            
            // Extension istatistikleri
            domains.forEach(domain => {
                const ext = domain.extension || 'unknown';
                stats.extensions[ext] = (stats.extensions[ext] || 0) + 1;
            });
            
            return stats;
        } catch (error) {
            this.logger.error('❌ Failed to get domain stats', error);
            return { total: 0, available: 0, taken: 0, premium: 0, extensions: {} };
        }
    }

    /**
     * 🔍 Arama geçmişini saklar
     */
    async saveHistory(searchData) {
        try {
            const history = await this._loadHistory();
            history.unshift({
                ...searchData,
                id: this._generateId(),
                timestamp: new Date().toISOString()
            });
            
            // Son 100 arama kaydet
            const limitedHistory = history.slice(0, 100);
            await this.fileHelper.writeFile(this.historyFile, JSON.stringify(limitedHistory, null, 2));
            
            return searchData;
        } catch (error) {
            this.logger.error('❌ Failed to save search history', error);
            throw error;
        }
    }

    /**
     * 📖 Arama geçmişini döndürür
     */
    async getHistory(limit = 20) {
        try {
            const history = await this._loadHistory();
            return history.slice(0, limit);
        } catch (error) {
            this.logger.error('❌ Failed to load search history', error);
            return [];
        }
    }

    /**
     * ⭐ Favorilere ekler
     */
    async addToFavorites(domainName) {
        try {
            const favorites = await this._loadFavorites();
            if (!favorites.includes(domainName)) {
                favorites.push(domainName);
                await this.fileHelper.writeFile(this.favoriteFile, JSON.stringify(favorites, null, 2));
            }
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to add to favorites: ${domainName}`, error);
            throw error;
        }
    }

    /**
     * ⭐ Favorilerden çıkarır
     */
    async removeFromFavorites(domainName) {
        try {
            const favorites = await this._loadFavorites();
            const filteredFavorites = favorites.filter(name => name !== domainName);
            await this.fileHelper.writeFile(this.favoriteFile, JSON.stringify(filteredFavorites, null, 2));
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to remove from favorites: ${domainName}`, error);
            throw error;
        }
    }

    /**
     * ⭐ Favorileri listeler
     */
    async getFavorites() {
        try {
            return await this._loadFavorites();
        } catch (error) {
            this.logger.error('❌ Failed to load favorites', error);
            return [];
        }
    }

    /**
     * 📁 Data dizinini oluşturur
     */
    _ensureDataDirectory() {
        if (!this.fileHelper.exists(this.dataPath)) {
            this.fileHelper.createDirectory(this.dataPath);
            this.logger.info(`📁 Created data directory: ${this.dataPath}`);
        }
    }

    /**
     * 📋 Domainleri yükler
     */
    async _loadDomains() {
        try {
            if (!this.fileHelper.exists(this.domainsFile)) {
                return [];
            }
            const content = await this.fileHelper.readFile(this.domainsFile);
            return JSON.parse(content);
        } catch (error) {
            this.logger.warn('⚠️ Failed to load domains file, returning empty array');
            return [];
        }
    }

    /**
     * 💾 Domainleri kaydeder
     */
    async _saveDomains(domains) {
        const content = JSON.stringify(domains, null, 2);
        await this.fileHelper.writeFile(this.domainsFile, content);
    }

    /**
     * 📖 Geçmişi yükler
     */
    async _loadHistory() {
        try {
            if (!this.fileHelper.exists(this.historyFile)) {
                return [];
            }
            const content = await this.fileHelper.readFile(this.historyFile);
            return JSON.parse(content);
        } catch (error) {
            this.logger.warn('⚠️ Failed to load history file, returning empty array');
            return [];
        }
    }

    /**
     * ⭐ Favorileri yükler
     */
    async _loadFavorites() {
        try {
            if (!this.fileHelper.exists(this.favoriteFile)) {
                return [];
            }
            const content = await this.fileHelper.readFile(this.favoriteFile);
            return JSON.parse(content);
        } catch (error) {
            this.logger.warn('⚠️ Failed to load favorites file, returning empty array');
            return [];
        }
    }

    /**
     * 🆔 Benzersiz ID üretir
     */
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

module.exports = { FileDomainRepository };
