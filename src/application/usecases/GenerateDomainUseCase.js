const { Logger } = require('../../shared/utils/Logger');

/**
 * 🎲 Generate Domain Use Case
 * Domain üretme işlemlerini yönetir
 */
class GenerateDomainUseCase {
    constructor(domainGenerator, domainValidationService, domainRepository) {
        this.domainGenerator = domainGenerator;
        this.domainValidationService = domainValidationService;
        this.domainRepository = domainRepository;
        this.logger = new Logger('GenerateDomainUseCase');
    }

    /**
     * 🎯 Anahtar kelimelerle domain üretir
     */
    async execute(keywords, options = {}) {
        try {
            this.logger.info(`🎲 Generating domains for keywords: ${keywords.join(', ')}`);
            
            const {
                count = 20,
                style = 'modern',
                businessType = 'general',
                maxLength = 15,
                includeNumbers = false,
                includeDashes = false,
                filterExisting = true,
                saveResults = true
            } = options;

            // 1. Domain önerileri üret
            const suggestions = await this.domainGenerator.generateDomains(keywords, {
                count: count * 2, // Filtreleme için fazla üret
                style,
                businessType,
                maxLength,
                includeNumbers,
                includeDashes
            });

            // 2. Önerileri filtrele ve validate et
            let validSuggestions = this._filterSuggestions(suggestions, options);

            // 3. Mevcut domain'leri filtrele (opsiyonel)
            if (filterExisting) {
                validSuggestions = await this._filterExistingDomains(validSuggestions);
            }

            // 4. Sonuçları sınırla
            const finalSuggestions = validSuggestions.slice(0, count);

            // 5. Domain önerilerini zenginleştir
            const enrichedSuggestions = this._enrichSuggestions(finalSuggestions, keywords);

            // 6. Sonuçları kaydet (opsiyonel)
            if (saveResults) {
                await this._saveGenerationResults(keywords, enrichedSuggestions, options);
            }

            this.logger.info(`✅ Generated ${enrichedSuggestions.length} domain suggestions`);

            return {
                success: true,
                message: `Generated ${enrichedSuggestions.length} domain suggestions`,
                data: {
                    keywords,
                    suggestions: enrichedSuggestions,
                    stats: this._generateStats(enrichedSuggestions),
                    options,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            this.logger.error('❌ Domain generation failed', error);
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }

    /**
     * 🚀 Hızlı domain önerisi
     */
    async quickGenerate(keyword, count = 10) {
        return await this.execute([keyword], {
            count,
            style: 'modern',
            maxLength: 12,
            includeNumbers: false,
            includeDashes: false,
            filterExisting: false,
            saveResults: false
        });
    }

    /**
     * 🎨 Yaratıcı domain önerileri
     */
    async creativeGenerate(keywords, businessType = 'creative') {
        return await this.execute(keywords, {
            count: 25,
            style: 'creative',
            businessType,
            maxLength: 18,
            includeNumbers: true,
            includeDashes: true,
            filterExisting: true,
            saveResults: true
        });
    }

    /**
     * 💼 İş odaklı domain önerileri
     */
    async businessGenerate(keywords, industry = 'business') {
        return await this.execute(keywords, {
            count: 30,
            style: 'professional',
            businessType: industry,
            maxLength: 15,
            includeNumbers: false,
            includeDashes: false,
            filterExisting: true,
            saveResults: true
        });
    }

    /**
     * 🔧 Teknoloji odaklı domain önerileri
     */
    async techGenerate(keywords) {
        return await this.execute(keywords, {
            count: 40,
            style: 'modern',
            businessType: 'tech',
            maxLength: 12,
            includeNumbers: true,
            includeDashes: false,
            filterExisting: true,
            saveResults: true
        });
    }

    /**
     * 🎲 Rastgele domain önerileri
     */
    async randomGenerate(category = 'general', count = 15) {
        const categoryKeywords = this._getCategoryKeywords(category);
        const randomKeywords = this._getRandomElements(categoryKeywords, 2);
        
        return await this.execute(randomKeywords, {
            count,
            style: 'creative',
            businessType: category,
            includeNumbers: true,
            includeDashes: true,
            filterExisting: false,
            saveResults: false
        });
    }

    /**
     * ✅ Önerileri filtrele
     */
    _filterSuggestions(suggestions, options) {
        return suggestions.filter(suggestion => {
            // Boş veya çok kısa olanları filtrele
            if (!suggestion || suggestion.length < 3) {
                return false;
            }

            // Maksimum uzunluk kontrolü
            if (suggestion.length > options.maxLength) {
                return false;
            }

            // Domain validation service kullan
            if (!this.domainValidationService.isValidDomainName(suggestion)) {
                return false;
            }

            // Özel karakterleri filtrele
            if (/[^a-z0-9-]/.test(suggestion)) {
                return false;
            }

            // Çift tire kontrolü
            if (suggestion.includes('--')) {
                return false;
            }

            // Tire ile başlama/bitme kontrolü
            if (suggestion.startsWith('-') || suggestion.endsWith('-')) {
                return false;
            }

            return true;
        });
    }

    /**
     * 🔍 Mevcut domain'leri filtrele
     */
    async _filterExistingDomains(suggestions) {
        try {
            const existingDomains = await this.domainRepository.findAll();
            const existingNames = new Set(existingDomains.map(d => d.name));
            
            return suggestions.filter(suggestion => !existingNames.has(suggestion));
        } catch (error) {
            this.logger.warn('⚠️ Failed to filter existing domains', error);
            return suggestions;
        }
    }

    /**
     * 💎 Önerileri zenginleştir
     */
    _enrichSuggestions(suggestions, keywords) {
        return suggestions.map(suggestion => {
            const enriched = {
                name: suggestion,
                score: this._calculateScore(suggestion, keywords),
                length: suggestion.length,
                hasNumbers: /\d/.test(suggestion),
                hasDashes: suggestion.includes('-'),
                memorability: this._calculateMemorability(suggestion),
                brandability: this._calculateBrandability(suggestion),
                seoValue: this._calculateSeoValue(suggestion, keywords),
                extensions: ['.com', '.net', '.org', '.io'],
                tags: this._generateTags(suggestion, keywords),
                created: new Date().toISOString()
            };

            return enriched;
        });
    }

    /**
     * 🎯 Domain skorunu hesapla
     */
    _calculateScore(domain, keywords) {
        let score = 50; // Base score

        // Length scoring
        if (domain.length >= 6 && domain.length <= 10) score += 20;
        else if (domain.length >= 4 && domain.length <= 12) score += 10;
        else if (domain.length > 15) score -= 20;

        // Keyword match scoring
        keywords.forEach(keyword => {
            if (domain.includes(keyword)) score += 15;
        });

        // Memorability scoring
        if (!/\d/.test(domain)) score += 10; // No numbers
        if (!domain.includes('-')) score += 10; // No dashes
        if (this._isPronounceable(domain)) score += 15;

        // Brandability scoring
        if (this._hasVowels(domain)) score += 5;
        if (this._hasGoodFlow(domain)) score += 10;

        return Math.min(100, Math.max(0, score));
    }

    /**
     * 🧠 Hafızada kalıcılığı hesapla
     */
    _calculateMemorability(domain) {
        let score = 50;
        
        if (domain.length <= 8) score += 20;
        if (!/\d/.test(domain)) score += 15;
        if (!domain.includes('-')) score += 15;
        if (this._isPronounceable(domain)) score += 20;
        
        return Math.min(100, score);
    }

    /**
     * 🏷️ Marka değerini hesapla
     */
    _calculateBrandability(domain) {
        let score = 50;
        
        if (this._hasVowels(domain)) score += 15;
        if (this._hasGoodFlow(domain)) score += 15;
        if (domain.length >= 5 && domain.length <= 10) score += 20;
        if (!domain.includes('-') && !/\d/.test(domain)) score += 20;
        
        return Math.min(100, score);
    }

    /**
     * 🔍 SEO değerini hesapla
     */
    _calculateSeoValue(domain, keywords) {
        let score = 30;
        
        keywords.forEach(keyword => {
            if (domain.includes(keyword)) score += 25;
            if (domain.startsWith(keyword)) score += 10;
        });
        
        if (domain.length <= 15) score += 15;
        if (!/\d/.test(domain)) score += 10;
        
        return Math.min(100, score);
    }

    /**
     * 🏷️ Etiketler oluştur
     */
    _generateTags(domain, keywords) {
        const tags = [];
        
        if (domain.length <= 6) tags.push('short');
        if (domain.length <= 8) tags.push('memorable');
        if (domain.length >= 12) tags.push('descriptive');
        if (/\d/.test(domain)) tags.push('numeric');
        if (domain.includes('-')) tags.push('hyphenated');
        if (this._isPronounceable(domain)) tags.push('pronounceable');
        
        keywords.forEach(keyword => {
            if (domain.includes(keyword)) tags.push(`contains-${keyword}`);
        });
        
        return tags;
    }

    /**
     * 📊 İstatistikleri oluştur
     */
    _generateStats(suggestions) {
        const total = suggestions.length;
        const avgScore = suggestions.reduce((sum, s) => sum + s.score, 0) / total;
        const avgLength = suggestions.reduce((sum, s) => sum + s.length, 0) / total;
        const withNumbers = suggestions.filter(s => s.hasNumbers).length;
        const withDashes = suggestions.filter(s => s.hasDashes).length;
        
        return {
            total,
            averageScore: Math.round(avgScore),
            averageLength: Math.round(avgLength),
            withNumbers,
            withDashes,
            highScore: suggestions.filter(s => s.score >= 80).length,
            mediumScore: suggestions.filter(s => s.score >= 60 && s.score < 80).length,
            lowScore: suggestions.filter(s => s.score < 60).length
        };
    }

    /**
     * 💾 Üretim sonuçlarını kaydet
     */
    async _saveGenerationResults(keywords, suggestions, options) {
        try {
            const generationData = {
                type: 'generation',
                keywords,
                suggestions,
                options,
                timestamp: new Date().toISOString()
            };

            await this.domainRepository.saveHistory(generationData);
        } catch (error) {
            this.logger.warn('⚠️ Failed to save generation results', error);
        }
    }

    /**
     * 🎯 Kategoriye göre anahtar kelimeler
     */
    _getCategoryKeywords(category) {
        const categories = {
            tech: ['app', 'tech', 'code', 'dev', 'ai', 'cloud', 'data', 'soft', 'web', 'digital'],
            business: ['pro', 'biz', 'corp', 'work', 'team', 'group', 'trade', 'market', 'finance'],
            creative: ['art', 'design', 'create', 'studio', 'craft', 'media', 'vision', 'imagine'],
            health: ['health', 'med', 'care', 'fit', 'well', 'life', 'vital', 'heal', 'body'],
            education: ['learn', 'edu', 'teach', 'study', 'book', 'class', 'skill', 'know', 'wise'],
            general: ['new', 'best', 'top', 'smart', 'easy', 'fast', 'good', 'great', 'super']
        };
        
        return categories[category] || categories.general;
    }

    /**
     * 🎲 Rastgele elemanlar seç
     */
    _getRandomElements(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * 🗣️ Telaffuz edilebilirlik kontrolü
     */
    _isPronounceable(domain) {
        const vowels = 'aeiou';
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        
        let vowelCount = 0;
        let consonantCount = 0;
        
        for (const char of domain.toLowerCase()) {
            if (vowels.includes(char)) vowelCount++;
            if (consonants.includes(char)) consonantCount++;
        }
        
        return vowelCount > 0 && consonantCount > 0 && vowelCount / domain.length >= 0.2;
    }

    /**
     * 📝 Sesli harf kontrolü
     */
    _hasVowels(domain) {
        return /[aeiou]/i.test(domain);
    }

    /**
     * 🌊 İyi akış kontrolü
     */
    _hasGoodFlow(domain) {
        // Çok basit bir akış kontrolü - ardışık 3 sessiz harf yok
        return !/[bcdfghjklmnpqrstvwxyz]{3}/i.test(domain);
    }
}

module.exports = { GenerateDomainUseCase };
