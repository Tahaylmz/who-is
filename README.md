# 🌐 Who-Is - Modern Domain & Site Checker

Modern web teknolojileri ve Clean Architecture ile tamamen yeniden tasarlanmış, kapsamlı domain analiz ve site kontrol platformu.

## ✨ Özellikler

### 🚀 **Modern Web Interface**
- **Responsive Design**: Mobil-first yaklaşımla tüm cihazlarda mükemmel görünüm
- **Dark/Light Mode**: Kullanıcı tercihi ile tema değiştirme
- **Real-time Updates**: Canlı sonuç güncellemeleri
- **Progressive Web App**: PWA özellikleri ile offline çalışma desteği

### ⚡ **Site Health Checker**
- Ultra hızlı site durumu analizi (millisaniye seviyesinde)
- Detaylı raporlama: Status code, response time, server bilgileri
- Toplu site tarama: Yüzlerce siteyi eşzamanlı kontrol
- Smart routing: Otomatik redirect takibi ve timeout yönetimi

### 🌐 **Domain Management System**
- Kapsamlı domain availability kontrolü
- 100+ domain uzantısı desteği (.com, .net, .org, .io, .ai, vs.)
- Toplu domain kontrol ve analiz
- CSV/JSON formatında sonuç dışa aktarma

### 🤖 **AI-Powered Domain Generation**
- GPT destekli akıllı domain önerileri
- Context-aware: İş tanımına göre özelleştirilmiş isimler
- Brandable domains: Marka değeri yüksek domain alternatifleri
- Kategori bazlı öneriler: Tech, Business, Creative, Health, Finance

### 🕵️ **Advanced Domain Hunting**
- Keyword-based intelligent domain discovery
- High-speed parallel processing ile hızlı tarama
- Premium domain detection
- Bulk operations: Dosya tabanlı toplu domain avcılığı

### � **Analytics & Trends**
- Domain trend analizi
- Performance metrikleri
- Activity tracking
- Market insights

## 🚀 Hızlı Başlangıç

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/Tahaylmz/who-is.git
cd who-is

# Bağımlılıkları yükleyin
npm install

# Web uygulamasını başlatın
npm start
```

### Kullanım

1. **Web Interface**: http://localhost:3002
2. **API Documentation**: http://localhost:3002/api
3. **Health Check**: http://localhost:3002/health

## 🌟 Modern Web Özellikleri

### Frontend Teknolojileri
- **Tailwind CSS**: Modern utility-first CSS framework
- **Vanilla JavaScript**: Hafif ve hızlı, framework bağımlılığı yok
- **Chart.js**: İnteraktif grafikler ve analizler
- **Font Awesome**: Kapsamlı ikon seti
- **Animate.css**: Smooth animasyonlar

### Backend Teknolojileri
- **Express.js**: Hızlı ve minimalist web framework
- **Helmet**: Güvenlik middleware'i
- **Compression**: GZIP sıkıştırma
- **Morgan**: HTTP request logger
- **CORS**: Cross-origin resource sharing

```bash
# 📋 Yardım ve komut listesi
npm start help

# 🔍 Site Durumu Kontrolü
npm start check site https://google.com
npm start check batch https://google.com https://github.com https://stackoverflow.com

# 🎲 Domain Generation
npm start generate tech ai ml robot
npm start generate quick startup
npm start generate creative art design music
npm start generate business finance trade

# 🕵️ Domain Hunting
npm start hunt domains mobile app startup
npm start hunt quick tech
npm start hunt premium luxury brand
npm start hunt bulk sites.txt

# 📁 Dosya Tabanlı İşlemler
npm start check file sites.txt
npm start hunt bulk domains.txt
```

### 🌐 **Web Server & API**

```bash
# Production mode
npm run server

# Development mode (auto-reload)
npm run server:dev

# Server durumu kontrolü
curl http://localhost:3001/health
```

**Web Interface:** http://localhost:3001  
**API Base URL:** http://localhost:3001/api

## 🔌 API Endpoints

### 🔍 **Site Kontrolü**
```bash
# Health check
GET /health
# Response: {"status": "ok", "timestamp": "...", "version": "2.0.0"}

# Tek site kontrolü
POST /api/sites/check
{
  "url": "https://example.com",
  "timeout": 10000
}

# Toplu site kontrolü
POST /api/sites/batch
{
  "urls": ["https://site1.com", "https://site2.com"],
  "concurrency": 10,
  "timeout": 10000
}
```

### 🌐 **Domain İşlemleri**
```bash
# Domain generation
POST /api/domains/generate
{
  "keywords": ["tech", "startup"],
  "type": "tech",
  "count": 30
}

