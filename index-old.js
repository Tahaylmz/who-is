#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const Table = require('cli-table3');
const SiteChecker = require('./checker');
const DomainGenerator = require('./domain-generator');

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

// Domain hunting - sürekli rastgele domain arama
program
  .command('hunt')
  .description('Sürekli rastgele domain üretip müsait olanları arar ve dosyaya kaydeder')
  .option('-c, --categories <cats>', 'Aranacak kategoriler (virgülle ayırın)', 'one-letter,two-letter,three-letter,turkish,english,tech,business')
  .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', '.com,.com.tr,.net')
  .option('-i, --interval <ms>', 'Kontroller arası bekleme süresi (milisaniye)', '2000')
  .option('-l, --limit <num>', 'Maksimum domain sayısı (0=sınırsız)', '0')
  .option('--stats-interval <sec>', 'İstatistik gösterme aralığı (saniye)', '30')
  .action(async (options) => {
    const generator = new DomainGenerator();
    const checker = new SiteChecker();
    
    const categories = options.categories.split(',').map(c => c.trim());
    const extensions = options.extensions.split(',').map(e => e.trim());
    const interval = parseInt(options.interval);
    const limit = parseInt(options.limit);
    const statsInterval = parseInt(options.statsInterval) * 1000;

    console.log(chalk.green('🚀 DOMAIN HUNTING BAŞLATILIYOR...'));
    console.log(chalk.blue(`📋 Kategoriler: ${categories.join(', ')}`));
    console.log(chalk.blue(`🌐 Uzantılar: ${extensions.join(', ')}`));
    console.log(chalk.blue(`⏱️  Interval: ${interval}ms`));
    console.log(chalk.blue(`🎯 Limit: ${limit === 0 ? 'Sınırsız' : limit}`));
    console.log(chalk.gray('Durdurmak için Ctrl+C basın\n'));

    let totalChecked = 0;
    let totalFound = 0;
    let isRunning = true;

    // İstatistik gösterimi
    const statsTimer = setInterval(() => {
      if (!isRunning) return;
      
      console.log(chalk.yellow('\n📊 GÜNCEL İSTATİSTİKLER:'));
      console.log(chalk.gray('='.repeat(50)));
      
      const stats = generator.getStats();
      for (const [fileName, data] of Object.entries(stats)) {
        console.log(chalk.cyan(`📁 ${fileName}:`));
        console.log(chalk.green(`   ✅ Müsait: ${data.available}`));
        console.log(chalk.red(`   ❌ Alınmış: ${data.taken}`));
        console.log(chalk.blue(`   📊 Toplam: ${data.total} (Başarı: ${data.successRate})`));
      }
      
      console.log(chalk.gray('='.repeat(50)));
      console.log(chalk.blue(`🔍 Toplam kontrol: ${totalChecked}`));
      console.log(chalk.green(`🎉 Toplam bulunan: ${totalFound}`));
      console.log(chalk.gray(`🕒 ${new Date().toLocaleString('tr-TR')}\n`));
    }, statsInterval);

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Domain hunting durduruluyor...'));
      isRunning = false;
      clearInterval(statsTimer);
      
      const finalStats = generator.getStats();
      console.log(chalk.green('\n🎯 FİNAL İSTATİSTİKLER:'));
      for (const [fileName, data] of Object.entries(finalStats)) {
        console.log(chalk.cyan(`📁 ${fileName}: ${data.available} müsait / ${data.total} kontrol`));
      }
      
      process.exit(0);
    });

    // Ana döngü
    while (isRunning && (limit === 0 || totalChecked < limit)) {
      try {
        // Rastgele kategori seç
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Domain üret
        const domains = generator.generateCategorizedDomains(category, 1);
        const domain = domains[0];

        // Her uzantı için kontrol et
        for (const extension of extensions) {
          if (!isRunning) break;
          
          const fullDomain = domain + extension;
          
          // Progress göster
          process.stdout.write(chalk.gray(`🔍 ${fullDomain} kontrol ediliyor... `));
          
          try {
            const result = await checker.checkDomainAvailability(fullDomain);
            totalChecked++;

            if (result.availability === 'available') {
              totalFound++;
              console.log(chalk.green(`✅ MÜSAİT!`));
              
              // Dosyaya kaydet
              await generator.saveAvailableDomain(domain, extension, category, result);
              
              console.log(chalk.cyan(`💾 ${category}-available-domains.txt dosyasına kaydedildi`));
            } else {
              console.log(chalk.red(`❌ alınmış`));
            }

            // Rate limiting
            if (interval > 0) {
              await new Promise(resolve => setTimeout(resolve, interval));
            }

          } catch (error) {
            console.log(chalk.red(`❌ hata: ${error.message}`));
          }
        }

      } catch (error) {
        console.error(chalk.red(`Genel hata: ${error.message}`));
        await new Promise(resolve => setTimeout(resolve, 5000)); // Hata durumunda 5 saniye bekle
      }
    }

    clearInterval(statsTimer);
    isRunning = false;
    
    if (limit > 0 && totalChecked >= limit) {
      console.log(chalk.green(`\n🎯 Limit (${limit}) tamamlandı!`));
    }
  });

