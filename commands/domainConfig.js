const chalk = require('chalk');
const Table = require('cli-table3');
const DomainGenerationConfig = require('../utils/domainGenerationConfig');

// Domain generation config göster
function setupDomainConfigShowCommand(program) {
    program
        .command('domain-config-show')
        .description('Domain üretim konfigürasyonunu gösterir')
        .option('--json', 'JSON formatında göster')
        .action(async (options) => {
            const config = new DomainGenerationConfig();
            const currentConfig = config.getConfig();
            const summary = config.getSummary();

            if (options.json) {
                console.log(JSON.stringify(currentConfig, null, 2));
                return;
            }

            console.log(chalk.green('🎯 DOMAIN ÜRETİM KONFİGÜRASYONU'));
            console.log(chalk.gray('='.repeat(60)));

            // Ana ayarlar
            console.log(chalk.yellow('\n📋 ANA AYARLAR:'));
            const mainTable = new Table({
                head: ['Ayar', 'Durum'],
                colWidths: [25, 30]
            });

            mainTable.push(
                ['Tire (-) Kullanımı', summary.hyphens],
                ['Sayı Kullanımı', summary.numbers],
                ['Uzunluk Aralığı', summary.lengthRange],
                ['Maks. Sayı Sayısı', currentConfig.preferredPatterns.maxNumbers]
            );

            console.log(mainTable.toString());

            // Pozisyon ayarları
            console.log(chalk.yellow('\n📍 POZİSYON AYARLARI:'));
            const positionTable = new Table({
                head: ['Özellik', 'Pozisyon'],
                colWidths: [25, 30]
            });

            positionTable.push(
                ['Tire Pozisyonu', currentConfig.preferredPatterns.hyphenPosition],
                ['Sayı Pozisyonu', currentConfig.preferredPatterns.numberPosition]
            );

            console.log(positionTable.toString());

            // Kısıtlamalar
            console.log(chalk.yellow('\n🚫 KISITLAMALAR:'));
            const restrictionTable = new Table({
                head: ['Kısıtlama', 'Durum'],
                colWidths: [30, 25]
            });

            Object.entries(currentConfig.restrictions).forEach(([key, value]) => {
                const labels = {
                    noStartWithHyphen: 'Tire ile başlama yasağı',
                    noEndWithHyphen: 'Tire ile bitme yasağı',
                    noConsecutiveHyphens: 'Ardışık tire yasağı',
                    noStartWithNumber: 'Sayı ile başlama yasağı'
                };

                restrictionTable.push([
                    labels[key] || key,
                    value ? chalk.red('✅ Aktif') : chalk.gray('❌ Pasif')
                ]);
            });

            console.log(restrictionTable.toString());

            // Kalite bonusları
            console.log(chalk.yellow('\n⭐ KALİTE BONUSLARI:'));
            const bonusTable = new Table({
                head: ['Bonus Tipi', 'Puan'],
                colWidths: [25, 15]
            });

            Object.entries(currentConfig.qualityBonus).forEach(([key, value]) => {
                const labels = {
                    noHyphens: 'Tiresiz domain',
                    noNumbers: 'Sayısız domain',
                    shortLength: 'Kısa domain',
                    pronounceable: 'Telaffuz edilebilir'
                };

                bonusTable.push([
                    labels[key] || key,
                    `+${value} puan`
                ]);
            });

            console.log(bonusTable.toString());

            // Sayı tipleri
            console.log(chalk.yellow('\n🔢 İZİNLİ SAYI TİPLERİ:'));
            const numberTypes = currentConfig.preferredPatterns.numberTypes;
            const typeDescriptions = {
                single: 'Tek haneli (1-9)',
                double: 'Çift haneli (10-99)',
                year: 'Yıl formatı (2024-2030)',
                tech: 'Teknoloji sayıları (24, 365, 3, 4, 5)'
            };

            numberTypes.forEach(type => {
                console.log(chalk.blue(`   • ${type}: ${typeDescriptions[type] || 'Bilinmiyor'}`));
            });

            console.log(chalk.gray('\n='.repeat(60)));
            console.log(chalk.green('💡 Ayarları değiştirmek için domain-config-set komutlarını kullanın'));
        });
}

