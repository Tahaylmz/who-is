const chalk = require('chalk');
const Table = require('cli-table3');

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

// Çoklu domain uzantı sonuçlarını görüntüleme
function displayMultipleDomainResults(results) {
    console.log('\n' + '='.repeat(80));
    console.log(chalk.blue('🌐 Çoklu Domain Uzantı Kontrol Sonuçları'));
    console.log('='.repeat(80));

    Object.keys(results).forEach(domain => {
        const domainResults = results[domain];
        if (domainResults.length === 0) return;

        console.log(chalk.yellow(`\n📍 ${domain.toUpperCase()} için sonuçlar:`));

        const table = new Table({
            head: ['Uzantı', 'Durum', 'Status', 'Yanıt (ms)', 'Server'],
            colWidths: [25, 12, 8, 12, 20]
        });

        let onlineCount = 0;
        let offlineCount = 0;

        domainResults.forEach(result => {
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
            const bestResult = domainResults.find(r => r.status === 'online');
            console.log(chalk.green(`🎯 ${domain} için önerilen: ${bestResult.url} (${bestResult.responseTime}ms)`));
        }

        console.log(chalk.gray(`   📊 ${domain}: ${onlineCount} erişilebilir, ${offlineCount} erişilemiyor`));
    });

    console.log('\n' + '='.repeat(80));
    console.log(chalk.gray(`🕒 Kontrol zamanı: ${new Date().toLocaleString('tr-TR')}`));
    console.log('='.repeat(80) + '\n');
}

module.exports = {
    displaySingleResult,
    displayMultipleResults,
    displayDomainResults,
    displayMultipleDomainResults,
    displayAvailabilityResults,
    displayMultipleAvailabilityResults
};
