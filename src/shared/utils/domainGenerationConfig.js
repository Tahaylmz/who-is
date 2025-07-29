const fs = require('fs');
const path = require('path');

class DomainGenerationConfig {
    constructor() {
        this.configPath = path.join(__dirname, '..', 'config', 'domainGeneration.json');
        this.defaultConfig = {
            allowHyphens: true,
            allowNumbers: true,
            maxLength: 20,
            minLength: 3,
            preferredPatterns: {
                hyphenPosition: 'middle', // start, middle, end, any
                numberPosition: 'end', // start, middle, end, any
                maxNumbers: 3,
                numberTypes: ['single', 'double', 'year', 'tech'] // single: 1-9, double: 10-99, year: 2024-2030, tech: 24,365,3d,4k
            },
            restrictions: {
                noStartWithHyphen: true,
                noEndWithHyphen: true,
                noConsecutiveHyphens: true,
                noStartWithNumber: true
            },
            qualityBonus: {
                noHyphens: 15,
                noNumbers: 20,
                shortLength: 30,
                pronounceable: 25
            }
        };
        this.config = this.loadConfig();
    }

    /**
     * Konfigürasyonu dosyadan yükler
     */
    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf8');
                return { ...this.defaultConfig, ...JSON.parse(data) };
            }
        } catch (error) {
            console.warn('Domain generation config yüklenemedi, varsayılan ayarlar kullanılıyor');
        }
        return this.defaultConfig;
    }

    /**
     * Konfigürasyonu dosyaya kaydeder
     */
    saveConfig() {
        try {
            const configDir = path.dirname(this.configPath);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            return true;
        } catch (error) {
            console.error('Config kaydetme hatası:', error.message);
            return false;
        }
    }

    /**
     * Tire kullanımını ayarlar
     */
    setAllowHyphens(allow) {
        this.config.allowHyphens = allow;
        this.saveConfig();
    }

    /**
     * Sayı kullanımını ayarlar
     */
    setAllowNumbers(allow) {
        this.config.allowNumbers = allow;
        this.saveConfig();
    }

    /**
     * Domain uzunluk limitleri ayarlar
     */
    setLengthLimits(min, max) {
        this.config.minLength = Math.max(1, min);
        this.config.maxLength = Math.min(50, max);
        this.saveConfig();
    }

    /**
     * Tire pozisyonu ayarlar
     */
    setHyphenPosition(position) {
        const validPositions = ['start', 'middle', 'end', 'any'];
        if (validPositions.includes(position)) {
            this.config.preferredPatterns.hyphenPosition = position;
            this.saveConfig();
        }
    }

    /**
     * Sayı pozisyonu ayarlar
     */
    setNumberPosition(position) {
        const validPositions = ['start', 'middle', 'end', 'any'];
        if (validPositions.includes(position)) {
            this.config.preferredPatterns.numberPosition = position;
            this.saveConfig();
        }
    }

    /**
     * Maksimum sayı sayısını ayarlar
     */
    setMaxNumbers(max) {
        this.config.preferredPatterns.maxNumbers = Math.max(0, Math.min(5, max));
        this.saveConfig();
    }

    /**
     * Domain'in konfigürasyona uygunluğunu kontrol eder
     */
    validateDomain(domain) {
        const issues = [];

        // Uzunluk kontrolü
        if (domain.length < this.config.minLength) {
            issues.push(`Çok kısa (min: ${this.config.minLength})`);
        }
        if (domain.length > this.config.maxLength) {
            issues.push(`Çok uzun (max: ${this.config.maxLength})`);
        }

        // Tire kontrolü
        if (!this.config.allowHyphens && domain.includes('-')) {
            issues.push('Tire kullanımı yasaklı');
        }

        // Sayı kontrolü
        if (!this.config.allowNumbers && /\d/.test(domain)) {
            issues.push('Sayı kullanımı yasaklı');
        }

        // Kısıtlama kontrolü
        if (this.config.restrictions.noStartWithHyphen && domain.startsWith('-')) {
            issues.push('Tire ile başlayamaz');
        }
        if (this.config.restrictions.noEndWithHyphen && domain.endsWith('-')) {
            issues.push('Tire ile bitemez');
        }
        if (this.config.restrictions.noConsecutiveHyphens && domain.includes('--')) {
            issues.push('Ardışık tire kullanılamaz');
        }
        if (this.config.restrictions.noStartWithNumber && /^\d/.test(domain)) {
            issues.push('Sayı ile başlayamaz');
        }

        return {
            isValid: issues.length === 0,
            issues
        };
    }

    /**
     * Domain'i konfigürasyona göre temizler
     */
    cleanDomain(domain) {
        let cleaned = domain.toLowerCase();

        // Türkçe karakterleri temizle
        cleaned = cleaned
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c');

        // Tire kısıtlamaları
        if (!this.config.allowHyphens) {
            cleaned = cleaned.replace(/-/g, '');
        } else {
            // Ardışık tireleri tek tire yap
            if (this.config.restrictions.noConsecutiveHyphens) {
                cleaned = cleaned.replace(/-+/g, '-');
            }
            // Başlangıç ve bitiş tirelerini kaldır
            if (this.config.restrictions.noStartWithHyphen) {
                cleaned = cleaned.replace(/^-+/, '');
            }
            if (this.config.restrictions.noEndWithHyphen) {
                cleaned = cleaned.replace(/-+$/, '');
            }
        }

        // Sayı kısıtlamaları
        if (!this.config.allowNumbers) {
            cleaned = cleaned.replace(/\d/g, '');
        } else {
            // Başlangıç sayılarını kaldır
            if (this.config.restrictions.noStartWithNumber) {
                cleaned = cleaned.replace(/^\d+/, '');
            }
        }

        // Uzunluk kontrolü
        if (cleaned.length > this.config.maxLength) {
            cleaned = cleaned.substring(0, this.config.maxLength);
        }

        // Geçersiz karakterleri kaldır
        cleaned = cleaned.replace(/[^a-z0-9-]/g, '');

        return cleaned;
    }

    /**
     * Konfigürasyona göre kalite puanı hesaplar
     */
    calculateQualityScore(domain) {
        let score = 50; // Base score

        // Uzunluk puanı
        if (domain.length >= this.config.minLength && domain.length <= 8) {
            score += this.config.qualityBonus.shortLength;
        } else if (domain.length <= 12) {
            score += 15;
        }

        // Tire bonusu
        if (!domain.includes('-')) {
            score += this.config.qualityBonus.noHyphens;
        }

        // Sayı bonusu
        if (!/\d/.test(domain)) {
            score += this.config.qualityBonus.noNumbers;
        }

        // Telaffuz bonusu
        const vowelCount = (domain.match(/[aeiou]/g) || []).length;
        const consonantCount = domain.length - vowelCount;
        if (vowelCount >= consonantCount * 0.3 && vowelCount <= consonantCount * 0.8) {
            score += this.config.qualityBonus.pronounceable;
        }

        return Math.min(100, Math.max(0, score));
    }

    /**
     * Sayı tipini belirler
     */
    getNumberType(num) {
        if (num >= 1 && num <= 9) return 'single';
        if (num >= 10 && num <= 99) return 'double';
        if (num >= 2024 && num <= 2030) return 'year';

        const techNumbers = [24, 365, 360, 3, 4, 5]; // 24/7, 365, 360, 3d, 4k, 5g
        if (techNumbers.includes(num)) return 'tech';

        return 'other';
    }

    /**
     * Konfigürasyona uygun sayı üretir
     */
    generateAllowedNumber() {
        const allowedTypes = this.config.preferredPatterns.numberTypes;
        const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

        switch (randomType) {
            case 'single':
                return Math.floor(Math.random() * 9) + 1;
            case 'double':
                return Math.floor(Math.random() * 90) + 10;
            case 'year':
                return Math.floor(Math.random() * 7) + 2024;
            case 'tech':
                const techNumbers = [24, 365, 360, 3, 4, 5];
                return techNumbers[Math.floor(Math.random() * techNumbers.length)];
            default:
                return Math.floor(Math.random() * 999) + 1;
        }
    }

    /**
     * Mevcut konfigürasyonu döndürür
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Konfigürasyonu sıfırlar
     */
    resetToDefaults() {
        this.config = { ...this.defaultConfig };
        this.saveConfig();
    }

    /**
     * Konfigürasyon özetini döndürür
     */
    getSummary() {
        return {
            hyphens: this.config.allowHyphens ? '✅ İzinli' : '❌ Yasaklı',
            numbers: this.config.allowNumbers ? '✅ İzinli' : '❌ Yasaklı',
            lengthRange: `${this.config.minLength}-${this.config.maxLength} karakter`,
            hyphenPosition: this.config.preferredPatterns.hyphenPosition,
            numberPosition: this.config.preferredPatterns.numberPosition,
            maxNumbers: this.config.preferredPatterns.maxNumbers,
            restrictions: Object.keys(this.config.restrictions).filter(key => this.config.restrictions[key]).length
        };
    }
}

module.exports = DomainGenerationConfig;
