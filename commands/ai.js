const chalk = require('chalk');
const AIDomainGenerator = require('../aiDomainGenerator');
const SiteChecker = require('../checker');
const ExtensionConfig = require('../utils/extensionConfig');

// AI destekli domain analizi ve önerileri
function setupAICommand(program) {
    program
        .command('ai-suggest')
        .description('🤖 AI beyin fırtınası - Sektör odaklı yaratıcı domain önerileri üretir')
        .option('-s, --sector <sector>', 'Sektör seçin (tech,business,creative,health,ecommerce,premium,startup)', 'tech')
        .option('-c, --count <num>', 'Üretilecek domain sayısı', '10')
        .option('--check', 'Üretilen domain\'lerin müsaitlik durumunu kontrol et', false)
        .option('--save', 'Sonuçları dosyaya kaydet', false)
        .option('--analyze', 'Detaylı kalite analizi yap', false)
        .action(async (options) => {
            const generator = new AIDomainGenerator();
            const checker = new SiteChecker();
            const config = new ExtensionConfig();

            const sector = options.sector;
            const count = parseInt(options.count);
            const shouldCheck = options.check;
            const shouldSave = options.save;
            const shouldAnalyze = options.analyze;

            console.log(chalk.green('🤖 AI DOMAIN ÖNERİLERİ ÜRETİLİYOR...\n'));
            console.log(chalk.blue(`🎯 Sektör: ${sector}`));
            console.log(chalk.blue(`📊 Domain Sayısı: ${count}`));
            console.log(chalk.blue(`🔍 Müsaitlik Kontrolü: ${shouldCheck ? 'Evet' : 'Hayır'}`));
            console.log(chalk.blue(`💾 Dosyaya Kaydet: ${shouldSave ? 'Evet' : 'Hayır'}`));
            console.log(chalk.blue(`📈 Detaylı Analiz: ${shouldAnalyze ? 'Evet' : 'Hayır'}\n`));

            try {
                // AI domain'leri üret
                console.log(chalk.yellow('🎨 Domainler üretiliyor...'));
                const domains = await generator.generateAIDomains(sector, count);

                if (domains.length === 0) {
                    console.log(chalk.red('❌ Domain üretilemedi!'));
                    return;
                }

                console.log(chalk.green(`✅ ${domains.length} domain üretildi!\n`));

                const results = [];
                const extensions = config.getActiveExtensions();

                // Her domain için işlem
                for (let i = 0; i < domains.length; i++) {
                    const domain = domains[i];
                    const quality = shouldAnalyze
                        ? generator.evaluateAdvancedDomainQuality(domain)
                        : generator.evaluateDomainQuality(domain);

                    const estimatedValue = shouldAnalyze ? generator.estimateDomainValue(domain) : null;

                    console.log(chalk.cyan(`\n${i + 1}. ${domain}`));
                    console.log(chalk.gray(`   📊 Kalite Puanı: ${quality}/100`));

                    if (shouldAnalyze) {
                        console.log(chalk.gray(`   💰 Tahmini Değer: $${estimatedValue}`));
                        console.log(chalk.gray(`   🎯 Marka Değeri: ${generator.isBrandable(domain) ? '✅' : '❌'}`));
                        console.log(chalk.gray(`   🔤 SEO Uygun: ${generator.isSEOFriendly(domain) ? '✅' : '❌'}`));
                        console.log(chalk.gray(`   🗣️  Telaffuz: ${generator.isPronounceable(domain) ? '✅' : '❌'}`));
                        console.log(chalk.gray(`   ⭐ Benzersiz: ${generator.isUnique(domain) ? '✅' : '❌'}`));
                    }

                    const domainResults = {
                        domain,
                        quality,
                        estimatedValue,
                        extensions: {}
                    };

                    if (shouldCheck) {
                        console.log(chalk.yellow(`   🔍 Müsaitlik kontrol ediliyor...`));

                        for (const extension of extensions) {
                            const fullDomain = domain + extension;

                            try {
                                const result = await checker.checkDomainAvailability(fullDomain);
                                const isAvailable = result.availability === 'available';

                                domainResults.extensions[extension] = {
                                    available: isAvailable,
                                    registrar: result.registrar || 'None'
                                };

                                const status = isAvailable ? chalk.green('✅ MÜSAİT') : chalk.red('❌ ALINMIŞ');
                                console.log(chalk.gray(`   ${extension}: ${status}`));

                                if (shouldSave && isAvailable) {
                                    await generator.saveAvailableDomain(domain, extension, `ai-${sector}`, result);
                                }

                                // Rate limiting
                                await new Promise(resolve => setTimeout(resolve, 500));
                            } catch (error) {
                                console.log(chalk.gray(`   ${extension}: ${chalk.yellow('⚠️  KONTROL EDİLEMEDİ')}`));
                                domainResults.extensions[extension] = { available: false, error: error.message };
                            }
                        }
                    }

                    results.push(domainResults);
                }

                // Özet rapor
                console.log(chalk.green('\n📋 ÖZET RAPOR:'));
                console.log(chalk.gray('='.repeat(50)));

                const avgQuality = results.reduce((sum, r) => sum + r.quality, 0) / results.length;
                console.log(chalk.blue(`📊 Ortalama Kalite: ${avgQuality.toFixed(1)}/100`));

                if (shouldAnalyze) {
                    const avgValue = results.reduce((sum, r) => sum + (r.estimatedValue || 0), 0) / results.length;
                    console.log(chalk.blue(`💰 Ortalama Tahmini Değer: $${Math.round(avgValue)}`));

                    const topDomains = results
                        .sort((a, b) => b.quality - a.quality)
                        .slice(0, 3);

                    console.log(chalk.yellow('\n🏆 EN İYİ 3 DOMAIN:'));
                    topDomains.forEach((domain, index) => {
                        console.log(chalk.cyan(`${index + 1}. ${domain.domain} (${domain.quality}/100)`));
                    });
                }

                if (shouldCheck) {
                    const totalAvailable = results.reduce((sum, r) => {
                        return sum + Object.values(r.extensions).filter(ext => ext.available).length;
                    }, 0);

                    const totalChecked = results.length * extensions.length;
                    const availabilityRate = (totalAvailable / totalChecked * 100).toFixed(1);

                    console.log(chalk.green(`✅ Müsait Domain: ${totalAvailable}/${totalChecked} (%${availabilityRate})`));
                }

                if (shouldSave) {
                    const stats = generator.getStats();
                    console.log(chalk.green('\n💾 DOSYA İSTATİSTİKLERİ:'));
                    for (const [fileName, data] of Object.entries(stats)) {
                        console.log(chalk.cyan(`📁 ${fileName}: ${data.available} müsait domain kaydedildi`));
                    }
                }

                console.log(chalk.gray('\n✨ AI analizi tamamlandı!'));

            } catch (error) {
                console.error(chalk.red(`❌ Hata: ${error.message}`));
            }
        });

    program
        .command('ai-batch')
        .description('Birden fazla sektör için AI domain batch üretimi')
        .option('-s, --sectors <sectors>', 'Sektörler (virgülle ayırın)', 'tech,business,creative')
        .option('-c, --count <num>', 'Sektör başına domain sayısı', '5')
        .option('--save', 'Sonuçları dosyalara kaydet', false)
        .action(async (options) => {
            const generator = new AIDomainGenerator();
            const sectors = options.sectors.split(',').map(s => s.trim());
            const count = parseInt(options.count);
            const shouldSave = options.save;

            console.log(chalk.green('🚀 AI BATCH DOMAIN ÜRETİMİ BAŞLATILIYOR...\n'));
            console.log(chalk.blue(`🎯 Sektörler: ${sectors.join(', ')}`));
            console.log(chalk.blue(`📊 Sektör Başına: ${count} domain\n`));

            try {
                const results = await generator.generateBatchAIDomains(sectors, count);

                console.log(chalk.green('\n📋 BATCH SONUÇLARI:'));
                console.log(chalk.gray('='.repeat(60)));

                for (const [sector, domains] of Object.entries(results)) {
                    console.log(chalk.cyan(`\n🎯 ${sector.toUpperCase()} SEKTÖRÜ:`));

                    if (domains.length === 0) {
                        console.log(chalk.red('   ❌ Domain üretilemedi'));
                        continue;
                    }

                    domains.forEach((domainData, index) => {
                        console.log(chalk.gray(`   ${index + 1}. ${domainData.domain} (Q:${domainData.quality}/100)`));
                    });

                    const avgQuality = domains.reduce((sum, d) => sum + d.quality, 0) / domains.length;
                    console.log(chalk.blue(`   📊 Ortalama Kalite: ${avgQuality.toFixed(1)}/100`));

                    if (shouldSave) {
                        // Batch sonuçlarını dosyaya kaydet
                        const fs = require('fs');
                        const path = require('path');

                        const resultsDir = 'domain-results';
                        if (!fs.existsSync(resultsDir)) {
                            fs.mkdirSync(resultsDir, { recursive: true });
                        }

                        const fileName = path.join(resultsDir, `ai-batch-${sector}.txt`);
                        const timestamp = new Date().toISOString();

                        let content = `# AI Batch Sonuçları - ${sector} Sektörü\n`;
                        content += `# Üretim Tarihi: ${timestamp}\n`;
                        content += `# Toplam Domain: ${domains.length}\n`;
                        content += `# Ortalama Kalite: ${avgQuality.toFixed(1)}/100\n\n`;

                        domains.forEach((domainData, index) => {
                            content += `${index + 1}. ${domainData.domain} | Kalite: ${domainData.quality}/100 | Strateji: ${domainData.strategy}\n`;
                        });

                        fs.writeFileSync(fileName, content);
                        console.log(chalk.green(`   💾 ${fileName} dosyasına kaydedildi`));
                    }
                }

                const totalDomains = Object.values(results).reduce((sum, domains) => sum + domains.length, 0);
                console.log(chalk.green(`\n✅ Toplam ${totalDomains} AI domain başarıyla üretildi!`));

            } catch (error) {
                console.error(chalk.red(`❌ Batch üretimi hatası: ${error.message}`));
            }
        });
}

module.exports = { setupAICommand };
