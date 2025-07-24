const randomWords = require('random-words');
const fs = require('fs');
const path = require('path');

class SmartDomainGenerator {
  constructor() {
    // Sektör bazlı kelime kategorileri
    this.sectors = {
      tech: {
        turkish: ['teknoloji', 'yazılım', 'dijital', 'siber', 'veri', 'kod', 'sistem', 'platform', 'uygulama', 'web'],
        english: ['tech', 'digital', 'cyber', 'data', 'code', 'system', 'platform', 'app', 'web', 'cloud', 'ai', 'ml'],
        prefixes: ['smart', 'super', 'ultra', 'neo', 'next', 'pro', 'meta', 'quantum'],
        suffixes: ['tech', 'lab', 'hub', 'dev', 'code', 'ai', 'bot', 'net']
      },
      business: {
        turkish: ['işletme', 'ticaret', 'şirket', 'kurumsal', 'girişim', 'yatırım', 'finans', 'pazarlama'],
        english: ['business', 'corporate', 'enterprise', 'venture', 'invest', 'finance', 'marketing', 'trade'],
        prefixes: ['global', 'prime', 'elite', 'pro', 'top', 'best', 'mega', 'master'],
        suffixes: ['corp', 'biz', 'group', 'inc', 'ltd', 'pro', 'solutions', 'services']
      },
      creative: {
        turkish: ['sanat', 'tasarım', 'yaratıcı', 'güzel', 'estetik', 'stil', 'moda', 'trend'],
        english: ['art', 'design', 'creative', 'beauty', 'aesthetic', 'style', 'fashion', 'trend'],
        prefixes: ['pure', 'fresh', 'modern', 'elegant', 'chic', 'bold', 'unique'],
        suffixes: ['studio', 'design', 'creative', 'art', 'style', 'fashion', 'trend']
      },
      health: {
        turkish: ['sağlık', 'wellness', 'fitness', 'doktor', 'tıp', 'yaşam', 'beslenme', 'spor'],
        english: ['health', 'wellness', 'fitness', 'medical', 'life', 'nutrition', 'sport', 'care'],
        prefixes: ['vital', 'pure', 'natural', 'organic', 'bio', 'fresh', 'healthy'],
        suffixes: ['health', 'care', 'med', 'fit', 'wellness', 'life', 'bio']
      },
      ecommerce: {
        turkish: ['mağaza', 'satış', 'alışveriş', 'ticaret', 'pazar', 'ürün', 'hizmet'],
        english: ['shop', 'store', 'market', 'commerce', 'trade', 'product', 'service', 'buy'],
        prefixes: ['quick', 'easy', 'best', 'top', 'mega', 'super', 'express'],
        suffixes: ['shop', 'store', 'market', 'buy', 'cart', 'deal', 'sale']
      }
    };

    // Trendli kelimeler (2025 trendleri)
    this.trendWords = {
      tech: ['ai', 'quantum', 'neural', 'crypto', 'blockchain', 'metaverse', 'nft', 'defi', 'web3'],
      lifestyle: ['zen', 'mindful', 'sustainable', 'eco', 'green', 'minimal', 'authentic'],
      business: ['agile', 'lean', 'scale', 'growth', 'unicorn', 'disrupt', 'pivot']
    };

    // Anlam kombinasyonları
    this.meaningfulCombos = [
      // Zıt kavramlar
      { type: 'contrast', pairs: [['fast', 'slow'], ['big', 'small'], ['hot', 'cold'], ['smart', 'simple']] },
      // Tamamlayıcı kavramlar  
      { type: 'complement', pairs: [['design', 'build'], ['create', 'innovate'], ['think', 'act']] },
      // Güçlendirici kombinasyonlar
      { type: 'amplify', pairs: [['super', 'power'], ['mega', 'boost'], ['ultra', 'speed']] }
    ];

    // Fonetik uyumluluk için ses grupları
    this.phoneticGroups = {
      smooth: ['flow', 'smooth', 'silk', 'soft', 'gentle'],
      sharp: ['sharp', 'crisp', 'clear', 'bright', 'spark'],
      powerful: ['power', 'force', 'strong', 'bold', 'mighty']
    };

    // Psikoloji temelli kelimeler
    this.psychologyWords = {
      trust: ['trust', 'secure', 'safe', 'reliable', 'stable'],
      innovation: ['new', 'fresh', 'modern', 'next', 'future'],
      success: ['win', 'success', 'achieve', 'excel', 'prime']
    };

    this.resultFiles = new Map();
  }

