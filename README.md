# Who is ✨ Özellikler

- ⚡ **Çok Hızlı**: Paralel isteklerle yüzlerce siteyi saniyeler içinde kontrol
- 🎯 **Akıllı Analiz**: HTTP status kodları, yanıt süreleri ve server bilgileri
- 🌐 **Domain Uzantı Kontrolü**: .com,## 🔧 Proje Yapısı

```
who-is/
├── 📁 commands/           # Komut modülleri
│   ├── check.js          # Site kontrol komutları
│   ├── domain.js         # Domain işlemleri
│   ├── hunt.js           # Domain hunting sistemi
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

```bash
# Bağımlılıkları yükle
npm install

# Global olarak yükle (opsiyonel)
npm link
```

## 📖 Kullanım

### Tek Site Kontrolü

```bash
# Basit kontrol
node index.js check google.com

# Özel timeout ile
node index.js check github.com --timeout 3000
```

### Çoklu Site Kontrolü

Önce bir site listesi dosyası oluşturun (`sites.txt`):

```
google.com
github.com
stackoverflow.com
# Bu bir yorum satırı - atlanır
https://www.linkedin.com
facebook.com
```

```bash
# Liste dosyasından kontrol
node index.js check-list sites.txt

# Eş zamanlı istek sayısını artır
node index.js check-list sites.txt --concurrency 20
```

### Hızlı Test

```bash
# Birden fazla siteyi hızlıca test et
node index.js quick google.com github.com stackoverflow.com
```

### Domain Uzantı Kontrolü

```bash
# Bir domain için farklı uzantıları kontrol et (erişilebilirlik)
node index.js check-domain google

# Özel uzantılar belirle
node index.js check-domain mysite --extensions .com,.net,.org,.com.tr

# Birden fazla domain için uzantı kontrolü
node index.js check-domains google facebook twitter
```

### Domain Availability (Müsaitlik) Kontrolü

```bash
# Bir domain için hangi uzantıların satın alınıp alınmadığını kontrol et
node index.js check-availability myawesomesite

# Özel uzantılarla availability kontrolü
node index.js check-availability mybrand --extensions .com,.com.tr,.net,.org

# Birden fazla domain için müsait olanları bul
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