# Domain hunting
POST /api/domains/hunt
{
  "keywords": ["mobile", "app"],
  "extensions": [".com", ".net"],
  "checkAvailability": true
}

# Domain availability check
POST /api/domains/check
{
  "domain": "example.com"
}
```

## 🏗️ Clean Architecture Yapısı

### 📁 **Modern Proje Klasör Sistemi**

```
who-is/
├── � Entry Points
│   ├── cli.js                    # Modern CLI application
│   ├── server.js                 # Modern web server
│   └── package.json              # Dependencies & scripts
│
├── 📦 src/ (Clean Architecture Layers)
│   ├── 🏛️ domain/               # Business Logic (Core)
│   │   ├── entities/             # Domain entities
│   │   │   ├── SiteEntity.js
│   │   │   └── DomainEntity.js
│   │   ├── repositories/         # Repository interfaces
│   │   │   └── IDomainRepository.js
│   │   ├── services/            # Domain services
│   │   │   └── DomainValidationService.js
│   │   └── index.js
│   │
│   ├── 💼 application/          # Use Cases (Business Rules)
│   │   ├── usecases/
│   │   │   ├── CheckSiteUseCase.js
│   │   │   ├── GenerateDomainUseCase.js
│   │   │   └── HuntDomainUseCase.js
│   │   └── index.js
│   │
│   ├── 🔧 infrastructure/       # External Dependencies
│   │   ├── services/
│   │   │   ├── HttpSiteChecker.js
│   │   │   └── OpenAIDomainGenerator.js
│   │   ├── repositories/
│   │   │   └── FileDomainRepository.js
│   │   ├── data/               # Generated results
│   │   ├── config/             # Configuration
│   │   └── index.js
│   │
│   ├── 🖥️ presentation/        # User Interfaces
│   │   ├── cli/
│   │   │   ├── CLIApplication.js
│   │   │   └── commands/
│   │   │       ├── CheckCommands.js
│   │   │       ├── DomainCommands.js
│   │   │       └── HuntCommands.js
│   │   ├── web/
│   │   │   ├── WebServer.js
│   │   │   └── routes/
│   │   └── index.js
│   │
│   ├── 🔗 shared/              # Common Utilities
│   │   ├── utils/
│   │   │   ├── Logger.js
│   │   │   └── Validator.js
│   │   ├── constants/
│   │   └── index.js
│   │
│   └── index.js                # Main Clean Architecture export
│
└── 📄 Additional Files
    ├── sites.txt               # Sample site list for testing
    └── README.md              # This documentation
```

### 🎯 **Clean Architecture Katman Açıklaması**

#### 🏛️ **Domain Layer** (İç Çekirdek)
- **Zero Dependencies**: Hiçbir dış bağımlılık yok
- **Business Rules**: En saf iş mantığı kuralları
- **Entities**: SiteEntity, DomainEntity
- **Domain Services**: Core business validations

#### 💼 **Application Layer** (Use Cases)
- **Business Workflows**: Uygulama iş akışları
- **Use Case Orchestration**: Domain entities'leri koordine eder
- **Dependencies**: Sadece Domain layer'a bağımlı

#### 🔧 **Infrastructure Layer** (Dış Bağımlılıklar)
- **External Services**: HTTP clients, AI APIs, file systems
- **Data Access**: Repository implementations
- **Framework Dependencies**: Express.js, axios, etc.

#### 🖥️ **Presentation Layer** (UI)
- **CLI Interface**: Command line applications
- **Web Interface**: REST API endpoints
- **User Interaction**: Request/response handling

#### 🔗 **Shared Layer** (Ortak Kaynaklar)
- **Utilities**: Logger, validators, helpers
- **Constants**: Application-wide constants
- **Common Types**: Shared interfaces and types

## � **Performance & Özellikleri**

### ⚡ **Yüksek Performans**
- **Paralel İşlem**: Eşzamanlı multi-threading ile hızlı tarama
- **Smart Caching**: Response time optimization
- **Timeout Management**: Configurable request timeouts
- **Resource Efficiency**: Minimum memory footprint

### 🛡️ **Güvenlik & Güvenilirlik**
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: Graceful error recovery
- **Rate Limiting**: DDoS protection mechanisms
- **Secure Headers**: Security-first web server configuration

### 📊 **Monitoring & Analytics**
- **Real-time Logs**: Structured logging with timestamps
- **Performance Metrics**: Response time tracking
- **Health Checks**: System status monitoring
- **Export Features**: CSV, JSON data export

## 🛠️ **Geliştirme & Katkı**

### 📝 **Development Scripts**
```bash
# Development mode (auto-reload)
npm run server:dev

# Testing
npm test

# Code linting
npm run lint