  /**
   * Sektör bazlı akıllı domain üretir
   */
  generateSmartDomain(sector = 'general', style = 'professional') {
    if (sector === 'general') {
      return this.generateGeneralDomain(style);
    }

    const sectorData = this.sectors[sector];
    if (!sectorData) {
      return this.generateGeneralDomain(style);
    }

    const strategies = [
      'sectorSpecific',
      'trendCombination', 
      'meaningfulCombo',
      'phoneticOptimized',
      'psychologyBased',
      'aiInspired'
    ];

    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    
    switch (strategy) {
      case 'sectorSpecific':
        return this.generateSectorSpecific(sectorData, style);
      case 'trendCombination':
        return this.generateTrendCombination(sector, sectorData);
      case 'meaningfulCombo':
        return this.generateMeaningfulCombo(sectorData);
      case 'phoneticOptimized':
        return this.generatePhoneticOptimized(sectorData);
      case 'psychologyBased':
        return this.generatePsychologyBased(sectorData);
      case 'aiInspired':
        return this.generateAiInspired(sector);
      default:
        return this.generateSectorSpecific(sectorData, style);
    }
  }

  /**
   * Sektöre özel domain üretir
   */
  generateSectorSpecific(sectorData, style) {
    const { turkish, english, prefixes, suffixes } = sectorData;
    
    const usePrefix = Math.random() < 0.3;
    const useSuffix = Math.random() < 0.4;
    const useTurkish = Math.random() < 0.3;
    
    let domain = '';
    
    if (usePrefix) {
      domain += prefixes[Math.floor(Math.random() * prefixes.length)];
    }
    
    const coreWord = useTurkish ? 
      turkish[Math.floor(Math.random() * turkish.length)] :
      english[Math.floor(Math.random() * english.length)];
    
    domain += coreWord;
    
    if (useSuffix) {
      domain += suffixes[Math.floor(Math.random() * suffixes.length)];
    }
    
    return this.cleanDomain(domain);
  }

  /**
   * Trend kelimelerle kombine domain üretir
   */
  generateTrendCombination(sector, sectorData) {
    const trendCategory = Object.keys(this.trendWords)[Math.floor(Math.random() * Object.keys(this.trendWords).length)];
    const trendWord = this.trendWords[trendCategory][Math.floor(Math.random() * this.trendWords[trendCategory].length)];
    
    const sectorWord = Math.random() < 0.5 ?
      sectorData.english[Math.floor(Math.random() * sectorData.english.length)] :
      sectorData.turkish[Math.floor(Math.random() * sectorData.turkish.length)];
    
    const combinations = [
      `${trendWord}${sectorWord}`,
      `${sectorWord}${trendWord}`,
      `${trendWord}-${sectorWord}`,
      `${trendWord}${sectorWord}2025`
    ];
    
    return this.cleanDomain(combinations[Math.floor(Math.random() * combinations.length)]);
  }

  /**
   * Anlamlı kombinasyonlar üretir
   */
  generateMeaningfulCombo(sectorData) {
    const comboType = this.meaningfulCombos[Math.floor(Math.random() * this.meaningfulCombos.length)];
    const pair = comboType.pairs[Math.floor(Math.random() * comboType.pairs.length)];
    
    const word1 = pair[0];
    const word2 = pair[1];
    const sectorWord = sectorData.english[Math.floor(Math.random() * sectorData.english.length)];
    
    const patterns = [
      `${word1}${word2}`,
      `${word1}${sectorWord}`,
      `${sectorWord}${word1}`,
      `${word1}-${word2}`
    ];
    
    return this.cleanDomain(patterns[Math.floor(Math.random() * patterns.length)]);
  }

  /**
   * Fonetik olarak optimize edilmiş domain üretir
   */
  generatePhoneticOptimized(sectorData) {
    const phoneticGroup = Object.keys(this.phoneticGroups)[Math.floor(Math.random() * Object.keys(this.phoneticGroups).length)];
    const phoneticWord = this.phoneticGroups[phoneticGroup][Math.floor(Math.random() * this.phoneticGroups[phoneticGroup].length)];
    
    const sectorWord = sectorData.english[Math.floor(Math.random() * sectorData.english.length)];
    
    // Alliteration (aynı harfle başlama) kontrolü
    if (phoneticWord[0] === sectorWord[0]) {
      return this.cleanDomain(`${phoneticWord}${sectorWord}`);
    }
    
    return this.cleanDomain(`${phoneticWord}${sectorWord}`);
  }

  /**
   * Psikoloji temelli domain üretir
   */
  generatePsychologyBased(sectorData) {
    const psychCategory = Object.keys(this.psychologyWords)[Math.floor(Math.random() * Object.keys(this.psychologyWords).length)];
    const psychWord = this.psychologyWords[psychCategory][Math.floor(Math.random() * this.psychologyWords[psychCategory].length)];
    
    const sectorWord = sectorData.english[Math.floor(Math.random() * sectorData.english.length)];
    
    return this.cleanDomain(`${psychWord}${sectorWord}`);
  }

