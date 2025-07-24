const axios = require('axios');
const { performance } = require('perf_hooks');
const dns = require('dns').promises;
const whois = require('whois');
const { promisify } = require('util');

const whoisLookup = promisify(whois.lookup);

class SiteChecker {
    constructor(options = {}) {
        this.timeout = options.timeout || 5000;
        this.userAgent = options.userAgent || 'SiteChecker/1.0';
        this.followRedirects = options.followRedirects !== false;
        this.maxRedirects = options.maxRedirects || 5;
    }

    /**
     * Tek bir sitenin durumunu kontrol eder
     * @param {string} url - Kontrol edilecek URL
     * @returns {Promise<Object>} Site durumu bilgileri
     */
    async checkSite(url) {
        const startTime = performance.now();

        try {
            // URL'yi normalize et
            const normalizedUrl = this.normalizeUrl(url);

            const response = await axios.get(normalizedUrl, {
                timeout: this.timeout,
                maxRedirects: this.maxRedirects,
                validateStatus: () => true, // Tüm status kodlarını kabul et
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive'
                }
            });

            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            return {
                url: normalizedUrl,
                status: 'online',
                statusCode: response.status,
                statusText: response.statusText,
                responseTime: responseTime,
                contentLength: response.headers['content-length'] || 0,
                server: response.headers.server || 'Unknown',
                lastModified: response.headers['last-modified'] || null,
                timestamp: new Date().toISOString(),
                isHealthy: this.isHealthyStatus(response.status)
            };

        } catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            return {
                url: this.normalizeUrl(url),
                status: 'offline',
                error: this.getErrorMessage(error),
                responseTime: responseTime,
                timestamp: new Date().toISOString(),
                isHealthy: false
            };
        }
    }

    /**
     * Birden fazla siteyi paralel olarak kontrol eder
     * @param {Array<string>} urls - Kontrol edilecek URL'ler
     * @param {number} concurrency - Eş zamanlı istek sayısı
     * @returns {Promise<Array>} Site durumu sonuçları
     */
    async checkMultipleSites(urls, concurrency = 10) {
        const results = [];

        // URL'leri gruplara böl
        for (let i = 0; i < urls.length; i += concurrency) {
            const batch = urls.slice(i, i + concurrency);
            const batchPromises = batch.map(url => this.checkSite(url));

            try {
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
            } catch (error) {
                console.error('Batch işlemi sırasında hata:', error.message);
            }
        }

        return results;
    }

    /**
     * URL'yi normalize eder
     * @param {string} url 
     * @returns {string} Normalize edilmiş URL
     */
    normalizeUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }

    /**
     * Domain'in satın alınıp alınmadığını kontrol eder (DNS + WHOIS)
     * @param {string} domain - Kontrol edilecek domain
     * @returns {Promise<Object>} Domain durumu bilgileri
     */
    async checkDomainAvailability(domain) {
        const startTime = performance.now();
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

        try {
            // 1. DNS A kaydı kontrolü
            let dnsResult = null;
            let hasARecord = false;

            try {
                dnsResult = await dns.resolve4(cleanDomain);
                hasARecord = dnsResult && dnsResult.length > 0;
            } catch (dnsError) {
                // DNS hatası - domain kayıtlı olmayabilir
                hasARecord = false;
            }

            // 2. DNS NS kaydı kontrolü (nameserver)
            let hasNSRecord = false;
            try {
                const nsResult = await dns.resolveNs(cleanDomain);
                hasNSRecord = nsResult && nsResult.length > 0;
            } catch (nsError) {
                hasNSRecord = false;
            }

            // 3. WHOIS sorgusu
            let whoisData = null;
            let isRegistered = false;
            let registrar = null;
            let creationDate = null;
            let expirationDate = null;

            try {
                whoisData = await whoisLookup(cleanDomain);

                // WHOIS verisini analiz et
                if (whoisData) {
                    const whoisLower = whoisData.toLowerCase();

                    // Domain kayıtlı mı kontrol et
                    isRegistered = !whoisLower.includes('no matching record') &&
                        !whoisLower.includes('no match') &&
                        !whoisLower.includes('not found') &&
                        !whoisLower.includes('no data found') &&
                        !whoisLower.includes('no entries found') &&
                        whoisLower.includes('domain');

                    // Registrar bilgisini çıkar
                    const registrarMatch = whoisData.match(/registrar:\s*(.+)/i) ||
                        whoisData.match(/registrar name:\s*(.+)/i);
                    if (registrarMatch) {
                        registrar = registrarMatch[1].trim();
                    }

                    // Oluşturma tarihi
                    const creationMatch = whoisData.match(/creation date:\s*(.+)/i) ||
                        whoisData.match(/created:\s*(.+)/i) ||
                        whoisData.match(/registered:\s*(.+)/i);
                    if (creationMatch) {
                        creationDate = creationMatch[1].trim();
                    }

                    // Son kullanma tarihi
                    const expirationMatch = whoisData.match(/expiration date:\s*(.+)/i) ||
                        whoisData.match(/expires:\s*(.+)/i) ||
                        whoisData.match(/expire:\s*(.+)/i);
                    if (expirationMatch) {
                        expirationDate = expirationMatch[1].trim();
                    }
                }
            } catch (whoisError) {
                // WHOIS hatası - bazı TLD'ler için WHOIS erişimi kısıtlı olabilir
                console.warn(`WHOIS sorgusu başarısız: ${cleanDomain}`);
            }

            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            // Sonuç analizi
            let status = 'unknown';
            let availability = 'unknown';

            if (isRegistered || hasARecord || hasNSRecord) {
                status = 'registered';
                availability = 'taken';
            } else {
                status = 'available';
                availability = 'available';
            }

            return {
                domain: cleanDomain,
                status: status,
                availability: availability,
                isRegistered: isRegistered,
                hasARecord: hasARecord,
                hasNSRecord: hasNSRecord,
                aRecords: hasARecord ? dnsResult : null,
                registrar: registrar,
                creationDate: creationDate,
                expirationDate: expirationDate,
                responseTime: responseTime,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            return {
                domain: cleanDomain,
                status: 'error',
                availability: 'unknown',
                error: this.getErrorMessage(error),
                responseTime: responseTime,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Bir domain için farklı uzantıların erişilebilirliğini kontrol eder
     * @param {string} domain - Ana domain adı (örn: "google")  
     * @param {Array<string>} extensions - Kontrol edilecek uzantılar
     * @returns {Promise<Array>} Tüm uzantılar için erişilebilirlik sonuçları
     */
    async checkDomainExtensions(domain, extensions = ['.com']) {
        // Domain'den mevcut uzantıyı temizle
        const cleanDomain = domain.replace(/\.(com|net|org|tr|com\.tr|io|dev|app|tech)$/i, '');

        const urls = extensions.map(ext => `https://${cleanDomain}${ext}`);

        const results = await this.checkMultipleSites(urls);
        return results;
    }

    /**
     * Bir domain için farklı uzantıların availability durumunu kontrol eder
     * @param {string} domain - Ana domain adı (örn: "google")
     * @param {Array<string>} extensions - Kontrol edilecek uzantılar
     * @returns {Promise<Array>} Tüm uzantılar için availability sonuçları
     */
    async checkDomainAvailabilityWithExtensions(domain, extensions = ['.com', '.com.tr', '.net']) {
        // Domain'den mevcut uzantıyı temizle
        const cleanDomain = domain.replace(/\.(com|net|org|tr|com\.tr)$/i, '');

        const domains = extensions.map(ext => `${cleanDomain}${ext}`);

        console.log(`🔍 ${cleanDomain} için ${extensions.length} farklı uzantının availability durumu kontrol ediliyor...`);

        const results = [];

        // Sıralı olarak kontrol et (WHOIS rate limiting için)
        for (const domainToCheck of domains) {
            try {
                const result = await this.checkDomainAvailability(domainToCheck);
                results.push(result);

                // Rate limiting için kısa bekleme
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`❌ ${domainToCheck} için hata:`, error.message);
                results.push({
                    domain: domainToCheck,
                    status: 'error',
                    availability: 'unknown',
                    error: error.message,
                    responseTime: 0,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // Sonuçları availability durumuna göre sırala (available olanlar önce)
        return results.sort((a, b) => {
            if (a.availability === 'available' && b.availability === 'taken') return -1;
            if (a.availability === 'taken' && b.availability === 'available') return 1;
            return a.responseTime - b.responseTime;
        });
    }

    /**
     * Bir site listesi için her domain'in farklı uzantılarını kontrol eder
     * @param {Array<string>} domains - Kontrol edilecek domain'ler
     * @param {Array<string>} extensions - Kontrol edilecek uzantılar
     * @returns {Promise<Object>} Domain'lere göre gruplandırılmış sonuçlar
     */
    async checkMultipleDomainsWithExtensions(domains, extensions = ['.com', '.com.tr', '.net']) {
        const results = {};

        console.log(`🚀 ${domains.length} domain için ${extensions.length} uzantı kontrol ediliyor...`);

        for (const domain of domains) {
            try {
                const domainResults = await this.checkDomainExtensions(domain, extensions);
                results[domain] = domainResults;
            } catch (error) {
                console.error(`❌ ${domain} için hata:`, error.message);
                results[domain] = [];
            }
        }

        return results;
    }

    /**
     * HTTP status kodunun sağlıklı olup olmadığını kontrol eder
     * @param {number} statusCode 
     * @returns {boolean}
     */
    isHealthyStatus(statusCode) {
        return statusCode >= 200 && statusCode < 400;
    }

    /**
     * Hata mesajını kullanıcı dostu hale getirir
     * @param {Error} error 
     * @returns {string}
     */
    getErrorMessage(error) {
        if (error.code === 'ENOTFOUND') {
            return 'Alan adı bulunamadı';
        } else if (error.code === 'ECONNREFUSED') {
            return 'Bağlantı reddedildi';
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            return 'Zaman aşımı';
        } else if (error.code === 'ECONNRESET') {
            return 'Bağlantı resetlendi';
        } else if (error.code === 'CERT_HAS_EXPIRED') {
            return 'SSL sertifikası süresi dolmuş';
        } else {
            return error.message || 'Bilinmeyen hata';
        }
    }

    /**
     * Sürekli izleme modunu başlatır
     * @param {Array<string>} urls - İzlenecek URL'ler
     * @param {number} interval - Kontrol aralığı (milisaniye)
     * @param {Function} callback - Her kontrol sonrası çağrılacak fonksiyon
     */
    startMonitoring(urls, interval = 60000, callback) {
        console.log(`🚀 ${urls.length} site için izleme başlatıldı...`);

        const monitor = async () => {
            const results = await this.checkMultipleSites(urls);
            if (callback) {
                callback(results);
            }
        };

        // İlk kontrolü hemen yap
        monitor();

        // Periyodik kontrolleri başlat
        return setInterval(monitor, interval);
    }
}

module.exports = SiteChecker;
