const randomWords = require('random-words');
const fs = require('fs');
const path = require('path');

class DomainGenerator {
  constructor() {
    // Türkçe kelime listesi
    this.turkishWords = [
      'güzel', 'hızlı', 'akıllı', 'modern', 'dijital', 'teknoloji', 'yazılım', 'web', 'mobil', 'online',
      'inovasyon', 'çözüm', 'sistem', 'platform', 'uygulama', 'servis', 'hizmet', 'proje', 'firma', 'şirket',
      'ticaret', 'satış', 'pazarlama', 'reklam', 'tasarım', 'grafik', 'sanat', 'müzik', 'oyun', 'eğlence',
      'spor', 'sağlık', 'tıp', 'doktor', 'hastane', 'eczane', 'diyet', 'fitness', 'yoga', 'meditasyon',
      'seyahat', 'turizm', 'otel', 'restoran', 'cafe', 'mutfak', 'yemek', 'tarif', 'kitap', 'okul',
      'öğretmen', 'öğrenci', 'ders', 'kurs', 'eğitim', 'akademi', 'üniversite', 'kolej', 'kreş', 'anaokul',
      'aile', 'çocuk', 'bebek', 'anne', 'baba', 'kardeş', 'arkadaş', 'sevgili', 'evlilik', 'düğün',
      'ev', 'villa', 'daire', 'ofis', 'mağaza', 'fabrika', 'atölye', 'stüdyo', 'galeri', 'müze',
      'park', 'bahçe', 'çiçek', 'ağaç', 'orman', 'deniz', 'göl', 'nehir', 'dağ', 'tepe',
      'şehir', 'kasaba', 'köy', 'mahalle', 'sokak', 'cadde', 'meydan', 'köprü', 'tünel', 'yol',
      'araba', 'otobüs', 'tren', 'uçak', 'gemi', 'bisiklet', 'motosiklet', 'taksi', 'metro', 'tramvay',
      'para', 'altın', 'gümüş', 'mücevher', 'saat', 'telefon', 'bilgisayar', 'tablet', 'kamera', 'televizyon',
      'müzik', 'şarkı', 'dans', 'tiyatro', 'sinema', 'konser', 'festival', 'etkinlik', 'parti', 'kutlama',
      'başarı', 'kazanç', 'kar', 'gelir', 'yatırım', 'borsa', 'finans', 'banka', 'kredi', 'sigorta',
      'güvenlik', 'koruma', 'alarm', 'kamera', 'şifre', 'kilit', 'anahtar', 'kapı', 'pencere', 'duvar'
    ];

    // İngilizce ek kelimeler (random-words paketine ek)
    this.englishWords = [
      'smart', 'fast', 'modern', 'digital', 'tech', 'software', 'web', 'mobile', 'online', 'cloud',
      'innovation', 'solution', 'system', 'platform', 'app', 'service', 'business', 'company', 'startup',
      'commerce', 'shop', 'store', 'market', 'brand', 'design', 'creative', 'studio', 'agency', 'media',
      'social', 'network', 'connect', 'share', 'community', 'forum', 'blog', 'news', 'info', 'data',
      'analytics', 'insight', 'report', 'dashboard', 'tool', 'kit', 'suite', 'pro', 'plus', 'premium',
      'elite', 'master', 'expert', 'guru', 'ninja', 'wizard', 'magic', 'power', 'boost', 'turbo',
      'super', 'ultra', 'mega', 'max', 'prime', 'gold', 'silver', 'platinum', 'diamond', 'crystal',
      'pure', 'fresh', 'clean', 'green', 'eco', 'bio', 'organic', 'natural', 'healthy', 'wellness',
      'fitness', 'sport', 'game', 'play', 'fun', 'joy', 'happy', 'smile', 'laugh', 'love',
      'care', 'help', 'support', 'guide', 'mentor', 'coach', 'trainer', 'teacher', 'learn', 'study'
    ];

    // Yaygın domain kalıpları
    this.patterns = [
      'single',           // tek kelime
      'compound',         // iki kelime birleşik
      'hyphenated',       // tire ile ayrılmış
      'numbered',         // sayı ile
      'prefixed',         // ön ek ile
      'suffixed',         // son ek ile
      'abbreviated',      // kısaltılmış
      'branded'           // marka tipi
    ];

    // Ön ekler
    this.prefixes = ['get', 'my', 'the', 'best', 'top', 'pro', 'ez', 'quick', 'fast', 'smart'];
    
    // Son ekler
    this.suffixes = ['app', 'hub', 'lab', 'box', 'kit', 'pro', 'plus', 'max', 'net', 'tech'];

    // Sayılar
    this.numbers = ['1', '2', '3', '24', '365', '360', '101', '123', '247', '911'];

    this.resultFiles = new Map();
  }

  /**
   * Rastgele Türkçe kelime üretir
   */
  getRandomTurkishWord() {
    return this.turkishWords[Math.floor(Math.random() * this.turkishWords.length)];
  }

  /**
   * Rastgele İngilizce kelime üretir
   */
  getRandomEnglishWord() {
    // %50 ihtimalle random-words paketi, %50 ihtimalle kendi listemiz
    try {
      if (Math.random() < 0.5) {
        const words = randomWords({ exactly: 1, maxLength: 10 });
        return words[0];
      } else {
        return this.englishWords[Math.floor(Math.random() * this.englishWords.length)];
      }
    } catch (error) {
      // Fallback to our own list
      return this.englishWords[Math.floor(Math.random() * this.englishWords.length)];
    }
  }