# Code formatting
npm run format

# Clean install
npm run clean
```

### 🔧 **Environment Configuration**
```bash
# .env dosyası oluşturun (opsiyonel)
OPENAI_API_KEY=your_openai_key_here
PORT=3001
LOG_LEVEL=info
TIMEOUT=10000
```

### 🤝 **Katkıda Bulunma**
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📈 **Versiyon Geçmişi**

### 🎯 **v2.0.0** (Current - Clean Architecture)
- ✅ Complete Clean Architecture migration
- ✅ Legacy code removal
- ✅ Modern CLI interface
- ✅ Enhanced web server
- ✅ Improved performance
- ✅ Better error handling

### 📋 **v1.x.x** (Legacy - Deprecated)
- ❌ Monolithic architecture
- ❌ Legacy bridge patterns
- ❌ Outdated dependencies

## 📞 **Destek & İletişim**

- **GitHub Issues**: Bug reports ve feature requests
- **Repository**: [https://github.com/Tahaylmz/who-is](https://github.com/Tahaylmz/who-is)
- **Documentation**: Bu README dosyası
- **Web Interface**: http://localhost:3001 (server çalışıyorken)

## 📄 **Lisans**

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için LICENSE dosyasına bakın.

---

> 🎯 **Clean Architecture** prensiplerine göre geliştirilmiş, modern ve sürdürülebilir bir site kontrol sistemi.  
> Legacy kodlardan tamamen arındırılmış, yüksek performanslı ve ölçeklenebilir yapı.

**Made with ❤️ by Clean Architecture principles**
aiDomainGenerator.js       →  src/infrastructure/services/LegacyAIDomainGenerator.js
index.js                   →  src/presentation/cli/LegacyCLI.js
server.js                  →  src/presentation/web/LegacyWebServer.js
utils/                     →  src/shared/utils/
commands/                  →  src/application/commands/
data/                      →  src/infrastructure/data/
config/                    →  src/infrastructure/config/
```

## 🎯 Script Komutları

```bash
# Modern sistem
npm start              # Yeni CLI
npm run server         # Modern web server
npm run server:dev     # Development mode

# Legacy sistem
npm run legacy         # Bridge CLI
npm run old-server     # Eski web server
npm run start-old      # Eski CLI

# Development
npm run dev           # CLI development
npm run web-dev       # Web development
npm test             # Test çalıştır
```

## 🔧 Yapılandırma

### Environment Variables

```bash
# .env dosyası oluşturun
PORT=3001                    # Web server portu
OPENAI_API_KEY=your_key     # AI domain generation için
LOG_LEVEL=info              # Log seviyesi
DEFAULT_TIMEOUT=5000        # Varsayılan timeout
```

### CLI Ayarları

```bash
# Varsayılan timeout
export WHOIS_TIMEOUT=5000

# Concurrency limiti
export MAX_CONCURRENCY=10
```

## 📊 Performans

- **Site kontrolü**: ~100-500ms
- **Toplu tarama**: 10-50 site/saniye
- **Domain hunting**: 1000+ domain/dakika
- **AI generation**: 2-5 saniye/10 domain

## 🛠️ Geliştirme

### Test Etme

```bash
# Hızlı test
npm start check https://google.com

# AI test
npm start generate tech --count 5

# Server test
curl -X POST http://localhost:3001/api/check \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

### Debug Mode

```bash
# CLI debug
DEBUG=1 npm start

# Server debug
DEBUG=1 npm run server
```

## 🎨 Legacy Entegrasyonu

### Mevcut Dosyalar

- `domain-generator.js` → AI domain generation
- `aiDomainGenerator.js` → Advanced AI features  
- `checker.js` → Site checking logic
- `server.js` → Web server
- `index.js` → CLI interface

### Bridge Pattern

`LegacyServiceBridge` bu dosyaları Clean Architecture ile entegre eder:

```javascript
const bridge = new LegacyServiceBridge();

// Eski kod yeni sistemde çalışır
await bridge.checkSite(url);
await bridge.generateDomains(keywords);
await bridge.huntDomains(keywords);
```

## � Roadmap

- [ ] Gelişmiş AI domain analizi
- [ ] Real-time domain monitoring
- [ ] REST API documentation (Swagger)
- [ ] Database persistence
- [ ] Multi-language support
- [ ] Docker containerization

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 🎯 Hızlı Başlangıç

```bash
# Hemen başlayın
npm install
npm start help

# Web server'ı başlatın
npm run server

