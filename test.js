const SiteChecker = require('./checker');
const DomainGenerator = require('./domain-generator');
const chalk = require('chalk');

async function runTests() {
    console.log(chalk.blue('🧪 Site Checker testleri başlatılıyor...\n'));

    const checker = new SiteChecker({ timeout: 3000 });

    // Test 1: Tek site kontrolü
    console.log(chalk.yellow('Test 1: Tek site kontrolü'));
    try {
        const result = await checker.checkSite('google.com');
        console.log(chalk.green('✅ Başarılı:'), result.status === 'online' ? 'Online' : 'Offline');
        console.log(chalk.gray(`   Yanıt süresi: ${result.responseTime}ms`));
        console.log(chalk.gray(`   Status kod: ${result.statusCode}`));
    } catch (error) {
        console.log(chalk.red('❌ Hata:'), error.message);
    }

    console.log();

    // Test 2: Çoklu site kontrolü
    console.log(chalk.yellow('Test 2: Çoklu site kontrolü'));
    try {
        const urls = ['google.com', 'github.com', 'nonexistentsite12345.com'];
        const results = await checker.checkMultipleSites(urls, 3);

        results.forEach(result => {
            const status = result.status === 'online' ?
                chalk.green('✅ Online') :
                chalk.red('❌ Offline');
            console.log(`   ${result.url}: ${status} (${result.responseTime}ms)`);
        });
    } catch (error) {
        console.log(chalk.red('❌ Hata:'), error.message);
    }

    console.log();

    // Test 3: URL normalizasyon testi
    console.log(chalk.yellow('Test 3: URL normalizasyon'));
    const testUrls = [
        'google.com',
        'http://google.com',
        'https://google.com'
    ];

    testUrls.forEach(url => {
        const normalized = checker.normalizeUrl(url);
        console.log(chalk.gray(`   ${url} → ${normalized}`));
    });

    console.log();

    // Test 4: Hata mesajları testi
    console.log(chalk.yellow('Test 4: Hata mesajları'));
    try {
        const result = await checker.checkSite('nonexistentsite12345.com');
        console.log(chalk.gray(`   Hata mesajı: ${result.error}`));
    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();

    // Test 5: Domain uzantı testi
    console.log(chalk.yellow('Test 5: Domain uzantı kontrolü'));
    try {
        const results = await checker.checkMultipleSites(['https://google.com', 'https://google.com.tr']);
        console.log(chalk.green(`✅ ${results.length} uzantı kontrol edildi`));

        results.forEach(result => {
            const status = result.status === 'online' ?
                chalk.green('✅ Online') :
                chalk.red('❌ Offline');
            console.log(`   ${result.url}: ${status} (${result.responseTime}ms)`);
        });
    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();

    // Test 6: Domain availability kontrolü
    console.log(chalk.yellow('Test 6: Domain availability kontrolü'));
    try {
        console.log(chalk.gray('   Test domain availability kontrol ediliyor...'));
        const result = await checker.checkDomainAvailability('testdomain123456789.com');
        console.log(chalk.green(`✅ Availability kontrol tamamlandı`));
        console.log(chalk.gray(`   Domain: ${result.domain}`));
        console.log(chalk.gray(`   Durum: ${result.availability}`));
        console.log(chalk.gray(`   DNS A kaydı: ${result.hasARecord ? 'Var' : 'Yok'}`));
        console.log(chalk.gray(`   DNS NS kaydı: ${result.hasNSRecord ? 'Var' : 'Yok'}`));
        console.log(chalk.gray(`   Yanıt süresi: ${result.responseTime}ms`));
    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();

    // Test 7: Domain generator testi
    console.log(chalk.yellow('Test 7: Domain generator'));
    try {
        const generator = new DomainGenerator();

        console.log(chalk.gray('   Türkçe domain üretiliyor...'));
        const turkishDomain = generator.generateDomain('turkish');
        console.log(chalk.green(`   ✅ Türkçe: ${turkishDomain}`));

        console.log(chalk.gray('   İngilizce domain üretiliyor...'));
        const englishDomain = generator.generateDomain('english');
        console.log(chalk.green(`   ✅ İngilizce: ${englishDomain}`));

        console.log(chalk.gray('   Kategorik domainler üretiliyor...'));
        const oneLetterDomains = generator.generateCategorizedDomains('one-letter', 3);
        console.log(chalk.green(`   ✅ Tek harf: ${oneLetterDomains.join(', ')}`));

        const techDomains = generator.generateCategorizedDomains('tech', 2);
        console.log(chalk.green(`   ✅ Tech: ${techDomains.join(', ')}`));

        const businessDomains = generator.generateCategorizedDomains('business', 2);
        console.log(chalk.green(`   ✅ Business: ${businessDomains.join(', ')}`));

    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();

    // Test 8: Domain pattern testi
    console.log(chalk.yellow('Test 8: Domain pattern çeşitliliği'));
    try {
        const generator = new DomainGenerator();

        console.log(chalk.gray('   Farklı patternler test ediliyor...'));

        for (let i = 0; i < 5; i++) {
            const mixedDomain = generator.generateDomain('mixed');
            console.log(chalk.cyan(`   🎲 ${i + 1}: ${mixedDomain}`));
        }

    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();

    // Test 9: Dosya organizasyonu testi
    console.log(chalk.yellow('Test 9: Dosya organizasyonu testi'));
    try {
        const generator = new DomainGenerator();
        const fs = require('fs');
        const path = require('path');

        // Test domain kaydetme
        console.log(chalk.gray('   Test domain dosyaya kaydediliyor...'));
        const testResult = {
            availability: 'available',
            registrar: 'Test Registrar'
        };

        await generator.saveAvailableDomain('testdomain123', '.com', 'test-category', testResult);

        // Dosya varlığını kontrol et
        const resultsDir = 'domain-results';
        const testFile = path.join(resultsDir, 'test-category-domains.txt');

        if (fs.existsSync(testFile)) {
            console.log(chalk.green('✅ Dosya başarıyla oluşturuldu: ' + testFile));

            // Dosya içeriğini kontrol et
            const content = await fs.promises.readFile(testFile, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            console.log(chalk.gray(`   📄 Dosyada ${lines.length} kayıt bulundu`));

            if (lines.length > 0) {
                console.log(chalk.gray(`   💾 Son kayıt: ${lines[lines.length - 1].substring(0, 50)}...`));
            }
        } else {
            console.log(chalk.red('❌ Dosya oluşturulamadı'));
        }

    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();

    // Test 10: Gerçek availability kontrolü
    console.log(chalk.yellow('Test 10: Gerçek availability kontrolü'));
    try {
        console.log(chalk.gray('   Google domain kontrol ediliyor...'));
        const googleResult = await checker.checkDomainAvailability('google.com');
        console.log(chalk.gray(`   Google.com: ${googleResult.availability} (${googleResult.responseTime}ms)`));

        console.log(chalk.gray('   Rastgele test domain kontrol ediliyor...'));
        const generator = new DomainGenerator();
        const testDomain = generator.generateDomain('english') + '.com';
        const testResult = await checker.checkDomainAvailability(testDomain);
        console.log(chalk.gray(`   ${testDomain}: ${testResult.availability} (${testResult.responseTime}ms)`));

    } catch (error) {
        console.log(chalk.red('❌ Test hatası:'), error.message);
    }

    console.log();
    console.log(chalk.green('🎉 Tüm testler tamamlandı!'));
    console.log(chalk.blue('💡 Domain hunting başlatmak için: node index.js hunt'));
    console.log(chalk.blue('📊 İstatistikleri görmek için: node index.js hunt-stats'));
    console.log(chalk.blue('📁 Sonuçlar domain-results/ klasöründe kategorilere göre saklanır'));
}

if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = runTests;
