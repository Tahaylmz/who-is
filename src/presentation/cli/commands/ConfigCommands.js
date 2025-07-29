/**
 * Config Commands - Presentation Layer
 */
const chalk = require('chalk');
const { logger } = require('../../../shared/utils/Logger');

class ConfigCommands {
    constructor() {
        this.logger = logger.child('ConfigCommands');
    }

    async register(program) {
        this.logger.debug('Registering config commands');

        program
            .command('config-show')
            .description('📋 Mevcut konfigürasyonu gösterir')
            .action(async () => {
                await this.handleShowConfig();
            });

        this.logger.debug('Config commands registered successfully');
    }

    async handleShowConfig() {
        console.log(chalk.blue('📋 Konfigürasyon gösteriliyor...'));
        console.log(chalk.yellow('⚠️  Clean Architecture implementation in progress...'));
    }
}

module.exports = ConfigCommands;