# Legacy bridge'i deneyin
npm run legacy help
```

**Clean Architecture + Legacy Uyumluluğu = En İyi İkisi! 🚀**
│   ├── monitor.js        # İzleme komutları
│   ├── ai.js             # AI domain generation komutları
│   ├── trend.js          # Trend analizi komutları
│   └── domainConfig.js   # Domain konfigürasyon komutları
├── 📁 utils/             # Yardımcı modüller
│   ├── display.js        # Sonuç görüntüleme fonksiyonları
│   └── domainGenerationConfig.js # Domain generation konfigürasyon sistemi
├── 📁 config/            # Konfigürasyon dosyaları
│   └── domainGeneration.json # Domain generation kuralları
├── 📁 domain-results/    # Sonuç dosyaları
│   ├── general-domains.txt
│   ├── tech-domains.txt
│   └── ...
├── 📄 index.js           # Ana CLI programı
├── 📄 checker.js         # Site kontrol motoru
├── 📄 domain-generator.js # Akıllı domain üretim sistemi
└── 📄 aiDomainGenerator.js # AI-destekli domain generator
```

### Modüler Tasarım
- **Komutlar**: Her komut grubu ayrı dosyada organize edilmiş
- **Görüntüleme**: Tüm çıktı formatları merkezi display modülünde
- **Temiz Kod**: Tek sorumluluk prensibi uygulanmış
- **Kolay Bakım**: Yeni komutlar kolayca eklenebilir

## 🔧 Programmatik Kullanım.com.tr, .net gibi farklı uzantıları otomatik kontrol
- 🔍 **Domain Availability**: DNS ve WHOIS sorguları ile domain satın alınıp alınmadığını kontrol
- 🎰 **Domain Hunting**: Sürekli rastgele anlamlı domain'leri tarayıp müsait olanları bulma
- 🤖 **AI Domain Generator**: OpenAI API ile akıllı domain önerileri ve yerel yapay zeka algoritmaları
- 📈 **Trend Analizi**: 2025 teknoloji trendleri ve gelecek tahminleri ile domain önerileri
- � **Pazar Analizi**: Domain değer tahmini ve yatırım potansiyeli hesaplama
- ⚙️ **Akıllı Konfigürasyon**: Domain oluşturma kuralları, tire ve sayı kontrolü ayarları
- �📊 **Gerçek Zamanlı İzleme**: Sürekli izleme modu ile anlık durumu takip
- 🎨 **Renkli Terminal**: Görsel olarak zengin sonuç gösterimi
- 🔧 **Esnek Yapılandırma**: Timeout, eş zamanlılık ve interval ayarları
- 📋 **Çoklu Format**: Tek site, liste dosyası ve hızlı test desteği
- 💾 **Otomatik Kayıt**: Bulunan müsait domain'leri kategorizeli dosyalara kaydetme
- 🎯 **Kalite Puanlama**: 0-100 arası domain kalite puanlama sistemi
- 🧠 **6 Farklı Strateji**: Sektör odaklı, trend kombinasyonu, anlamlı birleşim, fonetik optimizasyon, psikoloji tabanlı ve AI-destekli generationChecker 🚀

Çok hızlı ve etkili web sitesi durum kontrol sistemi. Sitelerinizin çevrimiçi/çevrimdışı durumunu hızlıca kontrol edin.

## ✨ Özellikler

- ⚡ **Çok Hızlı**: Paralel isteklerle yüzlerce siteyi saniyeler içinde kontrol
- 🎯 **Akıllı Analiz**: HTTP status kodları, yanıt süreleri ve server bilgileri
- 🌐 **Domain Uzantı Kontrolü**: .com, .com.tr, .net gibi farklı uzantıları otomatik kontrol
- � **Domain Availability**: DNS ve WHOIS sorguları ile domain satın alınıp alınmadığını kontrol
- �📊 **Gerçek Zamanlı İzleme**: Sürekli izleme modu ile anlık durumu takip
- 🎨 **Renkli Terminal**: Görsel olarak zengin sonuç gösterimi
- 🔧 **Esnek Yapılandırma**: Timeout, eş zamanlılık ve interval ayarları
- 📋 **Çoklu Format**: Tek site, liste dosyası ve hızlı test desteği

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+ 
- npm 8+
- İnternet bağlantısı (domain kontrolleri için)

### Hızlı Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/yourusername/who-is.git
cd who-is

# Bağımlılıkları yükleyin
npm install

# CLI kullanımı için global yükleme (opsiyonel)
npm install -g .

# Web dashboard başlatma
npm start
```

### Development Setup
```bash
# Development dependencies
npm install --dev

# Linting ve formatting
npm run lint
npm run format

# Testing
npm test
```

## 📖 Kullanım

### 🖥️ CLI Komutları

#### Site Kontrolü
```bash
# Tek site kontrolü
who-is check https://example.com

