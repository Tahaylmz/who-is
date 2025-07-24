#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const Table = require('cli-table3');
const SiteChecker = require('./checker');

const program = new Command();

program
  .name('who-is')
  .description('Çok hızlı web sitesi durum kontrol sistemi')
  .version('1.0.0');

// Tek site kontrolü
program
  .command('check <url>')
  .description('Tek bir sitenin durumunu kontrol eder')
  .option('-t, --timeout <ms>', 'Zaman aşımı süresi (milisaniye)', '5000')
  .action(async (url, options) => {
    const checker = new SiteChecker({ timeout: parseInt(options.timeout) });
    
    console.log(chalk.blue(`🔍 ${url} kontrol ediliyor...`));
    
    const result = await checker.checkSite(url);
    displaySingleResult(result);
  });

// Çoklu site kontrolü
program
  .command('check-list <file>')
  .description('Dosyadan okunan sitelerin durumunu kontrol eder')
  .option('-c, --concurrency <num>', 'Eş zamanlı istek sayısı', '10')
  .option('-t, --timeout <ms>', 'Zaman aşımı süresi (milisaniye)', '5000')
  .action(async (file, options) => {
    const fs = require('fs');
    
    try {
      const urls = fs.readFileSync(file, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      if (urls.length === 0) {
        console.log(chalk.red('❌ Dosyada geçerli URL bulunamadı'));
        return;
      }

      const checker = new SiteChecker({ timeout: parseInt(options.timeout) });
      
      console.log(chalk.blue(`🔍 ${urls.length} site kontrol ediliyor...`));
      
      const results = await checker.checkMultipleSites(urls, parseInt(options.concurrency));
      displayMultipleResults(results);
      
    } catch (error) {
      console.log(chalk.red(`❌ Dosya okuma hatası: ${error.message}`));
    }
  });

// İzleme modu
program
  .command('monitor <file>')
  .description('Siteleri sürekli izler')
  .option('-i, --interval <seconds>', 'Kontrol aralığı (saniye)', '60')
  .option('-c, --concurrency <num>', 'Eş zamanlı istek sayısı', '10')
  .option('-t, --timeout <ms>', 'Zaman aşımı süresi (milisaniye)', '5000')
  .action(async (file, options) => {
    const fs = require('fs');
    
    try {
      const urls = fs.readFileSync(file, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      if (urls.length === 0) {
        console.log(chalk.red('❌ Dosyada geçerli URL bulunamadı'));
        return;
      }

      const checker = new SiteChecker({ timeout: parseInt(options.timeout) });
      const interval = parseInt(options.interval) * 1000;
      
      console.log(chalk.green(`📊 ${urls.length} site için izleme başlatıldı (${options.interval}s aralıklarla)`));
      console.log(chalk.gray('Durdurmak için Ctrl+C basın\n'));
      
      checker.startMonitoring(urls, interval, (results) => {
        console.clear();
        console.log(chalk.green(`📊 Son kontrol: ${new Date().toLocaleString('tr-TR')}\n`));
        displayMultipleResults(results);
      });
      
    } catch (error) {
      console.log(chalk.red(`❌ Dosya okuma hatası: ${error.message}`));
    }
  });

// Hızlı test komutu
program
  .command('quick <urls...>')
  .description('Birden fazla URL\'yi hızlıca test eder')
  .option('-t, --timeout <ms>', 'Zaman aşımı süresi (milisaniye)', '3000')
  .action(async (urls, options) => {
    const checker = new SiteChecker({ timeout: parseInt(options.timeout) });
    
    console.log(chalk.blue(`🚀 ${urls.length} site hızlı kontrol ediliyor...`));
    
    const results = await checker.checkMultipleSites(urls);
    displayMultipleResults(results);
  });

// Domain uzantı kontrolü
program
  .command('check-domain <domain>')
  .description('Bir domain için farklı uzantıları kontrol eder (.com, .com.tr, .net)')
  .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', '.com,.com.tr,.net')
  .option('-t, --timeout <ms>', 'Zaman aşımı süresi (milisaniye)', '5000')
  .action(async (domain, options) => {
    const checker = new SiteChecker({ timeout: parseInt(options.timeout) });
    const extensions = options.extensions.split(',').map(ext => ext.trim());
    
    console.log(chalk.blue(`🔍 ${domain} için ${extensions.length} uzantı kontrol ediliyor...`));
    
    const results = await checker.checkDomainExtensions(domain, extensions);
    displayDomainResults(domain, results);
  });

// Domain availability kontrolü
program
  .command('check-availability <domain>')
  .description('Bir domain için farklı uzantıların satın alınıp alınmadığını kontrol eder')
  .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', '.com,.com.tr,.net')
  .action(async (domain, options) => {
    const checker = new SiteChecker();
    const extensions = options.extensions.split(',').map(ext => ext.trim());
    
    console.log(chalk.blue(`🔍 ${domain} için ${extensions.length} uzantının availability durumu kontrol ediliyor...`));
    
    const results = await checker.checkDomainAvailabilityWithExtensions(domain, extensions);
    displayAvailabilityResults(domain, results);
  });

// Çoklu domain availability kontrolü
program
  .command('find-available <domains...>')
  .description('Birden fazla domain için müsait olanları bulur')
  .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', '.com,.com.tr,.net')
  .action(async (domains, options) => {
    const checker = new SiteChecker();
    const extensions = options.extensions.split(',').map(ext => ext.trim());
    
    console.log(chalk.blue(`🚀 ${domains.length} domain için müsait uzantılar aranıyor...`));
    
    const allResults = {};
    
    for (const domain of domains) {
      console.log(chalk.gray(`\n📍 ${domain} kontrol ediliyor...`));
      try {
        const results = await checker.checkDomainAvailabilityWithExtensions(domain, extensions);
        allResults[domain] = results;
      } catch (error) {
        console.error(chalk.red(`❌ ${domain} için hata: ${error.message}`));
        allResults[domain] = [];
      }
    }
    
    displayMultipleAvailabilityResults(allResults);
  });

// Çoklu domain uzantı kontrolü
program
  .command('check-domains <domains...>')
  .description('Birden fazla domain için farklı uzantıları kontrol eder')
  .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', '.com,.com.tr,.net')
  .option('-t, --timeout <ms>', 'Zaman aşımı süresi (milisaniye)', '5000')
  .action(async (domains, options) => {
    const checker = new SiteChecker({ timeout: parseInt(options.timeout) });
    const extensions = options.extensions.split(',').map(ext => ext.trim());
    
    console.log(chalk.blue(`🚀 ${domains.length} domain için ${extensions.length} uzantı kontrol ediliyor...`));
    
    const results = await checker.checkMultipleDomainsWithExtensions(domains, extensions);
    displayMultipleDomainResults(results);
  });

// Tek sonuç görüntüleme
function displaySingleResult(result) {
  console.log('\n' + '='.repeat(60));
  
  if (result.status === 'online') {
    console.log(chalk.green(`✅ ${result.url} - ÇEVRIMIÇI`));
    console.log(chalk.gray(`   Status: ${result.statusCode} ${result.statusText}`));
    console.log(chalk.gray(`   Yanıt Süresi: ${result.responseTime}ms`));
    console.log(chalk.gray(`   Server: ${result.server}`));
    if (result.contentLength) {
      console.log(chalk.gray(`   İçerik Boyutu: ${result.contentLength} bytes`));
    }
  } else {
    console.log(chalk.red(`❌ ${result.url} - ÇEVRIMDıŞı`));
    console.log(chalk.gray(`   Hata: ${result.error}`));
    console.log(chalk.gray(`   Yanıt Süresi: ${result.responseTime}ms`));
  }
  
  console.log('='.repeat(60) + '\n');
}

// Çoklu sonuç görüntüleme
function displayMultipleResults(results) {
  const table = new Table({
    head: ['Site', 'Durum', 'Status', 'Yanıt (ms)', 'Server'],
    colWidths: [35, 12, 8, 12, 20]
  });

  let onlineCount = 0;
  let offlineCount = 0;

  results.forEach(result => {
    const url = result.url.length > 32 ? result.url.substring(0, 29) + '...' : result.url;
    
    if (result.status === 'online') {
      onlineCount++;
      const statusColor = result.isHealthy ? chalk.green : chalk.yellow;
      table.push([
        url,
        chalk.green('✅ Online'),
        statusColor(result.statusCode),
        chalk.blue(result.responseTime),
        result.server || 'Unknown'
      ]);
    } else {
      offlineCount++;
      table.push([
        url,
        chalk.red('❌ Offline'),
        chalk.red('-'),
        chalk.red(result.responseTime),
        chalk.gray(result.error.substring(0, 17))
      ]);
    }
  });

  console.log(table.toString());
  
  // Özet bilgiler
  console.log('\n' + '='.repeat(60));
  console.log(chalk.green(`✅ Çevrimiçi: ${onlineCount}`));
  console.log(chalk.red(`❌ Çevrimdışı: ${offlineCount}`));
  console.log(chalk.blue(`📊 Toplam: ${results.length}`));
  console.log(chalk.gray(`🕒 Son kontrol: ${new Date().toLocaleString('tr-TR')}`));
  console.log('='.repeat(60) + '\n');
}

// Domain uzantı sonuçlarını görüntüleme
function displayDomainResults(domain, results) {
  console.log('\n' + '='.repeat(60));
  console.log(chalk.blue(`🌐 ${domain} için uzantı kontrolü sonuçları:`));
  console.log('='.repeat(60));

  const table = new Table({
    head: ['Uzantı', 'Durum', 'Status', 'Yanıt (ms)', 'Server'],
    colWidths: [25, 12, 8, 12, 20]
  });

  let onlineCount = 0;
  let offlineCount = 0;

  results.forEach(result => {
    const extension = result.url.replace('https://', '').replace(domain, '');
    
    if (result.status === 'online') {
      onlineCount++;
      const statusColor = result.isHealthy ? chalk.green : chalk.yellow;
      table.push([
        chalk.cyan(domain + extension),
        chalk.green('✅ Erişilebilir'),
        statusColor(result.statusCode),
        chalk.blue(result.responseTime),
        result.server || 'Unknown'
      ]);
    } else {
      offlineCount++;
      table.push([
        chalk.gray(domain + extension),
        chalk.red('❌ Erişilemiyor'),
        chalk.red('-'),
        chalk.red(result.responseTime),
        chalk.gray(result.error.substring(0, 17))
      ]);
    }
  });

  console.log(table.toString());
  
  // Öneriler
  if (onlineCount > 0) {
    const bestResult = results.find(r => r.status === 'online');
    console.log(chalk.green(`🎯 Önerilen: ${bestResult.url} (${bestResult.responseTime}ms)`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(chalk.green(`✅ Erişilebilir: ${onlineCount}`));
  console.log(chalk.red(`❌ Erişilemiyor: ${offlineCount}`));
  console.log(chalk.blue(`📊 Toplam kontrol: ${results.length}`));
  console.log('='.repeat(60) + '\n');
}

// Domain availability sonuçlarını görüntüleme
function displayAvailabilityResults(domain, results) {
  console.log('\n' + '='.repeat(70));
  console.log(chalk.blue(`🌐 ${domain} için domain availability sonuçları:`));
  console.log('='.repeat(70));

  const table = new Table({
    head: ['Domain', 'Durum', 'DNS A', 'DNS NS', 'Registrar', 'Yanıt (ms)'],
    colWidths: [20, 12, 8, 8, 20, 12]
  });

  let availableCount = 0;
  let takenCount = 0;
  const availableDomains = [];

  results.forEach(result => {
    let statusDisplay = '';
    let domainDisplay = '';

    if (result.availability === 'available') {
      availableCount++;
      availableDomains.push(result.domain);
      statusDisplay = chalk.green('✅ MÜSAİT');
      domainDisplay = chalk.green(result.domain);
    } else if (result.availability === 'taken') {
      takenCount++;
      statusDisplay = chalk.red('❌ ALINMIŞ');
      domainDisplay = chalk.gray(result.domain);
    } else {
      statusDisplay = chalk.yellow('❓ BİLİNMİYOR');
      domainDisplay = chalk.yellow(result.domain);
    }

    const aRecord = result.hasARecord ? chalk.green('✓') : chalk.red('✗');
    const nsRecord = result.hasNSRecord ? chalk.green('✓') : chalk.red('✗');
    const registrar = result.registrar ? result.registrar.substring(0, 17) : chalk.gray('-');

    table.push([
      domainDisplay,
      statusDisplay,
      aRecord,
      nsRecord,
      registrar,
      chalk.blue(result.responseTime)
    ]);
  });

  console.log(table.toString());
  
  // Müsait domain önerileri
  if (availableDomains.length > 0) {
    console.log(chalk.green('\n🎉 MÜSAİT DOMAIN\'LER:'));
    availableDomains.forEach(domain => {
      console.log(chalk.green(`   ✅ ${domain}`));
    });
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(chalk.green(`✅ Müsait: ${availableCount}`));
  console.log(chalk.red(`❌ Alınmış: ${takenCount}`));
  console.log(chalk.blue(`📊 Toplam kontrol: ${results.length}`));
  console.log('='.repeat(70) + '\n');
}

// Çoklu domain availability sonuçlarını görüntüleme
function displayMultipleAvailabilityResults(results) {
  console.log('\n' + '='.repeat(80));
  console.log(chalk.blue('🌍 Domain Availability Kontrol Sonuçları'));
  console.log('='.repeat(80));

  let totalAvailable = 0;
  let totalTaken = 0;
  const allAvailableDomains = [];

  Object.keys(results).forEach(domain => {
    const domainResults = results[domain];
    if (domainResults.length === 0) return;

    console.log(chalk.yellow(`\n📍 ${domain.toUpperCase()}:`));
    
    const table = new Table({
      head: ['Domain', 'Durum', 'Registrar'],
      colWidths: [25, 15, 25]
    });

    const availableForDomain = [];

    domainResults.forEach(result => {
      if (result.availability === 'available') {
        totalAvailable++;
        availableForDomain.push(result.domain);
        allAvailableDomains.push(result.domain);
        table.push([
          chalk.green(result.domain),
          chalk.green('✅ MÜSAİT'),
          chalk.gray('-')
        ]);
      } else if (result.availability === 'taken') {
        totalTaken++;
        table.push([
          chalk.gray(result.domain),
          chalk.red('❌ ALINMIŞ'),
          result.registrar ? result.registrar.substring(0, 22) : chalk.gray('-')
        ]);
      } else {
        table.push([
          chalk.yellow(result.domain),
          chalk.yellow('❓ BİLİNMİYOR'),
          chalk.gray('-')
        ]);
      }
    });

    console.log(table.toString());
    
    if (availableForDomain.length > 0) {
      console.log(chalk.green(`   🎯 ${domain} için müsait: ${availableForDomain.join(', ')}`));
    } else {
      console.log(chalk.red(`   ❌ ${domain} için müsait uzantı yok`));
    }
  });

  // Genel özet ve öneriler
  console.log('\n' + '='.repeat(80));
  console.log(chalk.blue('📋 GENEL ÖZET:'));
  console.log('='.repeat(80));
  
  if (allAvailableDomains.length > 0) {
    console.log(chalk.green('\n🎉 TÜM MÜSAİT DOMAIN\'LER:'));
    allAvailableDomains.forEach(domain => {
      console.log(chalk.green(`   ✅ ${domain} - HEMEN ALINABİLİR!`));
    });
  } else {
    console.log(chalk.red('\n😞 Maalesef hiçbir domain müsait değil.'));
    console.log(chalk.yellow('💡 Farklı isimler veya uzantılar deneyebilirsiniz.'));
  }

  console.log('\n' + '='.repeat(80));
  console.log(chalk.green(`✅ Toplam müsait: ${totalAvailable}`));
  console.log(chalk.red(`❌ Toplam alınmış: ${totalTaken}`));
  console.log(chalk.blue(`📊 Toplam kontrol: ${totalAvailable + totalTaken}`));
  console.log(chalk.gray(`🕒 Kontrol zamanı: ${new Date().toLocaleString('tr-TR')}`));
  console.log('='.repeat(80) + '\n');
}

// Program başlat
if (require.main === module) {
  program.parse();
}

module.exports = program;
