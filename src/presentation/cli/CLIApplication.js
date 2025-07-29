const { CheckCommands } = require('./commands/CheckCommands');
const { DomainCommands } = require('./commands/DomainCommands');
const { HuntCommands } = require('./commands/HuntCommands');
const { Logger } = require('../../shared/utils/Logger');

/**
 * 🎯 Clean Architecture CLI Application
 * Modern ve modüler CLI uygulaması
 */
class CLIApplication {
    constructor() {
        this.logger = new Logger('CLIApplication');
        this.setupCommands();
    }

    /**
     * 🔧 Komutları ayarla
     */
    setupCommands() {
        this.checkCommands = new CheckCommands();
        this.domainCommands = new DomainCommands();
        this.huntCommands = new HuntCommands();
    }

    /**
     * 🚀 CLI uygulamasını başlat
     */
    async run(args = process.argv) {
        try {
            const command = args[2];
            const subCommand = args[3];
            const parameters = args.slice(4);

            // Ana komut kontrolü
            if (!command) {
                this.showHelp();
                return;
            }

            // Help komutu
            if (command === 'help' || command === '--help' || command === '-h') {
                this.showHelp();
                return;
            }

            // Version komutu
            if (command === 'version' || command === '--version' || command === '-v') {
                this.showVersion();
                return;
            }

            // Komutları route et
            await this.routeCommand(command, subCommand, parameters);

        } catch (error) {
            console.error('❌ Application error:', error.message);
            this.logger.error('CLI Application error', error);
        }
    }

    /**
     * 🎯 Komutları route et
     */
    async routeCommand(command, subCommand, parameters) {
        switch (command) {
            case 'check':
                await this.handleCheckCommands(subCommand, parameters);
                break;
            
            case 'generate':
            case 'gen':
                await this.handleDomainCommands(subCommand, parameters);
                break;
            
            case 'hunt':
                await this.handleHuntCommands(subCommand, parameters);
                break;
            
            case 'config':
                await this.handleConfigCommands(subCommand, parameters);
                break;
            
            case 'ai':
                await this.handleAICommands(subCommand, parameters);
                break;
            
            default:
                console.error(`❌ Unknown command: ${command}`);
                console.log('💡 Use "npm start help" to see available commands');
        }
    }

    /**
     * 🔍 Check komutlarını işle
     */
    async handleCheckCommands(subCommand, parameters) {
        if (!subCommand) {
            console.error('❌ Check command requires a subcommand');
            console.log('💡 Available: site, batch, file');
            return;
        }

        switch (subCommand) {
            case 'site':
            case 'url':
                if (parameters.length === 0) {
                    console.error('❌ URL parameter required');
                    return;
                }
                await this.checkCommands.checkSite(parameters[0]);
                break;
            
            case 'batch':
                if (parameters.length === 0) {
                    console.error('❌ URLs parameter required');
                    return;
                }
                await this.checkCommands.checkMultipleSites(parameters);
                break;
            
            case 'file':
                if (parameters.length === 0) {
                    console.error('❌ File path parameter required');
                    return;
                }
                await this.checkCommands.checkFromFile(parameters[0]);
                break;
            
            default:
                console.error(`❌ Unknown check subcommand: ${subCommand}`);
        }
    }

    /**
     * 🎲 Domain komutlarını işle
     */
    async handleDomainCommands(subCommand, parameters) {
        if (!subCommand) {
            console.error('❌ Generate command requires a subcommand');
            console.log('💡 Available: keywords, quick, creative, business, tech, random');
            return;
        }

        switch (subCommand) {
            case 'keywords':
                if (parameters.length === 0) {
                    console.error('❌ Keywords parameter required');
                    return;
                }
                await this.domainCommands.generateDomains(parameters);
                break;
            
            case 'quick':
                if (parameters.length === 0) {
                    console.error('❌ Keyword parameter required');
                    return;
                }
                await this.domainCommands.quickGenerate(parameters[0]);
                break;
            
            case 'creative':
                if (parameters.length === 0) {
                    console.error('❌ Keywords parameter required');
                    return;
                }
                await this.domainCommands.creativeGenerate(parameters);
                break;
            
            case 'business':
                if (parameters.length === 0) {
                    console.error('❌ Keywords parameter required');
                    return;
                }
                await this.domainCommands.businessGenerate(parameters);
                break;
            
            case 'tech':
                if (parameters.length === 0) {
                    console.error('❌ Keywords parameter required');
                    return;
                }
                await this.domainCommands.techGenerate(parameters);
                break;
            
            case 'random':
                const category = parameters[0] || 'general';
                await this.domainCommands.randomGenerate(category);
                break;
            
            default:
                console.error(`❌ Unknown generate subcommand: ${subCommand}`);
        }
    }