# Çoklu site kontrolü
who-is check https://site1.com https://site2.com

# Liste dosyasından kontrol
who-is check-list sites.txt

# Detaylı analiz
who-is check https://example.com --details

# JSON çıktı
who-is check https://example.com --json
```

#### Domain Kontrolü
```bash
# Tek domain kontrolü
who-is domain example

# Çoklu extension kontrolü
who-is domain mysite --extensions com,net,org,io

# Market analizi ile
who-is domain techstartup --market-analysis

# Batch domain kontrolü
who-is domain-batch domains.txt
```

#### Word Hunt 🎯
```bash
# Basit kelime avcılığı
who-is word-hunt "teknoloji"

# Gelişmiş seçeneklerle
who-is word-hunt "fintech" --limit 50 --min-length 6 --max-length 12

# AI önerileri ile
who-is word-hunt "startup" --use-ai --extensions com,io,co

# Sayı ve tire kullanımı
who-is word-hunt "digital" --use-numbers --use-hyphens

# Özel konfigürasyon
who-is word-hunt "blockchain" --config custom-config.json
```

#### AI Domain Generator 🤖
```bash
# Sektör bazlı öneriler
who-is ai-suggest "tech startup for developers"

# Çoklu öneri
who-is ai-suggest "e-commerce platform" --count 20

# Belirli uzunluk
who-is ai-suggest "food delivery" --min-length 5 --max-length 10

# Premium öneriler
who-is ai-suggest "SaaS platform" --premium --market-analysis
```

### 🌐 Web Dashboard

Web arayüzüne erişim:
```bash
# Sunucuyu başlat
npm start

# Tarayıcıdan erişim
http://localhost:3000
```

#### Dashboard Özellikleri
- **🏠 Ana Dashboard**: Site durumu, domain kontrolü, genel bakış
- **🎯 Word Hunt**: Akıllı domain avcılığı sistemi
- **🤖 AI Generator**: Sektör bazlı domain önerileri
- **⚙️ Configuration**: Sistem ayarları ve konfigürasyon

#### Klavye Kısayolları
- `Ctrl/Cmd + K`: Hızlı arama
- `Ctrl/Cmd + T`: Tema değiştirme
- `Ctrl/Cmd + Enter`: Form gönderme
- `Esc`: Modal kapatma

### 📱 API Kullanımı

#### REST Endpoints
```javascript
// Site kontrolü
POST /api/check
{
    "url": "https://example.com",
    "options": { "timeout": 5000 }
}

// Domain kontrolü
POST /api/domain
{
    "domain": "example",
    "extensions": [".com", ".net", ".io"]
}

// Word hunt
POST /api/word-hunt
{
    "keyword": "teknoloji",
    "options": {
        "limit": 20,
        "useAI": true,
        "useNumbers": false,
        "useHyphens": true
    }
}

// AI öneriler
POST /api/ai-suggest
{
    "description": "tech startup",
    "sector": "tech",
    "count": 10
}
```

### ⚙️ Konfigürasyon

#### config.json
```json
{
    "defaultExtensions": ["com", "net", "org", "io", "co"],
    "wordHunt": {
        "defaultLimit": 20,
        "maxLimit": 100,
        "minLength": 3,
        "maxLength": 15,
        "timeout": 30000,
        "strategies": [
            "exact",
            "prefix",
            "suffix", 
            "compound",
            "synonyms",
            "related",
            "acronym",
            "variations"
        ]
    },
    "aiGenerator": {
        "model": "gpt-3.5-turbo",
        "maxTokens": 1000,
        "temperature": 0.7,
        "sectors": ["tech", "business", "creative", "health", "education"]
    },
    "server": {
        "port": 3000,
        "timeout": 10000,
        "rateLimiting": {
            "windowMs": 900000,
            "max": 100
        }
    }
}
```

#### Environment Variables
```bash
# .env dosyası
PORT=3000
NODE_ENV=production
API_TIMEOUT=10000
OPENAI_API_KEY=your_openai_key
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🏗️ Proje Yapısı

```
who-is/
├── 📁 commands/               # CLI komutları
│   ├── check.js              # Site kontrolü
│   ├── domain.js             # Domain kontrolü
│   ├── wordHunt.js           # Word hunt sistemi
│   └── aiSuggest.js          # AI öneriler
├── 📁 web/                   # Web dashboard
│   ├── index.html            # Ana sayfa
│   ├── app.js               # Frontend JavaScript
│   ├── style.css            # Stil dosyası
│   └── README.md            # Web dokümantasyonu
├── 📁 utils/                 # Yardımcı fonksiyonlar
│   ├── domainChecker.js     # Domain kontrol utilities
│   ├── aiDomainGenerator.js # AI algoritmaları
│   └── helpers.js           # Genel yardımcılar
├── 📄 server.js              # Express sunucusu
├── 📄 index.js               # CLI giriş noktası
├── 📄 package.json           # NPM konfigürasyonu
├── 📄 config.json            # Uygulama ayarları
└── 📄 README.md              # Ana dokümantasyon
```

