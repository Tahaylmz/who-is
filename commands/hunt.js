const chalk = require('chalk');
const DomainGenerator = require('../domain-generator');
const AIDomainGenerator = require('../aiDomainGenerator');
const SiteChecker = require('../checker');
const ExtensionConfig = require('../utils/extensionConfig');

// Domain hunting - sürekli rastgele domain arama
function setupHuntCommand(program) {
    program
        .command('hunt')
        .description('Sürekli rastgele domain üretip müsait olanları arar ve dosyaya kaydeder')
        .option('-c, --categories <cats>', 'Aranacak kategoriler (virgülle ayırın)', 'premium,tech,business,creative,health,ecommerce,short,numbers')
        .option('-s, --sector <sector>', 'Belirli sektör için akıllı domain üretimi (tech,business,creative,health,ecommerce)', null)
        .option('--ai', 'Yapay zeka destekli domain üretimi kullan', false)
        .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', null)
        .option('-i, --interval <ms>', 'Kontroller arası bekleme süresi (milisaniye)', '2000')
        .option('-l, --limit <num>', 'Maksimum domain sayısı (0=sınırsız)', '0')
        .option('--stats-interval <sec>', 'İstatistik gösterme aralığı (saniye)', '30')
        .action(async (options) => {
            const generator = options.ai ? new AIDomainGenerator() : new DomainGenerator();
            const checker = new SiteChecker();
            const config = new ExtensionConfig();

            const categories = options.categories.split(',').map(c => c.trim());
            const sector = options.sector;
            const useAI = options.ai;

            // Uzantıları belirle: parametre > konfigürasyon
            const extensions = options.extensions
                ? options.extensions.split(',').map(e => e.trim())
                : config.getActiveExtensions();

            const interval = parseInt(options.interval);
            const limit = parseInt(options.limit);
            const statsInterval = parseInt(options.statsInterval) * 1000;

            console.log(chalk.green(`🚀 ${useAI ? 'AI DESTEKLI' : 'AKILLI'} DOMAIN HUNTING BAŞLATILIYOR...`));
            console.log(chalk.blue(`📋 Kategoriler: ${categories.join(', ')}`));
            if (sector) {
                console.log(chalk.yellow(`🎯 Sektör Odaklı: ${sector}`));
            }
            if (useAI) {
                console.log(chalk.magenta(`🤖 AI Generator: ${generator.useAI ? 'OpenAI API' : 'Yerel AI Algoritması'}`));
            }
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
                    if (data.avgQuality !== 'N/A') {
                        console.log(chalk.magenta(`   🎯 Ortalama Kalite: ${data.avgQuality}`));
                    }
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
                    let domain;
                    let category;

                    if (sector) {
                        // Sektör odaklı akıllı domain üretimi
                        if (useAI && generator.generateAIDomains) {
                            const aiDomains = await generator.generateAIDomains(sector, 1);
                            domain = aiDomains[0];
                        } else {
                            domain = generator.generateSmartDomain(sector, 'professional');
                        }
                        category = sector;
                    } else {
                        // Rastgele kategori seç
                        category = categories[Math.floor(Math.random() * categories.length)];

                        // Domain üret (AI veya standart)
                        const domains = await generator.generateCategorizedDomains(category, 1);
                        domain = domains[0];
                    }

                    // Her uzantı için kontrol et
                    for (const extension of extensions) {
                        if (!isRunning) break;

                        const fullDomain = domain + extension;

                        // Kalite puanını hesapla
                        const quality = generator.evaluateDomainQuality(domain);

                        // Progress göster (kalite puanı ile)
                        process.stdout.write(chalk.gray(`🔍 ${fullDomain} (Q:${quality}/100) kontrol ediliyor... `));

                        try {
                            const result = await checker.checkDomainAvailability(fullDomain);
                            totalChecked++;

                            if (result.availability === 'available') {
                                totalFound++;
                                console.log(chalk.green(`✅ MÜSAİT! 🎯 Kalite: ${quality}/100`));

                                // Dosyaya kaydet
                                await generator.saveAvailableDomain(domain, extension, category, result);

                                console.log(chalk.cyan(`💾 ${category}-domains.txt dosyasına kaydedildi`));
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
}

// Domain hunting istatistikleri
function setupHuntStatsCommand(program) {
    program
        .command('hunt-stats')
        .description('Domain hunting sonuçlarının istatistiklerini gösterir')
        .action(async () => {
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
}

// Domain hunting sonuçlarını temizle
function setupHuntClearCommand(program) {
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
}

module.exports = {
    setupHuntCommand,
    setupHuntStatsCommand,
    setupHuntClearCommand
};
