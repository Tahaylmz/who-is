# Who-Is Site Checker 🚀

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

## 🔧 Programmatik Kullanım

```javascript
const SiteChecker = require('./checker');

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

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🎯 Özellik Roadmap

- [ ] JSON/CSV çıktı formatları
- [ ] E-posta bildirimleri
- [ ] Webhook desteği
- [ ] Grafik dashboard
- [ ] Docker container
- [ ] Prometheus metrics
- [ ] Slack/Discord entegrasyonu
