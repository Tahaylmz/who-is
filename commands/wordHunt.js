const chalk = require('chalk');
const SiteChecker = require('../checker');
const ExtensionConfig = require('../utils/extensionConfig');

// Kelime bazlı domain avcısı
function setupWordHuntCommand(program) {
    program
        .command('word-hunt <keyword>')
        .description('🎯 Kelime sihirbazı - AI destekli yaratıcı domain kombinasyonları üretir')
        .option('-l, --limit <num>', 'Maksimum kontrol edilecek kombinasyon sayısı', '50')
        .option('-e, --extensions <exts>', 'Kontrol edilecek uzantılar (virgülle ayırın)', null)
        .option('--min-length <num>', 'Minimum domain uzunluğu', '3')
        .option('--max-length <num>', 'Maksimum domain uzunluğu', '15')
        .option('--save', 'Bulunan müsait domainleri dosyaya kaydet')
        .option('--no-ai', 'AI önerilerini devre dışı bırak')
        .option('--no-numbers', 'Sayı kombinasyonlarını devre dışı bırak')
        .option('--no-hyphens', 'Tire kombinasyonlarını devre dışı bırak')
        .action(async (keyword, options) => {
            const checker = new SiteChecker();
            const config = new ExtensionConfig();

            // Parametreleri hazırla
            const limit = parseInt(options.limit) || 50;
            const minLength = parseInt(options.minLength) || 3;
            const maxLength = parseInt(options.maxLength) || 15;
            const shouldSave = options.save;
            const useAI = !options.noAi;
            const useNumbers = !options.noNumbers;
            const useHyphens = !options.noHyphens;

            // Uzantıları belirle
            const extensions = options.extensions
                ? options.extensions.split(',').map(e => e.trim().startsWith('.') ? e.trim() : '.' + e.trim())
                : config.getActiveExtensions();

            console.log(chalk.green(`🎯 "${keyword}" KELİMESİNDEN DOMAIN AVCILIĞI\n`));
            console.log(chalk.blue(`📝 Hedef Kelime: ${keyword}`));
            console.log(chalk.blue(`🔍 Kontrol Limiti: ${limit} kombinasyon`));
            console.log(chalk.blue(`📏 Uzunluk Aralığı: ${minLength}-${maxLength} karakter`));
            console.log(chalk.blue(`🌐 Uzantılar: ${extensions.join(', ')}`));
            console.log(chalk.blue(`🛠 Seçenekler: AI=${useAI ? '✅' : '❌'} | Sayılar=${useNumbers ? '✅' : '❌'} | Tire=${useHyphens ? '✅' : '❌'}`));
            console.log(chalk.gray('='.repeat(60)));

            try {
                // Domain kombinasyonlarını üret
                const combinations = generateWordCombinations(keyword, minLength, maxLength, limit, {
                    useAI, useNumbers, useHyphens
                });
                
                console.log(chalk.cyan(`\n🔬 ${combinations.length} kombinasyon oluşturuldu. Kontrol başlıyor...\n`));

                const availableDomains = [];
                let checkedCount = 0;
                let availableCount = 0;

                for (const combination of combinations) {
                    for (const extension of extensions) {
                        const fullDomain = combination + extension;
                        checkedCount++;

                        console.log(chalk.blue(`🔍 ${fullDomain} kontrol ediliyor...`), chalk.gray(checkedCount.toString().padStart(3)));

                        try {
                            const result = await checker.checkSingle(fullDomain, { timeout: 5000 });
                            
                            if (result.isAvailable) {
                                console.log(chalk.green(`✅ MÜSAİT!`));
                                const strategy = getGenerationStrategy(combination, keyword);
                                availableDomains.push({
                                    domain: fullDomain,
                                    combination,
                                    extension,
                                    strategy,
                                    length: combination.length
                                });
                                availableCount++;
                            } else {
                                console.log(chalk.red(`❌ Alınmış`));
                            }
                        } catch (error) {
                            console.log(chalk.yellow(`WHOIS sorgusu başarısız: ${fullDomain}`));
                            console.log(chalk.red(`❌ Alınmış`));
                        }
                    }
                }

                // Sonuçları göster
                console.log(chalk.gray('='.repeat(60)));
                console.log(chalk.green('🎉 WORD HUNT SONUÇLARI'));
                console.log(chalk.gray('='.repeat(60)));

                if (availableDomains.length > 0) {
                    console.log(chalk.green(`\n✅ ${availableDomains.length} MÜSAİT DOMAIN BULUNDU:\n`));

                    // Stratejiye göre grupla
                    const groupedDomains = groupByStrategy(availableDomains);
                    
                    Object.keys(groupedDomains).forEach(strategy => {
                        const domains = groupedDomains[strategy];
                        console.log(chalk.cyan(`📋 ${strategy} (${domains.length} adet):`));
                        domains.forEach(domain => {
                            console.log(chalk.green(`   ✅ ${domain.domain} (${domain.length} chars)`));
                        });
                        console.log('');
                    });

                    // En iyi öneriler
                    showBestRecommendations(availableDomains, keyword);

                    // Dosyaya kaydet
                    if (shouldSave) {
                        await saveAvailableDomains(availableDomains, keyword);
                    }
                } else {
                    console.log(chalk.red(`😞 Maalesef "${keyword}" için müsait domain bulunamadı.`));
                    console.log(chalk.yellow('\n💡 ÖNERİLER:'));
                    console.log(chalk.gray('   • Farklı uzantılar deneyin (--extensions)'));
                    console.log(chalk.gray('   • Uzunluk limitini artırın (--max-length)'));
                    console.log(chalk.gray('   • Kontrol limitini artırın (--limit)'));
                }

                // İstatistikler
                console.log(chalk.cyan('\n📊 İSTATİSTİKLER:'));
                console.log(chalk.blue(`   Kontrol edilen: ${checkedCount} domain`));
                console.log(chalk.green(`   Müsait bulunan: ${availableCount} domain`));
                console.log(chalk.blue(`   Başarı oranı: ${(availableCount / checkedCount * 100).toFixed(1)}%`));

            } catch (error) {
                console.error(chalk.red(`❌ Hata: ${error.message}`));
            }
        });
}