### Mimari Yaklaşım

#### 🎯 Modüler Tasarım
- **Commands**: CLI komutları için ayrı modüller
- **Utils**: Tekrar kullanılabilir yardımcı fonksiyonlar
- **Web**: Frontend için ayrı dizin
- **Server**: API endpoints ve middleware

#### 🔄 Data Flow
```
CLI Input → Command Parser → Utils → API → Results
Web Input → Frontend JS → API → Utils → Response
```

#### 🧩 Component Architecture
```
┌─────────────────┐
│   Presentation  │ ← Web UI, CLI Interface
├─────────────────┤
│   Application   │ ← Commands, Routing, Logic
├─────────────────┤
│   Domain        │ ← Business Logic, Algorithms
├─────────────────┤
│   Infrastructure│ ← HTTP Clients, File System
└─────────────────┘
```

## 🛠️ Komut Seçenekleri ve Özellikler

### Global Seçenekler
- `-t, --timeout <ms>`: Zaman aşımı süresi (varsayılan: 5000ms)
- `-v, --verbose`: Detaylı çıktı
- `--json`: JSON formatında çıktı
- `--no-color`: Renkli çıktıyı devre dışı bırak

### Word Hunt Seçenekleri
- `--limit <num>`: Maksimum sonuç sayısı (varsayılan: 20)
- `--min-length <num>`: Minimum domain uzunluğu
- `--max-length <num>`: Maksimum domain uzunluğu
- `--use-ai`: AI önerilerini etkinleştir
- `--use-numbers`: Sayı kullanımını etkinleştir
- `--use-hyphens`: Tire kullanımını etkinleştir
- `--extensions <list>`: Kontrol edilecek uzantılar

### AI Generator Seçenekleri
- `--count <num>`: Üretilecek domain sayısı (varsayılan: 5)
- `--sector <name>`: Hedef sektör (tech, business, creative, health, education)
- `--premium`: Premium kalite modunda çalıştır
- `--market-analysis`: Market analizi dahil et
node index.js find-available mysite mybrand mycompany
```

### Domain Hunting (Sürekli Arama)

```bash
# Otomatik domain hunting başlat (sınırsız)
node index.js hunt

# Belirli kategorilerde ara
node index.js hunt --categories one-letter,two-letter,turkish,tech

# Özel uzantılarla ara
node index.js hunt --extensions .com,.net,.org

# Limit ile ara (1000 domain kontrol et)
node index.js hunt --limit 1000

# Hızlı arama (500ms interval)
node index.js hunt --interval 500

# İstatistikleri göster
node index.js hunt-stats

# Sonuç dosyalarını temizle
node index.js hunt-clear --yes
```

### AI Domain Generation (Yapay Zeka ile Domain Önerileri)

```bash
# AI ile domain önerileri al
node index.js ai-suggest "teknoloji şirketi"

# Belirli sektör için AI önerileri
node index.js ai-suggest "e-ticaret platformu" --count 10

# Toplu AI domain generation
node index.js ai-batch "startup, teknoloji, yapay zeka" --count 15

# Premium AI önerileri (kalite odaklı)
node index.js ai-suggest "fintech startup" --premium
```

### Trend Analizi

```bash
# 2025 teknoloji trendleri analizi
node index.js trend-analysis

# Trend bazlı domain önerileri
node index.js trend-domains --count 20

# Spesifik trend için domain önerileri
node index.js trend-domains --trend "ai-automation" --count 10
```

### Pazar Analizi

```bash
# Domain değer tahmini
node index.js market-analysis techstartup.com

# Toplu pazar analizi
node index.js market-analysis mysite.com yoursite.net theirsite.org

# Detaylı yatırım raporu
node index.js market-analysis mybrand.com --detailed
```

### Domain Generation Konfigürasyonu

```bash
# Mevcut konfigürasyonu görüntüle
node index.js domain-config-show

# Tire kullanımını kapat
node index.js domain-config-hyphens false

# Sayı kullanımını açık, pozisyonu sona al
node index.js domain-config-numbers true end

# Maksimum uzunluğu 10 karakter yap
node index.js domain-config-length 10

# Konfigürasyonu test et
node index.js domain-config-test example-domain-123

# Konfigürasyonu varsayılana sıfırla
node index.js domain-config-reset

