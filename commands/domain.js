const chalk = require('chalk');
const SiteChecker = require('../checker');
const { displayDomainResults, displayAvailabilityResults, displayMultipleAvailabilityResults } = require('../utils/display');

// Domain uzantı kontrolü
function setupCheckDomainCommand(program) {
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
}

// Çoklu domain uzantı kontrolü
function setupCheckDomainsCommand(program) {
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
}

// Domain availability kontrolü
function setupCheckAvailabilityCommand(program) {
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
}

// Çoklu domain availability kontrolü
function setupFindAvailableCommand(program) {
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
}

module.exports = {
  setupCheckDomainCommand,
  setupCheckDomainsCommand,
  setupCheckAvailabilityCommand,
  setupFindAvailableCommand
};
