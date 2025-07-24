const axios = require('axios');
const DomainGenerator = require('./domain-generator');

class AIDomainGenerator extends DomainGenerator {
  constructor(apiKey = null) {
    super();
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.useAI = !!this.apiKey;
    
    // AI için prompt şablonları
    this.aiPrompts = {
      tech: "Generate 5 creative, brandable, short domain names for a tech startup. Focus on AI, cloud, SaaS, and modern technology terms. Each domain should be 4-12 characters, memorable, and professional. Return only domain names without extensions, one per line.",
      business: "Create 5 professional business domain names that sound trustworthy and corporate. Focus on finance, consulting, enterprise, and business services. Each should be 4-15 characters, easy to remember and type. Return only domain names without extensions, one per line.",
      creative: "Generate 5 artistic, creative domain names for design, art, or creative agencies. Focus on beauty, style, innovation, and artistic concepts. Each should be unique, brandable, and 4-12 characters. Return only domain names without extensions, one per line.",
      health: "Create 5 health and wellness domain names that sound trustworthy and professional. Focus on fitness, medical, wellness, nutrition, and healthcare. Each should be 4-15 characters, easy to pronounce. Return only domain names without extensions, one per line.",
      ecommerce: "Generate 5 catchy ecommerce domain names for online stores. Focus on shopping, marketplace, deals, and commerce. Each should be brandable, memorable, and 4-12 characters. Return only domain names without extensions, one per line.",
      premium: "Create 5 premium, valuable domain names that could be worth thousands. Focus on short, dictionary words, brandable names, and high-value concepts. Each should be 3-8 characters, highly memorable. Return only domain names without extensions, one per line.",
      startup: "Generate 5 modern startup domain names that sound innovative and disruptive. Focus on unicorn potential, scalability, and venture capital appeal. Each should be 4-10 characters, brandable. Return only domain names without extensions, one per line."
    };

    // Yerel AI alternative prompts (API olmadığında)
    this.localAIPatterns = {
      tech: ['quantum', 'neural', 'fusion', 'vertex', 'nexus', 'flux', 'apex', 'zenit', 'core', 'edge'],
      business: ['prime', 'elite', 'summit', 'vault', 'trust', 'secure', 'solid', 'stable', 'proven'],
      creative: ['vivid', 'bold', 'fresh', 'pure', 'bright', 'spark', 'glow', 'shine', 'magic'],
      health: ['vital', 'pure', 'fresh', 'life', 'heal', 'care', 'well', 'fit', 'strong'],
      ecommerce: ['shop', 'buy', 'deal', 'cart', 'market', 'store', 'trade', 'sell', 'quick'],
      premium: ['ace', 'gem', 'gold', 'max', 'top', 'best', 'pro', 'vip', 'star'],
      startup: ['rocket', 'boost', 'scale', 'grow', 'rise', 'leap', 'spark', 'launch']
    };
  }

  /**
   * AI kullanarak akıllı domain önerileri üretir
   */
  async generateAIDomains(sector, count = 5) {
    if (!this.useAI) {
      console.log('⚠️  OpenAI API anahtarı bulunamadı, yerel AI algoritması kullanılıyor...');
      return this.generateLocalAIDomains(sector, count);
    }

    try {
      const prompt = this.aiPrompts[sector] || this.aiPrompts.tech;
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional domain name expert and branding specialist. Generate creative, brandable, and valuable domain names.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const domains = response.data.choices[0].message.content
        .split('\n')
        .map(domain => domain.trim())
        .filter(domain => domain && !domain.includes('.'))
        .map(domain => this.cleanDomain(domain))
        .slice(0, count);

      return domains;
    } catch (error) {
      console.log('⚠️  OpenAI API hatası, yerel AI algoritması kullanılıyor...');
      return this.generateLocalAIDomains(sector, count);
    }
  }

  /**
   * Yerel AI algoritması ile domain üretir
   */
  generateLocalAIDomains(sector, count = 5) {
    const patterns = this.localAIPatterns[sector] || this.localAIPatterns.tech;
    const domains = [];

    for (let i = 0; i < count; i++) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      const strategies = [
        () => pattern + Math.floor(Math.random() * 100),
        () => 'get' + pattern,
        () => pattern + 'ai',
        () => pattern + 'hub',
        () => 'my' + pattern,
        () => pattern + 'pro',
        () => this.generateHybridDomain(pattern, sector),
        () => this.generatePhoneticVariation(pattern)
      ];

      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const domain = strategy();
      
      if (domain && domain.length >= 3 && domain.length <= 15) {
        domains.push(this.cleanDomain(domain));
      }
    }

