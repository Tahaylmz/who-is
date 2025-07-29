const { Logger } = require('../../shared/utils/Logger');

/**
 * 🤖 OpenAI Domain Generator Implementation
 * OpenAI API kullanarak domain önerileri üretir
 */
class OpenAIDomainGenerator {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
        this.model = config.model || 'gpt-3.5-turbo';
        this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
        this.logger = new Logger('OpenAIDomainGenerator');
        
        if (!this.apiKey) {
            this.logger.warn('⚠️ OpenAI API key not provided. Domain generation will use fallback method.');
        }
    }

    /**
     * 🎯 Anahtar kelimeler için domain önerileri üretir
     */
    async generateDomains(keywords, options = {}) {
        try {
            this.logger.info(`🤖 Generating domains for keywords: ${keywords.join(', ')}`);
            
            if (!this.apiKey) {
                return this._generateFallbackDomains(keywords, options);
            }

            const prompt = this._buildPrompt(keywords, options);
            const response = await this._callOpenAI(prompt);
            const domains = this._parseDomains(response);
            
            this.logger.info(`✅ Generated ${domains.length} domain suggestions`);
            return domains;

        } catch (error) {
            this.logger.error('❌ Domain generation failed, using fallback method', error);
            return this._generateFallbackDomains(keywords, options);
        }
    }

    /**
     * 📝 OpenAI için prompt oluşturur
     */
    _buildPrompt(keywords, options) {
        const {
            count = 20,
            maxLength = 15,
            style = 'modern',
            includeNumbers = false,
            includeDashes = false,
            businessType = 'general'
        } = options;

        return `Generate ${count} creative and brandable domain name suggestions for a ${businessType} business using these keywords: ${keywords.join(', ')}.

Requirements:
- Maximum ${maxLength} characters
- Style: ${style} (modern, classic, creative, professional)
- Include numbers: ${includeNumbers ? 'yes' : 'no'}
- Include dashes: ${includeDashes ? 'yes' : 'no'}
- Must be memorable and easy to type
- Avoid trademark issues
- Consider SEO value

Return only the domain names (without extensions), one per line, no explanations.

Examples of good domains:
- techflow
- quickmind
- bluewave
- smartpath
- cloudcraft

Generate creative variations now:`;
    }

    /**
     * 🌐 OpenAI API çağrısı yapar
     */
    async _callOpenAI(prompt) {
        const axios = require('axios');
        
        const response = await axios.post(`${this.baseUrl}/chat/completions`, {
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert domain name generator. Create brandable, memorable domain names that are perfect for businesses.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.8,
            top_p: 0.9
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    }

    /**
     * 🔍 AI yanıtından domain isimlerini parse eder
     */
    _parseDomains(response) {
        return response
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.includes(':') && !line.includes('.'))
            .map(domain => domain.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            .filter(domain => domain.length >= 3 && domain.length <= 20)
            .slice(0, 30); // Max 30 öneri
    }

    /**
     * 🔄 Fallback domain üretim yöntemi (OpenAI olmadan)
     */
    _generateFallbackDomains(keywords, options = {}) {
        const {
            count = 20,
            maxLength = 15,
            includeNumbers = false,
            includeDashes = false
        } = options;

        const domains = new Set();
        
        // Temel kombinasyonlar
        const prefixes = ['get', 'my', 'the', 'new', 'pro', 'smart', 'fast', 'easy', 'best', 'top'];
        const suffixes = ['hub', 'app', 'lab', 'box', 'net', 'zone', 'spot', 'way', 'tech', 'go'];
        const connectors = includeDashes ? ['-', ''] : [''];
        
        // Keyword kombinasyonları
        for (let i = 0; i < keywords.length; i++) {
            for (let j = i + 1; j < keywords.length; j++) {
                connectors.forEach(connector => {
                    const combo1 = keywords[i] + connector + keywords[j];
                    const combo2 = keywords[j] + connector + keywords[i];
                    if (combo1.length <= maxLength) domains.add(combo1);
                    if (combo2.length <= maxLength) domains.add(combo2);
                });
            }
        }

        // Prefix + keyword kombinasyonları
        keywords.forEach(keyword => {
            prefixes.forEach(prefix => {
                connectors.forEach(connector => {
                    const combo = prefix + connector + keyword;
                    if (combo.length <= maxLength) domains.add(combo);
                });
            });
        });

        // Keyword + suffix kombinasyonları
        keywords.forEach(keyword => {
            suffixes.forEach(suffix => {
                connectors.forEach(connector => {
                    const combo = keyword + connector + suffix;
                    if (combo.length <= maxLength) domains.add(combo);
                });
            });
        });

        // Sayı eklemeleri
        if (includeNumbers) {
            const numbers = ['1', '2', '24', '365', '360', '2024'];
            keywords.forEach(keyword => {
                numbers.forEach(num => {
                    const combo1 = keyword + num;
                    const combo2 = num + keyword;
                    if (combo1.length <= maxLength) domains.add(combo1);
                    if (combo2.length <= maxLength) domains.add(combo2);
                });
            });
        }

        // Kısaltmalar ve varyasyonlar
        keywords.forEach(keyword => {
            if (keyword.length > 4) {
                const short = keyword.substring(0, 4);
                domains.add(short + 'ly');
                domains.add(short + 'io');
                domains.add(short + 'x');
            }
        });

        const result = Array.from(domains)
            .filter(domain => domain.length >= 3)
            .slice(0, count);

        this.logger.info(`🔄 Generated ${result.length} fallback domain suggestions`);
        return result;
    }

    /**
     * 🎲 Rastgele domain üretir
     */
    async generateRandomDomain(category = 'tech') {
        const categories = {
            tech: ['app', 'tech', 'soft', 'code', 'dev', 'byte', 'bit', 'sync', 'cloud', 'data'],
            business: ['biz', 'corp', 'pro', 'work', 'team', 'group', 'hub', 'center', 'office', 'trade'],
            creative: ['art', 'design', 'media', 'studio', 'craft', 'create', 'build', 'make', 'form', 'vision'],
            health: ['health', 'med', 'care', 'life', 'fit', 'well', 'body', 'mind', 'heal', 'vital'],
            education: ['learn', 'edu', 'study', 'teach', 'book', 'class', 'school', 'know', 'skill', 'train']
        };

        const categoryWords = categories[category] || categories.tech;
        const randomWords = this._getRandomElements(categoryWords, 2);
        
        return this.generateDomains(randomWords, { count: 10 });
    }

    /**
     * 🎯 Array'den rastgele elemanlar seçer
     */
    _getRandomElements(array, count) {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

module.exports = { OpenAIDomainGenerator };
