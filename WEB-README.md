# Who-Is Web Dashboard 🌐

Modern, responsive ve kullanıcı dostu web arayüzü ile Who-Is uygulamasının tüm özelliklerini tarayıcınızdan kullanın!

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Web dashboard'u başlat
npm run web

# Tarayıcıda aç
http://localhost:3000
```

## ✨ Web Dashboard Özellikleri

### 📊 Ana Panel
- **Gerçek Zamanlı İstatistikler**: Toplam kontrol, online site ve müsait domain sayıları
- **Responsive Tasarım**: Desktop, tablet ve mobil uyumlu
- **Modern UI**: Material Design ilkeleri ile tasarlanmış arayüz
- **Koyu/Açık Tema**: Otomatik tema desteği

### 🔍 Site Status Checker
- **Tek Site Kontrolü**: Hızlı site durumu kontrolü
- **Toplu Site Kontrolü**: Birden fazla siteyi aynı anda kontrol
- **Gerçek Zamanlı Sonuçlar**: Anlık durum gösterimi
- **Detaylı Raporlama**: Yanıt süresi, HTTP status, server bilgileri

### 🎯 Domain Hunt
- **Otomatik Domain Avcılığı**: Sürekli çalışan domain arama
- **Kategori Seçimi**: 7 farklı domain kategorisi
- **Gerçek Zamanlı İstatistikler**: Hunt başarı oranı ve sonuçlar
- **Filtreleme Seçenekleri**: Uzantı, limit ve interval ayarları

### 🤖 AI Domain Generator
- **OpenAI Entegrasyonu**: Yapay zeka destekli domain önerileri
- **Sektör Bazlı Üretim**: 5 farklı sektör seçeneği
- **6 Farklı Strateji**: Çeşitli domain üretim algoritmaları
- **Premium Mod**: Yüksek kaliteli öneriler
- **Otomatik Müsaitlik Kontrolü**: Önerilen domain'lerin durumu

### 📈 Trend Analysis
- **2025 Teknoloji Trendleri**: Güncel trend analizi
- **Trend Bazlı Domain'ler**: Gelecek odaklı öneriler
- **Pazar Büyüme Verileri**: Yatırım potansiyeli bilgileri
- **Spesifik Trend Filtreleri**: AI, Blockchain, Sürdürülebilirlik vb.

### 💰 Market Analysis
- **Domain Değer Tahmini**: Pazar değeri hesaplama
- **Yatırım Analizi**: ROI ve potansiyel değerlendirmesi
- **Detaylı Raporlar**: SEO skoru, marka değeri, yaş analizi
- **Toplu Analiz**: Birden fazla domain değerlendirmesi

### ⚙️ Configuration Management
- **Domain Kuralları**: Tire, sayı ve uzunluk ayarları
- **Kalite Puanlama**: Özelleştirilebilir puanlama sistemi
- **Test Modu**: Konfigürasyon testleri
- **Profil Yönetimi**: Kayıt ve yükleme işlemleri

## 🎨 Kullanıcı Arayüzü

### Ana Navigasyon
- **Site Check**: Site durum kontrolü
- **Domain Hunt**: Otomatik domain avcılığı
- **AI Generator**: Yapay zeka domain önerileri
- **Trend Analysis**: Trend analizi ve tahminleri
- **Market Analysis**: Pazar değeri analizi
- **Configuration**: Ayarlar ve konfigürasyon

### Sonuç Gösterimi
- **Renkli Durumlar**: Yeşil (online/müsait), Kırmızı (offline/alınmış)
- **Kalite Puanları**: 0-100 arası renk kodlu puanlama
- **Detaylı Bilgiler**: Yanıt süresi, server, registrar bilgileri
- **Export Seçenekleri**: Sonuçları kaydetme ve indirme

### Gerçek Zamanlı Özellikler
- **Canlı İstatistikler**: Anlık güncellenen sayaçlar
- **Progress Takibi**: İşlem durumu ve ilerleme
- **Toast Bildirimleri**: Başarı, hata ve uyarı mesajları
- **Loading Animasyonları**: Kullanıcı deneyimi odaklı

## 🔧 API Endpoints

### Site Operations
- `POST /api/check-site` - Tek site kontrolü
- `POST /api/check-bulk` - Toplu site kontrolü
- `POST /api/monitor` - Site izleme başlat

### Domain Operations
- `POST /api/check-domain` - Domain uzantı kontrolü
- `POST /api/check-availability` - Domain müsaitlik kontrolü
- `POST /api/hunt-start` - Domain hunt başlat
- `GET /api/hunt-stats` - Hunt istatistikleri
- `POST /api/hunt-clear` - Hunt sonuçlarını temizle

### AI & Analysis
- `POST /api/ai-suggest` - AI domain önerileri
- `POST /api/ai-batch` - Toplu AI üretim
- `GET /api/trend-analysis` - Trend analizi
- `POST /api/trend-domains` - Trend bazlı domain'ler
- `POST /api/market-analysis` - Pazar analizi

### Configuration
- `GET /api/config` - Mevcut konfigürasyon
- `POST /api/config/hyphens` - Tire ayarları
- `POST /api/config/numbers` - Sayı ayarları
- `POST /api/config/length` - Uzunluk ayarları
- `POST /api/config/test` - Konfigürasyon testi
- `POST /api/config/reset` - Ayarları sıfırla

### Results & Data
- `GET /api/results/:category` - Kategori sonuçları
- `GET /api/health` - Sistem durumu

## 🎯 Kullanım Senaryoları

### 1. Hızlı Site Kontrolü
```
1. "Site Check" sekmesine git
2. URL gir (örn: google.com)
3. "Check Site" butonuna tıkla
4. Sonuçları görüntüle
```

### 2. Domain Avcılığı
```
1. "Domain Hunt" sekmesine git
2. Kategorileri seç (tek-harf, teknoloji vb.)
3. Limit ve interval ayarla
4. "Start Hunt" ile başlat
5. Müsait domain'leri gerçek zamanlı izle
```

### 3. AI Domain Üretimi
```
1. "AI Generator" sekmesine git
2. Açıklama gir ("teknoloji şirketi")
3. Sektör ve strateji seç
4. "Generate AI Domains" tıkla
5. Kaliteli önerileri incele
```

### 4. Trend Analizi
```
1. "Trend Analysis" sekmesine git
2. "Get 2025 Trend Analysis" tıkla
3. Teknoloji trendlerini incele
4. Trend bazlı domain'ler üret
5. Gelecek potansiyelini değerlendir
```

### 5. Pazar Değeri Analizi
```
1. "Market Analysis" sekmesine git
2. Domain'leri gir (virgülle ayır)
3. Detaylı analiz seç (opsiyonel)
4. "Analyze Market Value" tıkla
5. Yatırım potansiyelini görüntüle
```

## 🔒 Güvenlik

- **API Rate Limiting**: Kötüye kullanım koruması
- **Input Validation**: Güvenli veri işleme
- **Error Handling**: Kapsamlı hata yönetimi
- **CORS Protection**: Cross-origin güvenliği

## 📱 Responsive Design

### Desktop (1200px+)
- Tam özellikli arayüz
- Çoklu sütun layout
- Gelişmiş filtreleme

### Tablet (768px - 1199px)
- Optimize edilmiş düzen
- Touch-friendly butonlar
- Swipe navigasyon

### Mobile (320px - 767px)
- Tek sütun layout
- Büyük dokunma alanları
- Minimal navigasyon

## 🎨 Tema ve Stil

### Renk Paleti
- **Primary**: #3b82f6 (Modern mavi)
- **Success**: #10b981 (Yeşil)
- **Danger**: #ef4444 (Kırmızı)
- **Warning**: #f59e0b (Turuncu)
- **Info**: #06b6d4 (Cyan)

### Typography
- **Font**: Inter, system fonts
- **Hierarchy**: H1-H6 responsive scales
- **Readability**: Optimized line-height

### Animations
- **Smooth Transitions**: 0.3s ease
- **Micro-interactions**: Hover effects
- **Loading States**: Spinner ve progress

## 🚀 Performance

### Optimizasyonlar
- **Lazy Loading**: Gerektiğinde yükleme
- **Debounced Inputs**: Gereksiz API çağrıları önleme
- **Caching**: LocalStorage kullanımı
- **Compression**: Gzip sıkıştırma

### Metrics
- **First Paint**: <500ms
- **Interactive**: <1000ms
- **Bundle Size**: <200KB
- **API Response**: <2000ms

## 🔧 Geliştirme

### Local Development
```bash
# Backend + Frontend development
npm run web-dev

