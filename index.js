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

const program = new Command();

// Ana program konfigürasyonu
program
  .name('who-is')
  .description('Çok hızlı web sitesi durum kontrol sistemi')
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

// Program başlat
if (require.main === module) {
  program.parse();
}

module.exports = program;
