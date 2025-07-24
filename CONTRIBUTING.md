# Katkıda Bulunma Rehberi

Who-Is Site Checker projesine katkıda bulunduğunuz için teşekkür ederiz! 🎉

## 🚀 Başlangıç

1. **Repository'yi fork edin**
2. **Yerel bilgisayarınıza clone edin**
   ```bash
   git clone https://github.com/Tahaylmz/who-is-site-checker.git
   cd who-is-site-checker
   ```
3. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```
4. **Testleri çalıştırın**
   ```bash
   npm test
   ```

## 💡 Katkı Türleri

### 🐛 Bug Düzeltmeleri
- Hata raporları için issue açın
- Mümkünse hata için test case ekleyin
- Bug'ı düzelten kod değişikliği yapın

### ✨ Yeni Özellikler
- Önce feature request issue'su açın
- Özelliği tartışalım
- Implementation'ı yapın

### 📚 Dokümantasyon
- README.md güncellemeleri
- Kod yorumları ekleme/düzeltme
- Kullanım örnekleri ekleme

### 🌍 Çeviri
- Yeni dil desteği ekleme
- Mevcut çevirileri düzeltme

## 🔧 Geliştirme Süreci

### 1. Branch Oluşturma
```bash
git checkout -b feature/awesome-feature
# veya
git checkout -b bugfix/fix-issue-123
```

### 2. Kod Yazma
- **Kod stiline uyun**
- **Yorum ekleyin**
- **Test yazın**

### 3. Test Etme
```bash
npm test
npm run lint  # Eğer linter varsa
```

### 4. Commit
```bash
git add .
git commit -m "feat: yeni awesome özellik eklendi"
```

#### Commit Mesaj Formatı
- `feat:` - Yeni özellik
- `fix:` - Bug düzeltmesi
- `docs:` - Dokümantasyon
- `style:` - Kod formatı
- `refactor:` - Kod yeniden yapılandırması
- `test:` - Test ekleme/düzeltme
- `chore:` - Build süreçleri vb.

### 5. Push ve Pull Request
```bash
git push origin feature/awesome-feature
```

GitHub'da Pull Request oluşturun.

## 📋 PR Kontrol Listesi

- [ ] Kod çalışıyor ve test edildi
- [ ] Testler eklendi/güncellendi
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları temiz
- [ ] Conflicts çözüldü

## 🎯 Özellik İstekleri

Yeni özellik önerileri için:

1. **Issue açın** - "Feature Request" template'i kullanın
2. **Kullanım durumunu açıklayın**
3. **Örnekler verin**
4. **Alternatif çözümleri belirtin**

## 🐛 Bug Raporları

Bug bulduğunuzda:

1. **Mevcut issue'ları kontrol edin**
2. **Yeni issue açın** - "Bug Report" template'i kullanın
3. **Adım adım nasıl reproduce edileceğini yazın**
4. **Beklenen ve gerçek davranışı belirtin**
5. **Sistem bilgilerini ekleyin**
6. **Screenshots/logs ekleyin**

## 🛠️ Geliştirme Ortamı

### Önerilen IDE Ayarları
- VS Code kullanıyorsanız `.vscode/settings.json` ekleyin
- ESLint ve Prettier kullanın
- Node.js 18+ kullanın

### Yararlı Komutlar
```bash
# Development mode
npm run dev

# Testleri watch mode'da çalıştır
npm run test:watch

# Domain hunting test
node index.js hunt --categories tech --limit 5

# Linting
npm run lint

# Code formatting
npm run format
```

## 🌟 Katkıda Bulunanlar

Tüm katkıda bulunanlar README'de listelenecektir.

## 📞 İletişim

- **Issues**: GitHub Issues kullanın
- **Discussions**: GitHub Discussions
- **Security**: SECURITY.md dosyasına bakın

## 📜 Lisans

Katkıda bulunarak, kodunuzun MIT lisansı altında dağıtılmasını kabul etmiş olursunuz.

---

Tekrar teşekkürler! 🙏 Her türlü katkı değerlidir.