  /**
   * Rastgele anlamlı domain üretir
   */
  generateDomain(language = 'mixed') {
    const pattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
    let domain = '';

    switch (pattern) {
      case 'single':
        domain = language === 'turkish' ? this.getRandomTurkishWord() : 
                language === 'english' ? this.getRandomEnglishWord() :
                Math.random() < 0.5 ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        break;

      case 'compound':
        if (language === 'turkish') {
          domain = this.getRandomTurkishWord() + this.getRandomTurkishWord();
        } else if (language === 'english') {
          domain = this.getRandomEnglishWord() + this.getRandomEnglishWord();
        } else {
          // Karışık: bazen türkçe-türkçe, bazen ingilizce-ingilizce, bazen karışık
          const rand = Math.random();
          if (rand < 0.4) {
            domain = this.getRandomTurkishWord() + this.getRandomTurkishWord();
          } else if (rand < 0.8) {
            domain = this.getRandomEnglishWord() + this.getRandomEnglishWord();
          } else {
            domain = this.getRandomTurkishWord() + this.getRandomEnglishWord();
          }
        }
        break;

      case 'hyphenated':
        const word1 = language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        const word2 = language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        domain = word1 + '-' + word2;
        break;

      case 'numbered':
        const baseWord = language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        const number = this.numbers[Math.floor(Math.random() * this.numbers.length)];
        domain = Math.random() < 0.5 ? baseWord + number : number + baseWord;
        break;

      case 'prefixed':
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const mainWord = language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        domain = prefix + mainWord;
        break;

      case 'suffixed':
        const rootWord = language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        domain = rootWord + suffix;
        break;

      case 'abbreviated':
        const fullWord = language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord();
        domain = fullWord.substring(0, Math.min(4, fullWord.length)) + 
                this.getRandomEnglishWord().substring(0, 3);
        break;

      case 'branded':
        // Marka tipi isimler (kısaltma + kelime)
        const brandPart = (language === 'turkish' ? this.getRandomTurkishWord() : this.getRandomEnglishWord())
          .substring(0, 3);
        const businessPart = this.getRandomEnglishWord();
        domain = brandPart + businessPart;
        break;
    }

    // Türkçe karakterleri temizle
    domain = domain
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9-]/g, '');

    // Domain uzunluğunu kontrol et (3-20 karakter arası)
    if (domain.length < 3) {
      domain += this.getRandomEnglishWord().substring(0, 3);
    } else if (domain.length > 20) {
      domain = domain.substring(0, 20);
    }

    return domain;
  }

  /**
   * Belirtilen kategoride domain üretir
   */
  generateCategorizedDomains(category = 'general', count = 1) {
    const domains = [];

    for (let i = 0; i < count; i++) {
      let domain;
      
      switch (category) {
        case 'one-letter':
          domain = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
          break;
        case 'two-letter':
          domain = String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
                   String.fromCharCode(97 + Math.floor(Math.random() * 26));
          break;
        case 'three-letter':
          domain = String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
                   String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
                   String.fromCharCode(97 + Math.floor(Math.random() * 26));
          break;
        case 'turkish':
          domain = this.generateDomain('turkish');
          break;
        case 'english':
          domain = this.generateDomain('english');
          break;
        case 'tech':
          // Teknoloji odaklı domain'ler
          const techWords = ['app', 'web', 'tech', 'digital', 'cloud', 'data', 'ai', 'ml', 'code', 'dev'];
          const techWord = techWords[Math.floor(Math.random() * techWords.length)];
          const baseWord = this.getRandomEnglishWord();
          domain = Math.random() < 0.5 ? techWord + baseWord : baseWord + techWord;
          break;
        case 'business':
          // İş odaklı domain'ler
          const bizWords = ['biz', 'corp', 'company', 'enterprise', 'solutions', 'services', 'group', 'inc'];
          const bizWord = bizWords[Math.floor(Math.random() * bizWords.length)];
          const businessWord = this.getRandomEnglishWord();
          domain = businessWord + bizWord;
          break;
        default:
          domain = this.generateDomain('mixed');
      }

      domains.push(domain);
    }

    return domains;
  }

  /**
   * Müsait domain'leri dosyaya kaydeder
   */
  async saveAvailableDomain(domain, extension, category, result) {
    const fileName = `${category}-available-domains.txt`;
    const timestamp = new Date().toISOString();
    const line = `${domain}${extension} | ${result.availability} | ${timestamp} | Registrar: ${result.registrar || 'None'}\n`;

    try {
      await fs.promises.appendFile(fileName, line);
      
      // İstatistikleri güncelle
      if (!this.resultFiles.has(fileName)) {
        this.resultFiles.set(fileName, { available: 0, total: 0 });
      }
      const stats = this.resultFiles.get(fileName);
      stats.total++;
      if (result.availability === 'available') {
        stats.available++;
      }
      
      return true;
    } catch (error) {
      console.error(`Dosya yazma hatası: ${error.message}`);
      return false;
    }
  }

  /**
   * İstatistikleri gösterir
   */
  getStats() {
    const stats = {};
    for (const [fileName, data] of this.resultFiles.entries()) {
      stats[fileName] = {
        total: data.total,
        available: data.available,
        taken: data.total - data.available,
        successRate: data.total > 0 ? ((data.available / data.total) * 100).toFixed(2) + '%' : '0%'
      };
    }
    return stats;
  }

  /**
   * Sonuç dosyalarını temizler
   */
  async clearResults() {
    try {
      const files = await fs.promises.readdir('.');
      const resultFiles = files.filter(file => file.endsWith('-available-domains.txt'));
      
      for (const file of resultFiles) {
        await fs.promises.unlink(file);
      }
      
      this.resultFiles.clear();
      return resultFiles.length;
    } catch (error) {
      console.error(`Dosya temizleme hatası: ${error.message}`);
      return 0;
    }
  }
}

module.exports = DomainGenerator;
