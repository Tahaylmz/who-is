# Who-Is Web Dashboard 🌐

Modern, responsive web arayüzü ile domain kontrolü, AI önerileri ve akıllı domain avcılığı.

## 🚀 Hızlı Başlangıç

### Sunucuyu Başlatma

```bash
# Ana dizinden
npm start

# Veya direkt server çalıştırma
node server.js
```

Tarayıcıdan `http://localhost:3000` adresine gidin.

## 📱 Özellikler

### 🏠 Ana Dashboard
- **Site Durumu**: Hızlı site kontrolü
- **Domain Checker**: Tek domain availability kontrolü
- **Genel Bakış**: Sistem durumu ve istatistikler
- **Hızlı Erişim**: Sık kullanılan işlemler

### 🎯 Word Hunt
- **Akıllı Arama**: Kelime bazlı domain avcılığı
- **8 Strateji**: Çeşitli domain üretim yöntemleri
- **Gerçek Zamanlı**: Canlı progress tracking
- **Seçenekler**: AI, sayı, tire kullanımı kontrolü
- **Extension Seçimi**: Checkbox ile kolay uzantı seçimi

### 🤖 AI Generator
- **Sektör Bazlı**: Tech, business, creative öneriler
- **Toplu Üretim**: Batch generation desteği
- **Trend Analizi**: Gelecek tahminleri
- **Market Değeri**: Otomatik pricing

### ⚙️ Configuration
- **Uzantı Yönetimi**: Aktif uzantı listesi
- **Domain Ayarları**: Üretim parametreleri
- **System Settings**: Genel konfigürasyon

## 🎨 Tasarım Özellikleri

### 🌓 Tema Sistemi
- **Dark Mode**: Modern koyu tema
- **Light Mode**: Klasik açık tema
- **Otomatik**: Sistem ayarına göre
- **Smooth Transition**: Yumuşak geçişler

### 📱 Responsive Design
```css
/* Breakpoint'ler */
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+

/* Grid Sistemi */
Grid: CSS Grid ve Flexbox
Spacing: 8px, 16px, 24px sistem
Typography: System fonts + JetBrains Mono
```

### 🎭 UI Components

#### Cards
```html
<div class="card">
    <div class="card-header">
        <h2>Title</h2>
    </div>
    <div class="card-body">
        Content
    </div>
</div>
```

#### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn-small">Small</button>
```

#### Forms
```html
<div class="form-group">
    <label>Label</label>
    <input type="text" placeholder="Placeholder">
</div>
```

#### Tabs
```html
<div class="tabs">
    <button class="tab-btn active">Tab 1</button>
    <button class="tab-btn">Tab 2</button>
</div>
```

## 🔧 API Endpoints

### Site Kontrolü
```javascript
POST /api/check
{
    "url": "https://example.com",
    "options": { "timeout": 5000 }
}
```

### Domain Kontrolü
```javascript
POST /api/domain
{
    "domain": "example",
    "extensions": [".com", ".net", ".io"]
}
```

### Word Hunt
```javascript
POST /api/word-hunt
{
    "keyword": "teknoloji",
    "options": {
        "limit": 20,
        "minLength": 5,
        "maxLength": 12,
        "extensions": ["com", "net", "io"],
        "useAI": true,
        "useNumbers": false,
        "useHyphens": true
    }
}
```

### AI Generator
```javascript
POST /api/ai-suggest
{
    "description": "tech startup",
    "sector": "tech",
    "count": 10
}
```

## 📁 Dosya Yapısı

```
web/
├── index.html          # Ana HTML dosyası
├── app.js             # Frontend JavaScript
├── style.css          # Ana CSS dosyası
└── README.md          # Bu dosya

Ana seviye:
├── server.js          # Express sunucusu
└── package.json       # NPM dependencies
```

## 🎯 JavaScript Fonksiyonları

### Core Functions
```javascript
// Tab sistemi
function initializeTabs()
function switchTab(tabName)

// Site kontrolü
async function checkSite()
function displayCheckResult(result)

// Domain kontrolü
async function checkDomain()
function displayDomainResult(result)
```

### Word Hunt Functions
```javascript
// Ana word hunt
async function startWordHunt()
function generateWordCombinations(keyword, options)

// AI kombinasyonlar
function generateAICombinations(baseWord, minLength, maxLength)

// Extension yönetimi
function selectAllExtensions()
function clearAllExtensions()

// Progress tracking
function updateWordHuntProgress(checked, total, current)
```

### Utility Functions
```javascript
// Notification sistemi
function showToast(message, type)

// Market analizi
function simulateMarketAnalysis(domain)
function calculateDomainValue(domain, extension)

// Tema yönetimi
function toggleTheme()
function setTheme(theme)
```

## 🎨 CSS Variables

### Renkler
```css
:root {
    /* Ana renkler */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    
    /* Tema renkleri */
    --bg-color: #ffffff;
    --text-color: #333333;
    --border-color: #dee2e6;
    --card-bg: #f8f9fa;
    
    /* Dark mode */
    --dark-bg: #1a1a1a;
    --dark-text: #ffffff;
    --dark-border: #404040;
    --dark-card: #2d2d2d;
}
```

### Typography
```css
/* Font aileleri */
--font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI';
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font boyutları */
--font-xs: 0.75rem;
--font-sm: 0.875rem;
--font-base: 1rem;
--font-lg: 1.125rem;
--font-xl: 1.25rem;
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Stacked form elements
- Touch-friendly buttons (44px min)
- Simplified navigation

### Tablet (768px - 1023px)
- Two column layout
- Optimized form grouping
- Medium sized components

### Desktop (> 1024px)
- Full multi-column layout
- Sidebar navigation
- Hover effects
- Keyboard shortcuts

## 🔧 Customization

### Tema Özelleştirme
```css
/* Custom theme */
[data-theme="custom"] {
    --primary-color: #your-color;
    --bg-color: #your-bg;
    /* ... */
}
```

### Yeni Component Ekleme
```javascript
// 1. HTML structure ekle
// 2. CSS styling tanımla
// 3. JavaScript functionality ekle
// 4. API endpoint bağla (gerekirse)
```

## 🚀 Performance

### Optimizasyonlar
- **CSS**: Minified production build
- **JavaScript**: ES6+ optimizations
- **Images**: WebP format ve lazy loading
- **Caching**: Service worker ready

### Metrics
- **First Paint**: < 500ms
- **Interactive**: < 1s
- **Lighthouse Score**: 95+

## 🐛 Debugging

### Console Commands
```javascript
// Tema değiştir
setTheme('dark')

// Manual API test
fetch('/api/check', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://example.com' })
})
```

### Common Issues
1. **API Connection**: Server port kontrolü
2. **Theme Loading**: CSS variables kontrolü
3. **Mobile Layout**: Viewport meta tag
4. **JavaScript Errors**: Browser console kontrolü

---

Made with ❤️ for modern web experiences
