/**
 * Domain Validation Service - Domain Layer
 * Provides domain validation business logic
 */
class DomainValidationService {
    /**
     * Validate domain name format
     * @param {string} domainName - Domain name to validate
     * @returns {Object} Validation result
     */
    static validateDomainName(domainName) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!domainName || typeof domainName !== 'string') {
            result.isValid = false;
            result.errors.push('Domain name is required and must be a string');
            return result;
        }

        const cleanName = domainName.trim().toLowerCase();

        // Check length
        if (cleanName.length < 1) {
            result.isValid = false;
            result.errors.push('Domain name cannot be empty');
        }

        if (cleanName.length > 63) {
            result.isValid = false;
            result.errors.push('Domain name cannot exceed 63 characters');
        }

        // Check valid characters
        const validPattern = /^[a-z0-9-]+$/;
        if (!validPattern.test(cleanName)) {
            result.isValid = false;
            result.errors.push('Domain name can only contain letters, numbers, and hyphens');
        }

        // Check hyphen rules
        if (cleanName.startsWith('-') || cleanName.endsWith('-')) {
            result.isValid = false;
            result.errors.push('Domain name cannot start or end with a hyphen');
        }

        if (cleanName.includes('--')) {
            result.warnings.push('Consecutive hyphens may affect brandability');
        }

        // Check for reserved words
        const reservedWords = ['www', 'mail', 'ftp', 'localhost', 'admin', 'root'];
        if (reservedWords.includes(cleanName)) {
            result.warnings.push('Domain name uses a reserved word');
        }

        // Check brandability
        if (cleanName.length < 4) {
            result.warnings.push('Very short domains may be hard to brand');
        }

        if (cleanName.length > 15) {
            result.warnings.push('Long domains may be hard to remember');
        }

        // Check for numbers
        if (/\d/.test(cleanName)) {
            result.warnings.push('Numbers in domain names may affect SEO');
        }

        return result;
    }

    /**
     * Validate extension format
     * @param {string} extension - Extension to validate
     * @returns {Object} Validation result
     */
    static validateExtension(extension) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!extension || typeof extension !== 'string') {
            result.isValid = false;
            result.errors.push('Extension is required and must be a string');
            return result;
        }

        const cleanExt = extension.trim().toLowerCase();

        // Check format
        if (!cleanExt.startsWith('.')) {
            result.isValid = false;
            result.errors.push('Extension must start with a dot');
        }

        if (cleanExt.length < 2) {
            result.isValid = false;
            result.errors.push('Extension must have at least one character after the dot');
        }

        if (cleanExt.length > 11) {
            result.isValid = false;
            result.errors.push('Extension cannot exceed 10 characters after the dot');
        }

        // Check valid characters
        const validPattern = /^\.[a-z]+$/;
        if (!validPattern.test(cleanExt)) {
            result.isValid = false;
            result.errors.push('Extension can only contain letters after the dot');
        }

        return result;
    }

    /**
     * Check if domain is brandable
     * @param {string} domainName - Domain name to check
     * @returns {Object} Brandability analysis
     */
    static analyzeBrandability(domainName) {
        const score = {
            total: 0,
            factors: {}
        };

        // Length factor (optimal 4-12 characters)
        const length = domainName.length;
        if (length >= 4 && length <= 8) {
            score.factors.length = 25;
        } else if (length >= 9 && length <= 12) {
            score.factors.length = 15;
        } else if (length === 3) {
            score.factors.length = 20;
        } else {
            score.factors.length = 5;
        }

        // Pronounceability factor
        const vowels = (domainName.match(/[aeiou]/g) || []).length;
        const consonants = domainName.length - vowels;
        const vowelRatio = vowels / domainName.length;
        
        if (vowelRatio >= 0.2 && vowelRatio <= 0.6) {
            score.factors.pronounceability = 25;
        } else {
            score.factors.pronounceability = 10;
        }

        // Simplicity factor (no hyphens, numbers)
        if (!domainName.includes('-') && !/\d/.test(domainName)) {
            score.factors.simplicity = 25;
        } else if (!domainName.includes('-') || !/\d/.test(domainName)) {
            score.factors.simplicity = 15;
        } else {
            score.factors.simplicity = 5;
        }

        // Memorability factor
        const repeatedChars = domainName.match(/(.)\1+/g);
        if (!repeatedChars && domainName.length <= 8) {
            score.factors.memorability = 25;
        } else if (domainName.length <= 12) {
            score.factors.memorability = 15;
        } else {
            score.factors.memorability = 10;
        }

        score.total = Object.values(score.factors).reduce((a, b) => a + b, 0);

        return {
            score: score.total,
            grade: this.getGrade(score.total),
            factors: score.factors,
            recommendations: this.getBrandabilityRecommendations(domainName, score)
        };
    }

    /**
     * Get grade from score
     * @param {number} score - Score value
     * @returns {string} Grade letter
     */
    static getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }

    /**
     * Get brandability recommendations
     * @param {string} domainName - Domain name
     * @param {Object} score - Score object
     * @returns {string[]} Array of recommendations
     */
    static getBrandabilityRecommendations(domainName, score) {
        const recommendations = [];

        if (score.factors.length < 20) {
            if (domainName.length > 12) {
                recommendations.push('Consider shortening the domain name for better memorability');
            } else if (domainName.length < 4) {
                recommendations.push('Consider a slightly longer name for better brandability');
            }
        }

        if (score.factors.pronounceability < 20) {
            recommendations.push('Add vowels to improve pronounceability');
        }

        if (score.factors.simplicity < 20) {
            recommendations.push('Remove hyphens and numbers for better simplicity');
        }

        if (score.factors.memorability < 20) {
            recommendations.push('Avoid repeated characters and keep it short');
        }

        if (recommendations.length === 0) {
            recommendations.push('Great domain! This has strong branding potential.');
        }

        return recommendations;
    }

    /**
     * Check SEO friendliness
     * @param {string} domainName - Domain name to check
     * @param {string} extension - Domain extension
     * @returns {Object} SEO analysis
     */
    static analyzeSEO(domainName, extension) {
        const factors = {};
        let totalScore = 0;

        // Extension factor
        const premiumExtensions = ['.com', '.net', '.org'];
        const goodExtensions = ['.io', '.co', '.app', '.tech'];
        
        if (premiumExtensions.includes(extension)) {
            factors.extension = 30;
        } else if (goodExtensions.includes(extension)) {
            factors.extension = 20;
        } else {
            factors.extension = 10;
        }

        // Length factor for SEO
        if (domainName.length >= 4 && domainName.length <= 12) {
            factors.length = 25;
        } else if (domainName.length <= 15) {
            factors.length = 15;
        } else {
            factors.length = 5;
        }

        // Keyword potential
        if (domainName.length >= 6 && domainName.length <= 12 && !/\d/.test(domainName)) {
            factors.keywordPotential = 25;
        } else {
            factors.keywordPotential = 10;
        }

        // Hyphen penalty
        if (!domainName.includes('-')) {
            factors.hyphenFree = 20;
        } else {
            factors.hyphenFree = 5;
        }

        totalScore = Object.values(factors).reduce((a, b) => a + b, 0);

        return {
            score: totalScore,
            grade: this.getGrade(totalScore),
            factors,
            isSEOFriendly: totalScore >= 70
        };
    }
}

module.exports = DomainValidationService;
