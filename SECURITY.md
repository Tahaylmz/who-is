# Güvenlik Politikası

## 🛡️ Desteklenen Sürümler

Aşağıdaki Who-Is Site Checker sürümleri güvenlik güncellemeleri alır:

| Sürüm | Destekleniyor          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🚨 Güvenlik Açığı Bildirimi

Güvenlik açığı bulduğunuzda lütfen **genel issue açmayın**. Bunun yerine:

### 📧 İletişim
- **E-posta**: tahayilmazdev@gmail.com
- **GitHub**: Private vulnerability reporting (Tahaylmz/who-is-site-checker)

### 📋 Rapor İçeriği

Raporunuzda şunları belirtin:

1. **Açığın türü** (örn: RCE, XSS, Information Disclosure)
2. **Etkilenen dosyalar/fonksiyonlar**
3. **Adım adım exploit senaryosu**
4. **Potansiyel etki analizi**
5. **Önerilen çözüm** (varsa)

### ⏱️ Yanıt Süresi

- **24 saat** içinde alındı onayı
- **72 saat** içinde ilk değerlendirme
- **1 hafta** içinde çözüm planı
- **30 gün** içinde fix (kritik açıklar için daha hızlı)

## 🔒 Güvenlik En İyi Uygulamaları

### Geliştiriciler İçin

#### 1. Input Validation
```javascript
// Domain input'ları temizle
const cleanDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '');
```

#### 2. Rate Limiting
```javascript
// WHOIS sorgularını rate limit'le
await new Promise(resolve => setTimeout(resolve, 500));
```

#### 3. Error Handling
```javascript
// Hassas bilgileri loglama
console.error('WHOIS hatası:', sanitizeError(error));
```

#### 4. File Permissions
```javascript
// Dosya yazarken güvenli permissions
await fs.promises.writeFile(filename, data, { mode: 0o644 });
```

### Kullanıcılar İçin

#### 1. Network Security
- VPN kullanarak WHOIS sorgularınızı gizleyin
- Public WiFi'de domain hunting yapmayın
- DNS over HTTPS (DoH) kullanın

#### 2. Rate Limiting
- Çok hızlı sorgu yapmayın (WHOIS ban riski)
- `--interval` parametresini kullanın
- Respect robots.txt ve ToS

#### 3. Data Privacy
- Sonuç dosyalarını paylaşmadan önce gözden geçirin
- Hassas domain'leri public repo'ya commitlemeyin
- `.gitignore` ayarlarını kontrol edin

## 🚫 Güvenlik Anti-Patterns

### ❌ Yapılmaması Gerekenler

1. **Hardcoded Credentials**
   ```javascript
   // YANLIŞ
   const apiKey = 'sk-1234567890abcdef';
   
   // DOĞRU
   const apiKey = process.env.API_KEY;
   ```

2. **Command Injection**
   ```javascript
   // YANLIŞ
   exec(`whois ${userInput}`);
   
   // DOĞRU
   const result = await whoisLookup(sanitized(userInput));
   ```

3. **Path Traversal**
   ```javascript
   // YANLIŞ
   fs.writeFile(userProvidedPath, data);
   
   // DOĞRU
   const safePath = path.join(SAFE_DIR, path.basename(userInput));
   ```

## 🔍 Güvenlik Kontrolü

### Otomatik Kontroller
- `npm audit` - vulnerability scanning
- `snyk test` - dependency check
- ESLint security rules
- GitHub Security Advisories

### Manuel Kontroller
- Code review checklist
- Penetration testing
- Dependency updates
- Security headers check

## 📦 Bağımlılık Güvenliği

### Güvenilir Paketler
```json
{
  "dependencies": {
    "axios": "^1.6.0",      // HTTP client - actively maintained
    "chalk": "^4.1.2",      // Terminal colors - stable
    "whois": "^2.15.0"      // WHOIS client - check for updates
  }
}
```

### Güvenlik Kontrolü
```bash
# Vulnerability scan
npm audit

# Güvenlik yamaları
npm audit fix

# Outdated paketler
npm outdated
```

## 🏆 Responsible Disclosure

### Hall of Fame
Güvenlik açığı bildiren araştırmacılar:

- Taha Yılmaz - 2025-07-24 - Project Creator & Security Lead

### Ödüller
- Küçük güvenlik açıkları: Acknowledgment
- Orta düzey açıklar: Acknowledgment + Small gift
- Kritik açıklar: Acknowledgment + Bounty (mümkünse)

## 📚 Güvenlik Kaynakları

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [npm Security Best Practices](https://docs.npmjs.com/security)

---

Güvenliğiniz bizim için önemli! 🔐