// Domain kombinasyonları üretme fonksiyonu
function generateWordCombinations(keyword, minLength, maxLength, limit, options = {}) {
    const { useAI = true, useNumbers = true, useHyphens = true } = options;
    const combinations = new Set();
    const baseWord = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. Orijinal kelime
    if (baseWord.length >= minLength && baseWord.length <= maxLength) {
        combinations.add(baseWord);
    }

    // 2. AI önerili kombinasyonlar
    if (useAI) {
        const aiSuggestions = generateAICombinations(baseWord, minLength, maxLength);
        aiSuggestions.forEach(suggestion => combinations.add(suggestion));
    }

    // 3. Sayı ekleme stratejileri (sadece etkinse)
    if (useNumbers) {
        const numbers = ['1', '2', '3', '24', '365', '2024', '2025', '123', '999'];
        numbers.forEach(num => {
            const withNumberEnd = baseWord + num;
            const withNumberStart = num + baseWord;
            
            if (withNumberEnd.length >= minLength && withNumberEnd.length <= maxLength) {
                combinations.add(withNumberEnd);
            }
            if (withNumberStart.length >= minLength && withNumberStart.length <= maxLength) {
                combinations.add(withNumberStart);
            }
        });
    }

    // 4. Ön ek stratejileri
    const prefixes = ['get', 'my', 'the', 'best', 'top', 'pro', 'super', 'smart', 'quick', 'auto'];
    prefixes.forEach(prefix => {
        const withPrefix = prefix + baseWord;
        if (withPrefix.length >= minLength && withPrefix.length <= maxLength) {
            combinations.add(withPrefix);
        }
    });

    // 5. Son ek stratejileri
    const suffixes = ['app', 'hub', 'lab', 'box', 'kit', 'pro', 'plus', 'max', 'net', 'tech', 'ai', 'ly', 'go'];
    suffixes.forEach(suffix => {
        const withSuffix = baseWord + suffix;
        if (withSuffix.length >= minLength && withSuffix.length <= maxLength) {
            combinations.add(withSuffix);
        }
    });

    // 6. Tire ile kombinasyonlar (sadece etkinse)
    if (useHyphens) {
        const tireWords = ['web', 'app', 'pro', 'tech', 'online', 'digital', 'smart'];
        tireWords.forEach(word => {
            const withTire1 = baseWord + '-' + word;
            const withTire2 = word + '-' + baseWord;
            
            if (withTire1.length >= minLength && withTire1.length <= maxLength) {
                combinations.add(withTire1);
            }
            if (withTire2.length >= minLength && withTire2.length <= maxLength) {
                combinations.add(withTire2);
            }
        });
    }

    // 7. Kısaltma stratejileri
    if (baseWord.length > 4) {
        const shortened = baseWord.substring(0, 4);
        const shortenedWithSuffix = shortened + 'ly';
        const shortenedWithNumber = shortened + '24';
        
        if (shortened.length >= minLength) combinations.add(shortened);
        if (shortenedWithSuffix.length <= maxLength) combinations.add(shortenedWithSuffix);
        if (shortenedWithNumber.length <= maxLength) combinations.add(shortenedWithNumber);
    }

    // 8. Çoğul ve varyasyonlar
    const variations = [
        baseWord + 's',
        baseWord + 'er',
        baseWord + 'ed',
        baseWord + 'ing'
    ];
    variations.forEach(variation => {
        if (variation.length >= minLength && variation.length <= maxLength) {
            combinations.add(variation);
        }
    });

    // 9. Teknoloji odaklı kombinasyonlar
    const techSuffixes = ['ai', 'io', 'app', 'tech', 'cloud', 'api', 'bot', 'dev'];
    techSuffixes.forEach(tech => {
        const techCombo = baseWord + tech;
        if (techCombo.length >= minLength && techCombo.length <= maxLength) {
            combinations.add(techCombo);
        }
    });

    // Limit uygula ve array'e çevir
    return Array.from(combinations).slice(0, limit);
}

