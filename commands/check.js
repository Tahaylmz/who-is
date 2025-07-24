const chalk = require('chalk');
const SiteChecker = require('../checker');
const { displaySingleResult, displayMultipleResults } = require('../utils/display');

// Tek site kontrolü
function setupCheckCommand(program) {
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
}

// Çoklu site kontrolü
function setupCheckListCommand(program) {
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
}

// Hızlı test komutu
function setupQuickCommand(program) {
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
}

module.exports = {
    setupCheckCommand,
    setupCheckListCommand,
    setupQuickCommand
};
