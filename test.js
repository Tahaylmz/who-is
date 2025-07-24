const SiteChecker = require('./checker');
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

  // Test 6: Domain availability testi
  console.log(chalk.yellow('Test 6: Domain availability kontrolü'));
  try {
    console.log(chalk.gray('   Test domain availability kontrol ediliyor...'));
    const result = await checker.checkDomainAvailability('testdomain123456789.com');
    console.log(chalk.green(`✅ Availability kontrol tamamlandı`));
    console.log(chalk.gray(`   Durum: ${result.availability}`));
    console.log(chalk.gray(`   DNS A kaydı: ${result.hasARecord ? 'Var' : 'Yok'}`));
    console.log(chalk.gray(`   DNS NS kaydı: ${result.hasNSRecord ? 'Var' : 'Yok'}`));
  } catch (error) {
    console.log(chalk.red('❌ Test hatası:'), error.message);
  }

  console.log();
  console.log(chalk.green('🎉 Tüm testler tamamlandı!'));
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = runTests;