// AI tabanlı yaratıcı kombinasyonlar
function generateAICombinations(baseWord, minLength, maxLength) {
    const aiSuggestions = [];
    const creativeSuffixes = ['ify', 'ize', 'wise', 'zen', 'flow', 'sync', 'link', 'spark', 'vibe'];
    const creativePrefixes = ['neo', 'meta', 'ultra', 'micro', 'macro', 'cyber', 'digi', 'auto'];
    const techWords = ['lab', 'dev', 'code', 'byte', 'bit', 'data', 'cloud', 'edge'];
    
    // Yaratıcı ön ek kombinasyonları
    creativePrefixes.forEach(prefix => {
        const combination = prefix + baseWord;
        if (combination.length >= minLength && combination.length <= maxLength) {
            aiSuggestions.push(combination);
        }
    });
    
    // Yaratıcı son ek kombinasyonları
    creativeSuffixes.forEach(suffix => {
        const combination = baseWord + suffix;
        if (combination.length >= minLength && combination.length <= maxLength) {
            aiSuggestions.push(combination);
        }
    });
    
    // Teknoloji odaklı kombinasyonlar
    techWords.forEach(tech => {
        const combination1 = baseWord + tech;
        const combination2 = tech + baseWord;
        
        if (combination1.length >= minLength && combination1.length <= maxLength) {
            aiSuggestions.push(combination1);
        }
        if (combination2.length >= minLength && combination2.length <= maxLength) {
            aiSuggestions.push(combination2);
        }
    });
    
    // Yaratıcı kısaltmalar
    const vowels = 'aeiou';
    if (baseWord.length > 3) {
        // Sesli harfleri çıkararak yaratıcı kısaltma
        const consonantOnly = baseWord.split('').filter(char => !vowels.includes(char)).join('');
        if (consonantOnly.length >= minLength && consonantOnly.length <= maxLength) {
            aiSuggestions.push(consonantOnly);
        }
        
        // Teknoloji sonekleri ekle
        const techEndings = ['x', 'z', 'r'];
        techEndings.forEach(ending => {
            const combination = consonantOnly + ending;
            if (combination.length >= minLength && combination.length <= maxLength) {
                aiSuggestions.push(combination);
            }
        });
    }
    
    return aiSuggestions.slice(0, 15); // AI önerilerini sınırla
}

