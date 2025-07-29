#!/usr/bin/env node

const { Command } = require('commander');

// Komut modüllerini import et
const { setupCheckCommand, setupCheckListCommand, setupQuickCommand } = require('./commands/check');
const { setupCheckDomainCommand, setupCheckDomainsCommand, setupCheckAvailabilityCommand, setupFindAvailableCommand } = require('./commands/domain');
const { setupHuntCommand, setupHuntStatsCommand, setupHuntClearCommand } = require('./commands/hunt');
const { setupMonitorCommand } = require('./commands/monitor');
const { setupConfigShowCommand, setupConfigAddCommand, setupConfigRemoveCommand, setupConfigSetCommand, setupConfigResetCommand } = require('./commands/config');
const { setupAICommand } = require('./commands/ai');
const { setupTrendCommand } = require('./commands/trend');
const { setupWordHuntCommand } = require('./commands/wordHunt');
const {
    setupDomainConfigShowCommand,
    setupDomainConfigHyphensCommand,
    setupDomainConfigNumbersCommand,
    setupDomainConfigLengthCommand,
    setupDomainConfigHyphenPositionCommand,
    setupDomainConfigNumberPositionCommand,
    setupDomainConfigMaxNumbersCommand,
    setupDomainConfigResetCommand,
    setupDomainConfigTestCommand
} = require('./commands/domainConfig');

const program = new Command();

// Ana program konfigürasyonu
program
    .name('who-is')
    .description('🔍 Domain avcısı ve site keşifçisi - AI destekli akıllı domain bulma motoru')
    .version('1.0.0');

// Komutları kurulum
setupCheckCommand(program);
setupCheckListCommand(program);
setupQuickCommand(program);
setupCheckDomainCommand(program);
setupCheckDomainsCommand(program);
setupCheckAvailabilityCommand(program);
setupFindAvailableCommand(program);
setupMonitorCommand(program);
setupHuntCommand(program);
setupHuntStatsCommand(program);
setupHuntClearCommand(program);

// Konfigürasyon komutları
setupConfigShowCommand(program);
setupConfigAddCommand(program);
setupConfigRemoveCommand(program);
setupConfigSetCommand(program);
setupConfigResetCommand(program);

// AI komutları
setupAICommand(program);

// Trend analizi komutları
setupTrendCommand(program);

// Word Hunt komutları
setupWordHuntCommand(program);

// Domain üretim konfigürasyonu komutları
setupDomainConfigShowCommand(program);
setupDomainConfigHyphensCommand(program);
setupDomainConfigNumbersCommand(program);
setupDomainConfigLengthCommand(program);
setupDomainConfigHyphenPositionCommand(program);
setupDomainConfigNumberPositionCommand(program);
setupDomainConfigMaxNumbersCommand(program);
setupDomainConfigResetCommand(program);
setupDomainConfigTestCommand(program);

// Program başlat
if (require.main === module) {
    program.parse();
}

module.exports = program;
