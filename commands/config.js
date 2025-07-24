const chalk = require('chalk');
const Table = require('cli-table3');
const ExtensionConfig = require('../utils/extensionConfig');

// Uzantı konfigürasyonunu göster
function setupConfigShowCommand(program) {
  program
    .command('config-show')
    .description('Mevcut uzantı konfigürasyonunu gösterir')
    .option('-j, --json', 'JSON formatında göster')
    .action(async (options) => {
      const config = new ExtensionConfig();
      
      if (options.json) {
        console.log(config.getConfigAsJson());
        return;
      }

      console.log(chalk.blue('📋 UZANTI KONFİGÜRASYONU'));
      console.log(chalk.gray('='.repeat(50)));
      
      const activeExtensions = config.getActiveExtensions();
      const availableExtensions = config.getAvailableExtensions();

      console.log(chalk.green('\n✅ Aktif Uzantılar:'));
      activeExtensions.forEach(ext => {
        console.log(chalk.green(`   ${ext}`));
      });

      console.log(chalk.yellow('\n📦 Mevcut Tüm Uzantılar:'));
      const table = new Table({
        head: ['Uzantı', 'Durum'],
        colWidths: [15, 15]
      });

      availableExtensions.forEach(ext => {
        const isActive = activeExtensions.includes(ext);
        table.push([
          ext,
          isActive ? chalk.green('✅ Aktif') : chalk.gray('⭕ Pasif')
        ]);
      });

      console.log(table.toString());
      
      console.log(chalk.gray('\n💡 Uzantı eklemek için: node index.js config-add <uzantı>'));
      console.log(chalk.gray('💡 Uzantı çıkarmak için: node index.js config-remove <uzantı>'));
      console.log(chalk.gray('💡 Tümünü ayarlamak için: node index.js config-set <uzantı1,uzantı2>'));
    });
}

// Uzantı ekle
function setupConfigAddCommand(program) {
  program
    .command('config-add <extension>')
    .description('Aktif uzantı listesine yeni uzantı ekler')
    .action(async (extension) => {
      const config = new ExtensionConfig();
      
      try {
        // Nokta ile başlamıyorsa ekle
        if (!extension.startsWith('.')) {
          extension = '.' + extension;
        }

        const updatedExtensions = config.addExtension(extension);
        
        console.log(chalk.green(`✅ ${extension} başarıyla eklendi!`));
        console.log(chalk.blue('📋 Güncel aktif uzantılar:'));
        updatedExtensions.forEach(ext => {
          console.log(chalk.green(`   ${ext}`));
        });
        
      } catch (error) {
        console.error(chalk.red(`❌ Hata: ${error.message}`));
        console.log(chalk.yellow('💡 Desteklenen uzantıları görmek için: node index.js config-show'));
      }
    });
}

// Uzantı çıkar
function setupConfigRemoveCommand(program) {
  program
    .command('config-remove <extension>')
    .description('Aktif uzantı listesinden uzantı çıkarır')
    .action(async (extension) => {
      const config = new ExtensionConfig();
      
      try {
        // Nokta ile başlamıyorsa ekle
        if (!extension.startsWith('.')) {
          extension = '.' + extension;
        }

        const updatedExtensions = config.removeExtension(extension);
        
        console.log(chalk.green(`✅ ${extension} başarıyla çıkarıldı!`));
        console.log(chalk.blue('📋 Güncel aktif uzantılar:'));
        updatedExtensions.forEach(ext => {
          console.log(chalk.green(`   ${ext}`));
        });
        
      } catch (error) {
        console.error(chalk.red(`❌ Hata: ${error.message}`));
      }
    });
}

// Uzantıları toplu ayarla
function setupConfigSetCommand(program) {
  program
    .command('config-set <extensions>')
    .description('Aktif uzantı listesini belirtilen uzantılarla değiştirir (virgülle ayırın)')
    .action(async (extensions) => {
      const config = new ExtensionConfig();
      
      try {
        const extensionList = extensions.split(',').map(ext => {
          ext = ext.trim();
          return ext.startsWith('.') ? ext : '.' + ext;
        });

        const updatedExtensions = config.setActiveExtensions(extensionList);
        
        console.log(chalk.green('✅ Uzantılar başarıyla güncellendi!'));
        console.log(chalk.blue('📋 Güncel aktif uzantılar:'));
        updatedExtensions.forEach(ext => {
          console.log(chalk.green(`   ${ext}`));
        });
        
      } catch (error) {
        console.error(chalk.red(`❌ Hata: ${error.message}`));
        console.log(chalk.yellow('💡 Desteklenen uzantıları görmek için: node index.js config-show'));
      }
    });
}

// Varsayılan ayarlara dön
function setupConfigResetCommand(program) {
  program
    .command('config-reset')
    .description('Uzantı konfigürasyonunu varsayılan ayarlara döndürür (.com)')
    .action(async () => {
      const config = new ExtensionConfig();
      
      const updatedExtensions = config.resetToDefault();
      
      console.log(chalk.green('✅ Konfigürasyon varsayılan ayarlara döndürüldü!'));
      console.log(chalk.blue('📋 Aktif uzantılar:'));
      updatedExtensions.forEach(ext => {
        console.log(chalk.green(`   ${ext}`));
      });
    });
}

module.exports = {
  setupConfigShowCommand,
  setupConfigAddCommand,
  setupConfigRemoveCommand,
  setupConfigSetCommand,
  setupConfigResetCommand
};