  /**
   * AI ilhamlı domain üretir (gelişmiş algoritmalar)
   */
  generateAiInspired(sector) {
    // Vokaller ve konsonantlar arasında denge
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    
    // Sektöre göre özel karakteristikler
    const sectorChars = {
      tech: ['x', 'z', 'q', 'v'],
      business: ['p', 'r', 's', 't'],
      creative: ['a', 'e', 'i', 'y'],
      health: ['l', 'm', 'n', 'r'],
      ecommerce: ['b', 'g', 'm', 'p']
    };
    
    let domain = '';
    const targetLength = 6 + Math.floor(Math.random() * 6); // 6-12 karakter
    const specialChars = sectorChars[sector] || consonants;
    
    // İlk karakter konsonant
    domain += consonants[Math.floor(Math.random() * consonants.length)];
    
    for (let i = 1; i < targetLength; i++) {
      if (i % 2 === 1) { // Vokal
        domain += vowels[Math.floor(Math.random() * vowels.length)];
      } else { // Konsonant
        if (Math.random() < 0.3 && specialChars) {
          domain += specialChars[Math.floor(Math.random() * specialChars.length)];
        } else {
          domain += consonants[Math.floor(Math.random() * consonants.length)];
        }
      }
    }
    
    return domain;
  }

  /**
   * Genel domain üretir
   */
  generateGeneralDomain(style) {
    try {
      const words = randomWords({ exactly: 2, maxLength: 8 });
      const combinations = [
        words.join(''),
        words.join('-'),
        words[0] + '2025',
        'get' + words[0],
        words[0] + 'hub'
      ];
      
      return this.cleanDomain(combinations[Math.floor(Math.random() * combinations.length)]);
    } catch (error) {
      // Fallback
      return this.generateAiInspired('general');
    }
  }

  /**
   * Kategoriye göre akıllı domain üretir
   */
  generateCategorizedDomains(category = 'general', count = 1) {
    const domains = [];

    for (let i = 0; i < count; i++) {
      let domain;
      
      switch (category) {
        case 'one-letter':
          // Premium tek harfler için akıllı seçim
          const premiumLetters = ['a', 'e', 'i', 'x', 'z', 'q'];
          domain = premiumLetters[Math.floor(Math.random() * premiumLetters.length)];
          break;
          
        case 'two-letter':
          // Anlamlı iki harf kombinasyonları
          const meaningfulTwoLetters = ['ai', 'io', 'ar', 'vr', 'ui', 'os', 'js', 'py'];
          if (Math.random() < 0.4) {
            domain = meaningfulTwoLetters[Math.floor(Math.random() * meaningfulTwoLetters.length)];
          } else {
            domain = String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
                     String.fromCharCode(97 + Math.floor(Math.random() * 26));
          }
          break;
          
        case 'three-letter':
          // Üç harfli kısaltmalar
          const threeLetterAbbrevs = ['app', 'api', 'dev', 'bot', 'lab', 'hub', 'box', 'net'];
          if (Math.random() < 0.3) {
            domain = threeLetterAbbrevs[Math.floor(Math.random() * threeLetterAbbrevs.length)];
          } else {
            domain = this.generateAiInspired('general').substring(0, 3);
          }
          break;
          
        case 'four-letter':
          // Dört harfli premium kombinasyonlar
          const fourLetterWords = ['code', 'data', 'tech', 'soft', 'fast', 'smart'];
          if (Math.random() < 0.4) {
            domain = fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)];
          } else {
            domain = this.generateAiInspired('general').substring(0, 4);
          }
          break;
          
        case 'short':
          // 3-6 karakter arası premium domain'ler
          domain = this.generateAiInspired('general').substring(0, 3 + Math.floor(Math.random() * 4));
          break;
          
        case 'tech':
          domain = this.generateSmartDomain('tech', 'modern');
          break;
          
        case 'business':
          domain = this.generateSmartDomain('business', 'professional');
          break;
          
        case 'creative':
          domain = this.generateSmartDomain('creative', 'artistic');
          break;
          
        case 'health':
          domain = this.generateSmartDomain('health', 'trustworthy');
          break;
          
        case 'ecommerce':
          domain = this.generateSmartDomain('ecommerce', 'commercial');
          break;
          
        case 'numbers':
          // Sayısal domain'ler için akıllı kombinasyonlar
          const meaningfulNumbers = ['24', '365', '360', '100', '2025', '3d', '4k', '5g'];
          const baseWord = this.generateSmartDomain('tech', 'modern');
          const number = meaningfulNumbers[Math.floor(Math.random() * meaningfulNumbers.length)];
          domain = Math.random() < 0.5 ? baseWord + number : number + baseWord;
          break;
          
        case 'premium':
          // Premium domain stratejisi
          domain = this.generatePremiumDomain();
          break;
          
        default:
          domain = this.generateGeneralDomain('balanced');
      }