// Domain hunting istatistikleri
program
  .command('hunt-stats')
  .description('Domain hunting sonuçlarının istatistiklerini gösterir')
  .action(async () => {
    const generator = new DomainGenerator();
    const fs = require('fs');
    const path = require('path');
    
    try {
      const resultsDir = 'domain-results';
      
      if (!fs.existsSync(resultsDir)) {
        console.log(chalk.yellow('📭 Henüz sonuç dosyası bulunamadı.'));
        console.log(chalk.gray('Domain hunting başlatmak için: node index.js hunt'));
        return;
      }

      const files = await fs.promises.readdir(resultsDir);
      const resultFiles = files.filter(file => file.endsWith('-domains.txt'));
      
      if (resultFiles.length === 0) {
        console.log(chalk.yellow('📭 Henüz sonuç dosyası bulunamadı.'));
        console.log(chalk.gray('Domain hunting başlatmak için: node index.js hunt'));
        return;
      }

      console.log(chalk.green('📊 DOMAIN HUNTING İSTATİSTİKLERİ'));
      console.log(chalk.gray('='.repeat(60)));

      let totalAvailable = 0;
      let totalChecked = 0;

      for (const file of resultFiles) {
        try {
          const filePath = path.join(resultsDir, file);
          const content = await fs.promises.readFile(filePath, 'utf8');
          const lines = content.trim().split('\n').filter(line => line);
          
          const available = lines.filter(line => line.includes('| ✅ MÜSAİT |')).length;
          const taken = lines.length - available;
          
          totalAvailable += available;
          totalChecked += lines.length;

          const category = file.replace('-domains.txt', '');
          const successRate = lines.length > 0 ? ((available / lines.length) * 100).toFixed(2) : '0';

          console.log(chalk.cyan(`\n📁 ${category.toUpperCase()}:`));
          console.log(chalk.green(`   ✅ Müsait: ${available}`));
          console.log(chalk.red(`   ❌ Alınmış: ${taken}`));
          console.log(chalk.blue(`   📊 Toplam: ${lines.length} (${successRate}% başarı)`));

          // Son 5 müsait domain'i göster
          const availableLines = lines.filter(line => line.includes('| ✅ MÜSAİT |')).slice(-5);
          if (availableLines.length > 0) {
            console.log(chalk.gray(`   📝 Son müsait domain'ler:`));
            availableLines.forEach(line => {
              const domain = line.split(' | ')[0];
              console.log(chalk.green(`      ✅ ${domain}`));
            });
          }

        } catch (error) {
          console.error(chalk.red(`${file} okuma hatası: ${error.message}`));
        }
      }

      console.log(chalk.gray('\n' + '='.repeat(60)));
      console.log(chalk.green(`🎉 TOPLAM MÜSAİT: ${totalAvailable}`));
      console.log(chalk.blue(`📊 TOPLAM KONTROL: ${totalChecked}`));
      console.log(chalk.yellow(`💡 GENEL BAŞARI ORANI: ${totalChecked > 0 ? ((totalAvailable / totalChecked) * 100).toFixed(2) : '0'}%`));
      console.log(chalk.gray(`📁 Dosya sayısı: ${resultFiles.length}`));

    } catch (error) {
      console.error(chalk.red(`İstatistik okuma hatası: ${error.message}`));
    }
  });

// Domain hunting sonuçlarını temizle
program
  .command('hunt-clear')
  .description('Domain hunting sonuç dosyalarını temizler')
  .option('-y, --yes', 'Onay sormadan sil')
  .action(async (options) => {
    const generator = new DomainGenerator();
    
    if (!options.yes) {
      console.log(chalk.yellow('⚠️  Tüm domain hunting sonuç dosyaları silinecek!'));
      console.log(chalk.gray('Emin misiniz? (y/N): '));
      
      // Basit onay için (production'da daha iyi bir readline kullanılabilir)
      process.stdout.write('Devam etmek için --yes parametresi kullanın.\n');
      return;
    }

    try {
      const deletedCount = await generator.clearResults();
      
      if (deletedCount > 0) {
        console.log(chalk.green(`✅ ${deletedCount} sonuç dosyası silindi.`));
      } else {
        console.log(chalk.yellow('📭 Silinecek dosya bulunamadı.'));
      }
    } catch (error) {
      console.error(chalk.red(`Silme hatası: ${error.message}`));
    }
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