// Tire kullanımını ayarla
function setupDomainConfigHyphensCommand(program) {
    program
        .command('domain-config-hyphens <allow>')
        .description('Domain üretiminde tire (-) kullanımını ayarlar (true/false)')
        .action(async (allow) => {
            const config = new DomainGenerationConfig();
            const allowHyphens = allow.toLowerCase() === 'true';

            config.setAllowHyphens(allowHyphens);

            console.log(chalk.green('✅ Tire ayarı güncellendi!'));
            console.log(chalk.blue(`🎯 Tire kullanımı: ${allowHyphens ? 'İzinli' : 'Yasaklı'}`));

            if (allowHyphens) {
                console.log(chalk.gray('💡 Tire pozisyonunu ayarlamak için: domain-config-hyphen-position <pozisyon>'));
            }
        });
}

// Sayı kullanımını ayarla
function setupDomainConfigNumbersCommand(program) {
    program
        .command('domain-config-numbers <allow>')
        .description('Domain üretiminde sayı kullanımını ayarlar (true/false)')
        .action(async (allow) => {
            const config = new DomainGenerationConfig();
            const allowNumbers = allow.toLowerCase() === 'true';

            config.setAllowNumbers(allowNumbers);

            console.log(chalk.green('✅ Sayı ayarı güncellendi!'));
            console.log(chalk.blue(`🔢 Sayı kullanımı: ${allowNumbers ? 'İzinli' : 'Yasaklı'}`));

            if (allowNumbers) {
                console.log(chalk.gray('💡 Sayı pozisyonunu ayarlamak için: domain-config-number-position <pozisyon>'));
                console.log(chalk.gray('💡 Maksimum sayı sayısı: domain-config-max-numbers <sayı>'));
            }
        });
}

// Uzunluk limitlerini ayarla
function setupDomainConfigLengthCommand(program) {
    program
        .command('domain-config-length <min> <max>')
        .description('Domain uzunluk limitlerini ayarlar')
        .action(async (min, max) => {
            const config = new DomainGenerationConfig();
            const minLength = parseInt(min);
            const maxLength = parseInt(max);

            if (isNaN(minLength) || isNaN(maxLength)) {
                console.log(chalk.red('❌ Geçersiz sayı formatı'));
                return;
            }

            if (minLength >= maxLength) {
                console.log(chalk.red('❌ Minimum uzunluk maksimumdan büyük olamaz'));
                return;
            }

            config.setLengthLimits(minLength, maxLength);

            console.log(chalk.green('✅ Uzunluk limitleri güncellendi!'));
            console.log(chalk.blue(`📏 Yeni aralık: ${minLength}-${maxLength} karakter`));
        });
}

// Tire pozisyonunu ayarla
function setupDomainConfigHyphenPositionCommand(program) {
    program
        .command('domain-config-hyphen-position <position>')
        .description('Tire pozisyonunu ayarlar (start/middle/end/any)')
        .action(async (position) => {
            const validPositions = ['start', 'middle', 'end', 'any'];

            if (!validPositions.includes(position)) {
                console.log(chalk.red(`❌ Geçersiz pozisyon. Seçenekler: ${validPositions.join(', ')}`));
                return;
            }

            const config = new DomainGenerationConfig();
            config.setHyphenPosition(position);

            console.log(chalk.green('✅ Tire pozisyonu güncellendi!'));
            console.log(chalk.blue(`📍 Yeni pozisyon: ${position}`));

            const descriptions = {
                start: 'Domain başında tire kullanılacak',
                middle: 'Domain ortasında tire kullanılacak',
                end: 'Domain sonunda tire kullanılacak',
                any: 'Herhangi bir pozisyonda tire kullanılabilir'
            };

            console.log(chalk.gray(`💡 ${descriptions[position]}`));
        });
}

// Sayı pozisyonunu ayarla
function setupDomainConfigNumberPositionCommand(program) {
    program
        .command('domain-config-number-position <position>')
        .description('Sayı pozisyonunu ayarlar (start/middle/end/any)')
        .action(async (position) => {
            const validPositions = ['start', 'middle', 'end', 'any'];

            if (!validPositions.includes(position)) {
                console.log(chalk.red(`❌ Geçersiz pozisyon. Seçenekler: ${validPositions.join(', ')}`));
                return;
            }

            const config = new DomainGenerationConfig();
            config.setNumberPosition(position);

            console.log(chalk.green('✅ Sayı pozisyonu güncellendi!'));
            console.log(chalk.blue(`📍 Yeni pozisyon: ${position}`));

            const descriptions = {
                start: 'Domain başında sayı kullanılacak',
                middle: 'Domain ortasında sayı kullanılacak',
                end: 'Domain sonunda sayı kullanılacak',
                any: 'Herhangi bir pozisyonda sayı kullanılabilir'
            };

            console.log(chalk.gray(`💡 ${descriptions[position]}`));
        });
}