    return domains;
  }

  /**
   * Hibrit domain üretir (pattern + sektör kelimesi)
   */
  generateHybridDomain(pattern, sector) {
    const sectorData = this.sectors[sector];
    if (!sectorData) return pattern;

    const sectorWords = [...sectorData.english, ...sectorData.turkish];
    const sectorWord = sectorWords[Math.floor(Math.random() * sectorWords.length)];
    
    const combinations = [
      pattern + sectorWord,
      sectorWord + pattern,
      pattern + sectorWord.substring(0, 3),
      sectorWord.substring(0, 3) + pattern
    ];

    return combinations[Math.floor(Math.random() * combinations.length)];
  }

  /**
   * Fonetik varyasyon üretir
   */
  generatePhoneticVariation(word) {
    const variations = {
      'c': 'k', 'k': 'c', 'ph': 'f', 'f': 'ph',
      'i': 'y', 'y': 'i', 'z': 's', 's': 'z'
    };

    let variant = word;
    for (const [from, to] of Object.entries(variations)) {
      if (Math.random() < 0.3) {
        variant = variant.replace(from, to);
      }
    }

    return variant;
  }

  /**
   * AI destekli kategori domain üretimi
   */
  async generateCategorizedDomains(category = 'general', count = 1) {
    // AI sektörleri için özel işlem
    const aiSectors = ['tech', 'business', 'creative', 'health', 'ecommerce', 'premium', 'startup'];
    
    if (aiSectors.includes(category)) {
      try {
        const aiDomains = await this.generateAIDomains(category, count);
        return aiDomains.slice(0, count);
      } catch (error) {
        console.log(`⚠️  AI domain üretimi başarısız, standart metod kullanılıyor: ${error.message}`);
      }
    }

    // Standart kategoriler için parent metodunu kullan
    return super.generateCategorizedDomains(category, count);
  }

  /**
   * Batch AI domain üretimi
   */
  async generateBatchAIDomains(sectors, domainsPerSector = 5) {
    const results = {};
    
    for (const sector of sectors) {
      console.log(`🤖 ${sector} sektörü için AI domain'ler üretiliyor...`);
      
      try {
        const domains = await this.generateAIDomains(sector, domainsPerSector);
        results[sector] = domains.map(domain => ({
          domain,
          quality: this.evaluateDomainQuality(domain),
          strategy: 'ai-generated'
        }));
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`❌ ${sector} için AI üretimi başarısız: ${error.message}`);
        results[sector] = [];
      }
    }

    return results;
  }

  /**
   * Gelişmiş domain kalite analizi
   */
  evaluateAdvancedDomainQuality(domain) {
    let score = super.evaluateDomainQuality(domain);
    
    // AI specific quality checks
    // Brandability check
    if (this.isBrandable(domain)) score += 10;
    
    // SEO friendliness
    if (this.isSEOFriendly(domain)) score += 10;
    
    // Pronounceability
    if (this.isPronounceable(domain)) score += 10;
    
    // Uniqueness (not common words)
    if (this.isUnique(domain)) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Marka değeri kontrolü
   */
  isBrandable(domain) {
    // Çok yaygın kelimeler brandable değil
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our'];
    return !commonWords.includes(domain.toLowerCase());
  }

  /**
   * SEO dostu kontrol
   */
  isSEOFriendly(domain) {
    // Tire yok, sayı az, uzunluk uygun
    return !domain.includes('-') && (domain.match(/\d/g) || []).length <= 2 && domain.length >= 4 && domain.length <= 12;
  }

  /**
   * Telaffuz kontrol
   */
  isPronounceable(domain) {
    // Vokal oranı kontrol
    const vowels = (domain.match(/[aeiou]/g) || []).length;
    const consonants = domain.length - vowels;
    return vowels >= consonants * 0.2 && vowels <= consonants * 1.5;
  }

  /**
   * Benzersizlik kontrol
   */
  isUnique(domain) {
    // Yaygın domain kalıpları değil
    const commonPatterns = ['get', 'my', 'the', '123', 'www', 'app', 'web'];
    return !commonPatterns.some(pattern => domain.includes(pattern));
  }

  /**
   * Market analizi yaparak domain değeri tahmin eder
   */
  estimateDomainValue(domain) {
    let value = 1; // Base value in USD
    
    // Length premium
    if (domain.length <= 4) value *= 1000;
    else if (domain.length <= 6) value *= 100;
    else if (domain.length <= 8) value *= 10;
    
    // Quality multiplier
    const quality = this.evaluateAdvancedDomainQuality(domain);
    value *= (quality / 100) * 10;
    
    // Keyword value
    const highValueKeywords = ['ai', 'crypto', 'tech', 'app', 'cloud', 'data'];
    if (highValueKeywords.some(keyword => domain.includes(keyword))) {
      value *= 5;
    }
    
    return Math.round(value);
  }
}

module.exports = AIDomainGenerator;