# Özel konfigürasyon profili kaydet
node index.js domain-config-save premium-profile

# Kaydedilmiş profili yükle
node index.js domain-config-load premium-profile
```

### Sürekli İzleme

```bash
# 60 saniye aralıklarla izle
node index.js monitor sites.txt

# 30 saniye aralıklarla izle
node index.js monitor sites.txt --interval 30
```

## 🛠️ Komut Seçenekleri

### Global Seçenekler
- `-t, --timeout <ms>`: Zaman aşımı süresi (varsayılan: 5000ms)

### check-list ve monitor için
- `-c, --concurrency <num>`: Eş zamanlı istek sayısı (varsayılan: 10)

### monitor için
- `-i, --interval <seconds>`: Kontrol aralığı saniye (varsayılan: 60)

### check-domain ve check-domains için
- `-e, --extensions <exts>`: Kontrol edilecek uzantılar (varsayılan: .com,.com.tr,.net)

### AI komutları için
- `-c, --count <num>`: Üretilecek domain sayısı (varsayılan: 5)
- `--premium`: Premium kalite modunda çalıştır
- `--detailed`: Detaylı analiz raporu

### Domain konfigürasyonu için
- `--profile <name>`: Özel konfigürasyon profili kullan

## 📊 Çıktı Açıklamaları

### Durum Göstergeleri
- ✅ **Online**: Site erişilebilir
- ❌ **Offline**: Site erişilemiyor

### HTTP Status Kodları
- 🟢 **200-299**: Başarılı (yeşil)
- 🟡 **300-399**: Yönlendirme (sarı)
- 🔴 **400+**: Hata (kırmızı)

### Hata Mesajları
- **Alan adı bulunamadı**: DNS çözümlemesi başarısız
- **Bağlantı reddedildi**: Server bağlantıyı reddetti
- **Zaman aşımı**: Belirlenen sürede yanıt alınamadı
- **SSL sertifikası süresi dolmuş**: HTTPS sertifikası geçersiz

### AI ve Analiz Göstergeleri
- 🧠 **AI Puanı**: 0-100 arası kalite puanı
- 📈 **Trend Skoru**: Gelecek potansiyeli
- 💰 **Değer Tahmini**: Tahmini pazar değeri ($)
- ⚡ **Hız Puanı**: Telaffuz kolaylığı
- 🎯 **Marka Uyumu**: Marka değeri potansiyeli

### Domain Kalite Puanlama
- **90-100**: Mükemmel (🟢)
- **75-89**: Çok İyi (🟡)
- **60-74**: İyi (🟠)
- **40-59**: Orta (🔴)
- **0-39**: Zayıf (⚫)

## 📁 Örnek Site Listesi Dosyası

```txt
# Sosyal Medya
facebook.com
twitter.com
instagram.com

# Teknoloji
google.com
github.com
stackoverflow.com

# E-ticaret
amazon.com
ebay.com

# Haber
cnn.com
bbc.com
```

## ⚡ Performans İpuçları

1. **Eş zamanlılık**: Daha fazla site için `--concurrency` değerini artırın
2. **Timeout**: Yavaş siteler için timeout değerini artırın
3. **Interval**: İzleme modunda gereksiz yere sık kontrol yapmayın
4. **Liste Dosyası**: Yorumları (#) kullanarak gruplandırın
5. **AI Performansı**: Premium mode daha kaliteli ancak daha yavaş sonuçlar verir
6. **Konfigürasyon**: Domain generation kurallarını ihtiyacınıza göre ayarlayın
7. **Batch İşlemler**: Büyük listeler için batch komutlarını kullanın

## 🤖 AI Integration (Yapay Zeka Entegrasyonu)

### OpenAI API Kurulumu

1. OpenAI hesabı oluşturun ve API key alın
2. Environment variable olarak ekleyin:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

### AI Özellikleri
- **Sektör Analizi**: 5 farklı sektör için özelleştirilmiş domain önerileri
- **Kalite Puanlama**: Gelişmiş algoritmayla domain kalitesi değerlendirmesi
- **Trend Entegrasyonu**: 2025 teknoloji trendleri ile uyumlu öneriler
- **Yerel Fallback**: API olmadan da çalışan yerel AI algoritmaları
- **Pazar Değeri**: Domain'lerin potansiyel pazar değeri tahmini

## � Sonuç Dosyaları

Bulunan domain'ler otomatik olarak `domain-results/` klasörü altında kategorilere göre organize edilir:

```
domain-results/
├── general-domains.txt          # Genel domain arama sonuçları
├── one-letter-domains.txt       # Tek harfli domain'ler
├── two-letter-domains.txt       # İki harfli domain'ler
├── three-letter-domains.txt     # Üç harfli domain'ler
├── four-letter-domains.txt      # Dört harfli domain'ler
├── short-domains.txt            # Kısa domain'ler
├── numbers-domains.txt          # Sayısal domain'ler
├── ai-suggestions.txt           # AI önerileri
├── trend-domains.txt            # Trend bazlı domain'ler
└── high-value-domains.txt       # Yüksek değerli domain'ler
```

Her dosyada şu bilgiler saklanır:
- Domain adı ve uzantısı
- Müsaitlik durumu (✅ MÜSAİT / ❌ ALINMIŞ)
- Kalite puanı (0-100)
- Tarih ve saat bilgisi
- Registrar bilgisi (varsa)
- AI/Trend puanı (uygunsa)
- Tahmini değer (uygunsa)

## �🔧 Programmatik Kullanım

```javascript
const SiteChecker = require('./checker');
const DomainGenerator = require('./domain-generator');
const AIDomainGenerator = require('./aiDomainGenerator');