    /**
     * 🕵️ Hunt komutlarını işle
     */
    async handleHuntCommands(subCommand, parameters) {
        if (!subCommand) {
            console.error('❌ Hunt command requires a subcommand');
            console.log('💡 Available: domains, quick, random, premium, bulk');
            return;
        }

        switch (subCommand) {
            case 'domains':
                if (parameters.length === 0) {
                    console.error('❌ Keywords parameter required');
                    return;
                }
                await this.huntCommands.huntDomains(parameters);
                break;
            
            case 'quick':
                if (parameters.length === 0) {
                    console.error('❌ Keyword parameter required');
                    return;
                }
                await this.huntCommands.quickHunt(parameters[0]);
                break;
            
            case 'random':
                const category = parameters[0] || 'tech';
                await this.huntCommands.randomHunt(category);
                break;
            
            case 'premium':
                if (parameters.length === 0) {
                    console.error('❌ Keywords parameter required');
                    return;
                }
                await this.huntCommands.premiumHunt(parameters);
                break;
            
            case 'bulk':
                if (parameters.length === 0) {
                    console.error('❌ File path parameter required');
                    return;
                }
                await this.huntCommands.bulkHunt(parameters[0]);
                break;
            
            default:
                console.error(`❌ Unknown hunt subcommand: ${subCommand}`);
        }
    }

    /**
     * ⚙️ Config komutlarını işle
     */
    async handleConfigCommands(subCommand, parameters) {
        console.log('⚙️ Config commands - Clean Architecture implementation in progress');
    }

    /**
     * 🤖 AI komutlarını işle
     */
    async handleAICommands(subCommand, parameters) {
        console.log('🤖 AI commands - Clean Architecture implementation in progress');
    }

    /**
     * 📖 Yardım göster
     */
    showHelp() {
        console.log(`
🚀 Who-Is CLI - Clean Architecture Edition

📋 Available Commands:

🔍 CHECK COMMANDS:
   npm start check site <url>              🔍 Bir web sitesinin durumunu kontrol eder
   npm start check batch <url1> <url2>     📊 Birden fazla siteyi kontrol eder  
   npm start check file <filepath>         📁 Dosyadan URL listesi ile kontrol

🎲 GENERATE COMMANDS:
   npm start gen keywords <word1> <word2>  🎲 Anahtar kelimelerle domain üretir
   npm start gen quick <keyword>           ⚡ Hızlı domain önerisi
   npm start gen creative <keywords...>    🎨 Yaratıcı domain önerileri
   npm start gen business <keywords...>    💼 İş odaklı domain önerileri
   npm start gen tech <keywords...>        🔧 Teknoloji odaklı öneriler
   npm start gen random [category]         🎲 Rastgele domain önerileri

🕵️ HUNT COMMANDS:
   npm start hunt domains <keywords...>    🕵️ Kapsamlı domain avı
   npm start hunt quick <keyword>          ⚡ Hızlı domain avı
   npm start hunt random [category]        🎲 Rastgele domain avı
   npm start hunt premium <keywords...>    💎 Premium domain avı
   npm start hunt bulk <filepath>          📁 Toplu domain avı

⚙️ OTHER COMMANDS:
   npm start help                          📖 Bu yardım metnini gösterir
   npm start version                       📋 Versiyon bilgisini gösterir

💡 Examples:
   npm start check site google.com
   npm start gen quick tech
   npm start hunt domains app mobile
   npm start gen creative art design

🎯 Clean Architecture implementation with modern design patterns!
        `);
    }

    /**
     * 📋 Version göster
     */
    showVersion() {
        const packageJson = require('../../../package.json');
        console.log(`
🚀 Who-Is CLI v${packageJson.version}
🏛️ Clean Architecture Edition
🎯 Modern, Modular, Maintainable
        `);
    }
}

module.exports = CLIApplication;