# Sadece frontend (static files)
cd web && python -m http.server 8000
```

### Build & Deploy
```bash
# Production build
npm run build

# Docker deployment
docker build -t who-is-web .
docker run -p 3000:3000 who-is-web
```

### Code Structure
```
web/
├── index.html          # Ana HTML dosyası
├── style.css           # CSS stilleri
├── app.js             # Frontend JavaScript
└── assets/            # Statik dosyalar
    ├── icons/
    ├── images/
    └── fonts/
```

## 📈 Analytics & Monitoring

### Kullanım İstatistikleri
- **Sayfa Görüntülemeleri**: Google Analytics
- **API Kullanımı**: Request logging
- **Hata Takibi**: Error monitoring
- **Performance**: Real User Monitoring

### Dashboard Metrics
- **Response Times**: API performansı
- **Success Rates**: İşlem başarı oranları
- **User Sessions**: Aktif kullanıcı sayısı
- **Feature Usage**: Özellik kullanım istatistikleri

## 🤝 Katkıda Bulunma

Web dashboard geliştirme için:

1. Frontend bugs ve improvements
2. UI/UX iyileştirmeleri
3. Yeni özellik önerileri
4. Performance optimizasyonları
5. Mobile deneyim iyileştirmeleri

## 📄 Lisans

MIT License - Web dashboard dahil tüm projede aynı lisans geçerlidir.

---

**🌟 Modern web teknolojileri ile geliştirilmiş, kullanıcı dostu domain ve site analiz platformu!**