// Maksimum sayı sayısını ayarla
function setupDomainConfigMaxNumbersCommand(program) {
    program
        .command('domain-config-max-numbers <count>')
        .description('Domain başına maksimum sayı sayısını ayarlar (0-5)')
        .action(async (count) => {
            const maxNumbers = parseInt(count);

            if (isNaN(maxNumbers) || maxNumbers < 0 || maxNumbers > 5) {
                console.log(chalk.red('❌ Geçersiz sayı. 0-5 arasında bir değer girin'));
                return;
            }

            const config = new DomainGenerationConfig();
            config.setMaxNumbers(maxNumbers);

            console.log(chalk.green('✅ Maksimum sayı sayısı güncellendi!'));
            console.log(chalk.blue(`🔢 Yeni limit: ${maxNumbers} sayı`));

            if (maxNumbers === 0) {
                console.log(chalk.gray('💡 Artık domain\'lerde sayı kullanılmayacak'));
            }
        });
}

// Domain config sıfırlama
function setupDomainConfigResetCommand(program) {
    program
        .command('domain-config-reset')
        .description('Domain üretim konfigürasyonunu varsayılan ayarlara döndürür')
        .option('-y, --yes', 'Onay sormadan sıfırla')
        .action(async (options) => {
            if (!options.yes) {
                console.log(chalk.yellow('⚠️  Tüm domain üretim ayarları varsayılan değerlere dönecek!'));
                console.log(chalk.gray('Emin misiniz? Onaylamak için --yes parametresi kullanın.'));
                return;
            }

            const config = new DomainGenerationConfig();
            config.resetToDefaults();

            console.log(chalk.green('✅ Domain üretim konfigürasyonu sıfırlandı!'));
            console.log(chalk.blue('🎯 Varsayılan ayarlar:'));
            console.log(chalk.gray('   • Tire kullanımı: İzinli'));
            console.log(chalk.gray('   • Sayı kullanımı: İzinli'));
            console.log(chalk.gray('   • Uzunluk: 3-20 karakter'));
            console.log(chalk.gray('   • Tire pozisyonu: Orta'));
            console.log(chalk.gray('   • Sayı pozisyonu: Son'));
        });
}

// Domain test komutu
function setupDomainConfigTestCommand(program) {
    program
        .command('domain-config-test <domain>')
        .description('Verilen domain\'in konfigürasyona uygunluğunu test eder')
        .action(async (domain) => {
            const config = new DomainGenerationConfig();
            const validation = config.validateDomain(domain);
            const qualityScore = config.calculateQualityScore(domain);
            const cleanedDomain = config.cleanDomain(domain);

            console.log(chalk.blue(`🧪 DOMAIN TEST: ${domain}`));
            console.log(chalk.gray('='.repeat(50)));

            // Geçerlilik durumu
            if (validation.isValid) {
                console.log(chalk.green('✅ Domain konfigürasyona uygun!'));
            } else {
                console.log(chalk.red('❌ Domain konfigürasyona uygun değil:'));
                validation.issues.forEach(issue => {
                    console.log(chalk.red(`   • ${issue}`));
                });
            }

            // Kalite puanı
            console.log(chalk.blue(`📊 Kalite Puanı: ${qualityScore}/100`));

            // Temizlenmiş versiyon
            if (cleanedDomain !== domain) {
                console.log(chalk.yellow(`🧹 Temizlenmiş versiyon: ${cleanedDomain}`));
            }

            // Detaylı analiz
            console.log(chalk.gray('\n📋 Detaylı Analiz:'));
            console.log(chalk.gray(`   • Uzunluk: ${domain.length} karakter`));
            console.log(chalk.gray(`   • Tire içeriyor: ${domain.includes('-') ? 'Evet' : 'Hayır'}`));
            console.log(chalk.gray(`   • Sayı içeriyor: ${/\d/.test(domain) ? 'Evet' : 'Hayır'}`));

            const vowelCount = (domain.match(/[aeiou]/g) || []).length;
            console.log(chalk.gray(`   • Vokal sayısı: ${vowelCount}`));
            console.log(chalk.gray(`   • Telaffuz edilebilir: ${vowelCount > 0 ? 'Evet' : 'Hayır'}`));
        });
}

module.exports = {
    setupDomainConfigShowCommand,
    setupDomainConfigHyphensCommand,
    setupDomainConfigNumbersCommand,
    setupDomainConfigLengthCommand,
    setupDomainConfigHyphenPositionCommand,
    setupDomainConfigNumberPositionCommand,
    setupDomainConfigMaxNumbersCommand,
    setupDomainConfigResetCommand,
    setupDomainConfigTestCommand
};
