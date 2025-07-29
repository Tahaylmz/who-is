/**
 * Domain Entity - Domain Layer
 * Represents a domain name in the system
 */
class Domain {
    constructor(name, extension = '.com') {
        this.name = this.normalizeName(name);
        this.extension = this.normalizeExtension(extension);
        this.fullDomain = `${this.name}${this.extension}`;
        this.isAvailable = null; // null | true | false
        this.registrar = null;
        this.creationDate = null;
        this.expirationDate = null;
        this.lastChecked = null;
        this.value = null; // Estimated market value
        this.qualityScore = null; // 0-100
        this.seoScore = null; // SEO friendliness score
    }

    /**
     * Normalize domain name
     */
    normalizeName(name) {
        if (!name) throw new Error('Domain name is required');
        
        return name
            .toLowerCase()
            .trim()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .split('.')[0]; // Remove extension if present
    }

    /**
     * Normalize extension
     */
    normalizeExtension(extension) {
        if (!extension) return '.com';
        
        return extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
    }

    /**
     * Check if domain is available for registration
     */
    setAvailable(available, registrar = null, creationDate = null, expirationDate = null) {
        this.isAvailable = available;
        this.registrar = registrar;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
        this.lastChecked = new Date();
    }

    /**
     * Set domain value estimation
     */
    setValue(value, qualityScore = null, seoScore = null) {
        this.value = value;
        this.qualityScore = qualityScore;
        this.seoScore = seoScore;
    }

    /**
     * Get domain length (excluding extension)
     */
    getLength() {
        return this.name.length;
    }

    /**
     * Check if domain is short (≤ 6 characters)
     */
    isShort() {
        return this.getLength() <= 6;
    }

    /**
     * Check if domain is premium (short, brandable, etc.)
     */
    isPremium() {
        return this.isShort() || 
               this.qualityScore >= 80 || 
               this.value >= 1000 ||
               this.extension === '.com';
    }

    /**
     * Check if domain contains numbers
     */
    hasNumbers() {
        return /\d/.test(this.name);
    }

    /**
     * Check if domain contains hyphens
     */
    hasHyphens() {
        return this.name.includes('-');
    }

    /**
     * Check if domain is SEO friendly
     */
    isSEOFriendly() {
        // No numbers, no hyphens, reasonable length
        return !this.hasNumbers() && 
               !this.hasHyphens() && 
               this.getLength() >= 4 && 
               this.getLength() <= 12;
    }

    /**
     * Get domain category based on characteristics
     */
    getCategory() {
        if (this.getLength() <= 3) return 'ultra-short';
        if (this.getLength() <= 6) return 'short';
        if (this.hasNumbers() && this.hasHyphens()) return 'mixed';
        if (this.hasNumbers()) return 'numeric';
        if (this.hasHyphens()) return 'hyphenated';
        if (this.isSEOFriendly()) return 'brandable';
        return 'standard';
    }

    /**
     * Get formatted value
     */
    getFormattedValue() {
        if (!this.value) return 'N/A';
        
        if (this.value >= 1000000) {
            return `$${(this.value / 1000000).toFixed(1)}M`;
        }
        
        if (this.value >= 1000) {
            return `$${(this.value / 1000).toFixed(1)}K`;
        }
        
        return `$${this.value}`;
    }

    /**
     * Get quality rating
     */
    getQualityRating() {
        if (!this.qualityScore) return 'Unknown';
        
        if (this.qualityScore >= 90) return 'Excellent';
        if (this.qualityScore >= 75) return 'Good';
        if (this.qualityScore >= 60) return 'Fair';
        if (this.qualityScore >= 40) return 'Poor';
        return 'Very Poor';
    }

    /**
     * Convert to plain object
     */
    toObject() {
        return {
            name: this.name,
            extension: this.extension,
            fullDomain: this.fullDomain,
            isAvailable: this.isAvailable,
            registrar: this.registrar,
            creationDate: this.creationDate,
            expirationDate: this.expirationDate,
            lastChecked: this.lastChecked,
            value: this.value,
            qualityScore: this.qualityScore,
            seoScore: this.seoScore,
            category: this.getCategory(),
            length: this.getLength()
        };
    }

    /**
     * Create from plain object
     */
    static fromObject(obj) {
        const domain = new Domain(obj.name, obj.extension);
        domain.isAvailable = obj.isAvailable;
        domain.registrar = obj.registrar;
        domain.creationDate = obj.creationDate ? new Date(obj.creationDate) : null;
        domain.expirationDate = obj.expirationDate ? new Date(obj.expirationDate) : null;
        domain.lastChecked = obj.lastChecked ? new Date(obj.lastChecked) : null;
        domain.value = obj.value;
        domain.qualityScore = obj.qualityScore;
        domain.seoScore = obj.seoScore;
        return domain;
    }

    /**
     * Create multiple domains with different extensions
     */
    static createVariants(name, extensions) {
        return extensions.map(ext => new Domain(name, ext));
    }
}

module.exports = Domain;