      domains.push(domain);
    }

    return domains;
  }

  /**
   * Premium domain üretir
   */
  generatePremiumDomain() {
    const premiumStrategies = [
      () => this.generateAiInspired('tech').substring(0, 4),
      () => this.trendWords.tech[Math.floor(Math.random() * this.trendWords.tech.length)],
      () => 'get' + this.generateAiInspired('business').substring(0, 4),
      () => this.psychologyWords.success[Math.floor(Math.random() * this.psychologyWords.success.length)]
    ];
    
    const strategy = premiumStrategies[Math.floor(Math.random() * premiumStrategies.length)];
    return strategy();
  }

  /**
   * Domain'i temizler ve optimize eder
   */
  cleanDomain(domain) {
    return domain
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20);
  }

  /**
   * Domain kalitesini değerlendirir
   */
  evaluateDomainQuality(domain) {
    let score = 0;
    
    // Uzunluk puanı
    if (domain.length >= 3 && domain.length <= 8) score += 30;
    else if (domain.length <= 12) score += 20;
    else score += 10;
    
    // Telaffuz puanı
    const vowelCount = (domain.match(/[aeiou]/g) || []).length;
    const consonantCount = domain.length - vowelCount;
    if (vowelCount >= consonantCount * 0.3 && vowelCount <= consonantCount * 0.8) score += 25;
    
    // Hatırlanabilirlik
    if (!/\d/.test(domain)) score += 20; // Sayı yok
    if (!/-/.test(domain)) score += 15; // Tire yok
    if (/^[a-z]/.test(domain)) score += 10; // Harfle başlıyor
    
    return Math.min(score, 100);
  }

  /**
   * Müsait domain'leri dosyaya kaydeder (geliştirilmiş)
   */
  async saveAvailableDomain(domain, extension, category, result) {
    const resultsDir = 'domain-results';
    if (!fs.existsSync(resultsDir)) {
      await fs.promises.mkdir(resultsDir, { recursive: true });
    }

    const fileName = path.join(resultsDir, `${category}-domains.txt`);
    const timestamp = new Date().toISOString();
    const status = result.availability === 'available' ? '✅ MÜSAİT' : '❌ ALINMIŞ';
    const quality = this.evaluateDomainQuality(domain);
    const line = `${domain}${extension} | ${status} | Kalite: ${quality}/100 | ${timestamp} | Registrar: ${result.registrar || 'None'}\n`;

    try {
      await fs.promises.appendFile(fileName, line);
      
      if (!this.resultFiles.has(fileName)) {
        this.resultFiles.set(fileName, { available: 0, total: 0, avgQuality: 0 });
      }
      const stats = this.resultFiles.get(fileName);
      stats.total++;
      if (result.availability === 'available') {
        stats.available++;
        stats.avgQuality = ((stats.avgQuality * (stats.available - 1)) + quality) / stats.available;
      }
      
      return true;
    } catch (error) {
      console.error(`Dosya yazma hatası: ${error.message}`);
      return false;
    }
  }

  /**
   * Gelişmiş istatistikler
   */
  getStats() {
    const stats = {};
    for (const [fileName, data] of this.resultFiles.entries()) {
      stats[fileName] = {
        total: data.total,
        available: data.available,
        taken: data.total - data.available,
        successRate: data.total > 0 ? ((data.available / data.total) * 100).toFixed(2) + '%' : '0%',
        avgQuality: data.avgQuality ? data.avgQuality.toFixed(1) + '/100' : 'N/A'
      };
    }
    return stats;
  }

  /**
   * Sonuç dosyalarını temizler
   */
  async clearResults() {
    try {
      const resultsDir = 'domain-results';
      if (!fs.existsSync(resultsDir)) {
        return 0;
      }

      const files = await fs.promises.readdir(resultsDir);
      const resultFiles = files.filter(file => file.endsWith('-domains.txt'));
      
      for (const file of resultFiles) {
        await fs.promises.unlink(path.join(resultsDir, file));
      }
      
      const remainingFiles = await fs.promises.readdir(resultsDir);
      if (remainingFiles.length === 0) {
        await fs.promises.rmdir(resultsDir);
      }
      
      this.resultFiles.clear();
      return resultFiles.length;
    } catch (error) {
      console.error(`Dosya temizleme hatası: ${error.message}`);
      return 0;
    }
  }
}

module.exports = SmartDomainGenerator;
