const chalk = require('chalk');
const SiteChecker = require('../checker');
const { displayMultipleResults } = require('../utils/display');

// İzleme modu
function setupMonitorCommand(program) {
    program
        .command('monitor <file>')
        .description('👁️  Sürekli bekçi - Siteleri 7/24 izler ve raporlar')
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
}

module.exports = {
    setupMonitorCommand
};