// Üretim stratejisini belirle
function getGenerationStrategy(combination, originalKeyword) {
    const base = originalKeyword.toLowerCase();
    
    if (combination === base) return 'Orijinal Kelime';
    if (combination.startsWith(base) && /\d+$/.test(combination)) return 'Sayı Ekleme (Son)';
    if (combination.endsWith(base) && /^\d+/.test(combination)) return 'Sayı Ekleme (Başta)';
    if (combination.includes('-')) return 'Tire Kombinasyon';
    if (combination.startsWith(base)) return 'Son Ek Ekleme';
    if (combination.endsWith(base)) return 'Ön Ek Ekleme';
    if (combination.length < base.length) return 'Kısaltma';
    
    // AI önerilerini kontrol et
    const aiPrefixes = ['neo', 'meta', 'ultra', 'micro', 'macro', 'cyber', 'digi', 'auto'];
    const aiSuffixes = ['ify', 'ize', 'wise', 'zen', 'flow', 'sync', 'link', 'spark', 'vibe'];
    const techWords = ['lab', 'dev', 'code', 'byte', 'bit', 'data', 'cloud', 'edge'];
    
    const hasAIPrefix = aiPrefixes.some(prefix => combination.startsWith(prefix));
    const hasAISuffix = aiSuffixes.some(suffix => combination.endsWith(suffix));
    const hasTechWord = techWords.some(tech => combination.includes(tech));
    
    if (hasAIPrefix || hasAISuffix || hasTechWord) return 'AI Önerisi';
    
    return 'Varyasyon';
}

// Stratejiye göre grupla
function groupByStrategy(domains) {
    const grouped = {};
    domains.forEach(domain => {
        const strategy = domain.strategy;
        if (!grouped[strategy]) {
            grouped[strategy] = [];
        }
        grouped[strategy].push(domain);
    });
    return grouped;
}

// En iyi önerileri göster
function showBestRecommendations(domains, keyword) {
    console.log(chalk.yellow('🏆 EN İYİ ÖNERİLER:\n'));

    // En kısa domain
    const shortest = domains.reduce((min, domain) => 
        domain.length < min.length ? domain : min
    );
    console.log(chalk.green(`🎯 En Kısa: ${shortest.domain} (${shortest.length} chars)`));

    // .com domain
    const comDomain = domains.find(d => d.extension === '.com');
    if (comDomain) {
        console.log(chalk.green(`🌟 .com Domain: ${comDomain.domain}`));
    }

    // Orijinal kelime
    const original = domains.find(d => d.strategy === 'Orijinal Kelime');
    if (original) {
        console.log(chalk.green(`🔤 Orijinal: ${original.domain}`));
    }

    // Tech odaklı
    const techDomain = domains.find(d => 
        d.combination.includes('tech') || 
        d.combination.includes('app') || 
        d.combination.includes('ai')
    );
    if (techDomain) {
        console.log(chalk.green(`🚀 Tech Odaklı: ${techDomain.domain}`));
    }

    console.log('');
}

// Müsait domainleri dosyaya kaydet
async function saveAvailableDomains(domains, keyword) {
    const fs = require('fs').promises;
    const path = require('path');

    try {
        const resultsDir = path.join(process.cwd(), 'domain-results');
        await fs.mkdir(resultsDir, { recursive: true });

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
        const filename = `word-hunt-${keyword}-${timestamp}.txt`;
        const filepath = path.join(resultsDir, filename);

        let content = `Word Hunt Sonuçları - ${keyword}\n`;
        content += `Tarih: ${new Date().toLocaleString('tr-TR')}\n`;
        content += `Toplam: ${domains.length} müsait domain\n\n`;

        const grouped = groupByStrategy(domains);
        Object.keys(grouped).forEach(strategy => {
            content += `${strategy}:\n`;
            grouped[strategy].forEach(domain => {
                content += `  ${domain.domain} (${domain.length} chars)\n`;
            });
            content += '\n';
        });

        await fs.writeFile(filepath, content, 'utf8');
        console.log(chalk.green(`💾 Sonuçlar kaydedildi: ${filename}`));

    } catch (error) {
        console.error(chalk.red(`❌ Dosya kaydetme hatası: ${error.message}`));
    }
}

module.exports = {
    setupWordHuntCommand
};