const checker = new SiteChecker({
  timeout: 5000,
  userAgent: 'MyApp/1.0'
});

// Tek site kontrolü
const result = await checker.checkSite('google.com');
console.log(result);

// Çoklu site kontrolü
const results = await checker.checkMultipleSites([
  'google.com',
  'github.com',
  'stackoverflow.com'
], 10); // 10 eş zamanlı istek

// Akıllı domain generation
const domainGen = new DomainGenerator();
const smartDomains = domainGen.generateSmartDomain('teknoloji', 'tech');
console.log('Akıllı domain önerileri:', smartDomains);

// AI domain generation
const aiGen = new AIDomainGenerator();
const aiDomains = await aiGen.generateAIDomains('fintech startup', 5);
console.log('AI domain önerileri:', aiDomains);

// Trend analizi
const trendDomains = await aiGen.generateTrendBasedDomains(10);
console.log('Trend bazlı domain'ler:', trendDomains);

// Sürekli izleme
checker.startMonitoring(['google.com'], 30000, (results) => {
  console.log('Yeni sonuçlar:', results);
});
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **ENOTFOUND**: Alan adı mevcut değil veya DNS sorunu
2. **ECONNREFUSED**: Server kapalı veya port erişilemiyor
3. **ETIMEDOUT**: Ağ bağlantısı yavaş, timeout artırın
4. **CERT_HAS_EXPIRED**: SSL sertifikası yenilenmiş gerekli

### Performans Sorunları

- Çok fazla eş zamanlı istek sistem kaynaklarını tüketebilir
- Yavaş internet bağlantısında timeout değerini artırın
- Büyük listeler için batch işleme otomatik olarak yapılır

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

Detaylı bilgi için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.

## 🔐 Güvenlik

Güvenlik açığı bulduysanız lütfen [SECURITY.md](SECURITY.md) dosyasındaki yönergeleri takip edin.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

**Copyright (c) 2025 Taha Yılmaz**

## 🙏 Teşekkürler

- [axios](https://github.com/axios/axios) - HTTP client
- [chalk](https://github.com/chalk/chalk) - Terminal renklendirme
- [commander.js](https://github.com/tj/commander.js) - CLI framework
- [whois](https://github.com/FurqanSoftware/node-whois) - WHOIS client
- [random-words](https://github.com/apostrophecms/random-words) - Rastgele kelime üretimi

## 📈 İstatistikler

![GitHub stars](https://img.shields.io/github/stars/Tahaylmz/who-is?style=social)
![GitHub forks](https://img.shields.io/github/forks/Tahaylmz/who-is?style=social)
![GitHub issues](https://img.shields.io/github/issues/Tahaylmz/who-is)
![GitHub license](https://img.shields.io/github/license/Tahaylmz/who-is)
![npm version](https://img.shields.io/npm/v/who-is)

## 🎯 Özellik Roadmap

### Tamamlanan Özellikler ✅
- [x] AI domain generation (OpenAI API)
- [x] Akıllı domain algoritmaları (6 strateji)
- [x] Trend analizi ve 2025 tahminleri
- [x] Pazar değeri tahmini
- [x] Domain kalite puanlama sistemi
- [x] Konfigürasyon yönetimi
- [x] Tire ve sayı kontrolü

### Gelecek Özellikler 🚀
- [ ] JSON/CSV çıktı formatları
- [ ] E-posta bildirimleri
- [ ] Webhook desteği
- [ ] Grafik dashboard
- [ ] Docker container
- [ ] Prometheus metrics
- [ ] Slack/Discord entegrasyonu
- [ ] Blockchain domain desteği (.eth, .crypto)
- [ ] Machine Learning model training
- [ ] API rate limiting ve quota yönetimi
