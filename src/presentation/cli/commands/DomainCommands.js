const { GenerateDomainUseCase } = require('../../../application/usecases/GenerateDomainUseCase');
const { OpenAIDomainGenerator } = require('../../../infrastructure/services/OpenAIDomainGenerator');
const { FileDomainRepository } = require('../../../infrastructure/repositories/FileDomainRepository');
const { Logger } = require('../../../shared/utils/Logger');

/**
 * 🎲 Domain Commands - Domain üretme komutları
 */
class DomainCommands {
    constructor() {
        this.logger = new Logger('DomainCommands');
        this.setupDependencies();
    }

    /**
     * 🔧 Bağımlılıkları ayarla
     */
    setupDependencies() {
        this.domainGenerator = new OpenAIDomainGenerator();
        this.domainValidationService = {
            isValidDomainName: (domain) => {
                // Basit domain validation
                return /^[a-z0-9-]+$/.test(domain) && 
                       domain.length >= 3 && 
                       domain.length <= 63 &&
                       !domain.startsWith('-') && 
                       !domain.endsWith('-') &&
                       !domain.includes('--');
            }
        };
        this.domainRepository = new FileDomainRepository();
        this.generateDomainUseCase = new GenerateDomainUseCase(
            this.domainGenerator,
            this.domainValidationService,
            this.domainRepository
        );
    }

    /**
     * 📋 Domain komutlarını döndür
     */
    getCommands() {
        return [
            {
                command: 'generate <keywords...>',
                description: '🎲 Anahtar kelimelerle yaratıcı domain önerileri üretir',
                action: (keywords, options) => this.generateDomains(keywords, options)
            },
            {
                command: 'quick-gen <keyword>',
                description: '⚡ Tek kelimeyle hızlı domain önerileri',
                action: (keyword, options) => this.quickGenerate(keyword, options)
            },
            {
                command: 'creative <keywords...>',
                description: '🎨 Yaratıcı ve artistik domain önerileri',
                action: (keywords, options) => this.creativeGenerate(keywords, options)
            },
            {
                command: 'business <keywords...>',
                description: '💼 İş dünyası için profesyonel domain önerileri',
                action: (keywords, options) => this.businessGenerate(keywords, options)
            },
            {
                command: 'tech <keywords...>',
                description: '🔧 Teknoloji odaklı modern domain önerileri',
                action: (keywords, options) => this.techGenerate(keywords, options)
            },
            {
                command: 'random [category]',
                description: '🎲 Rastgele kategoriden domain önerileri (tech, business, creative)',
                action: (category, options) => this.randomGenerate(category, options)
            }
        ];
    }

    /**
     * 🎲 Genel domain üretimi
     */
    async generateDomains(keywords, options = {}) {
        try {
            console.log(`🎲 Generating domains for: ${keywords.join(', ')}`);
            console.log('⏳ Please wait...\n');

            const result = await this.generateDomainUseCase.execute(keywords, {
                count: options.count || 20,
                style: options.style || 'modern',
                businessType: options.type || 'general',
                maxLength: options.maxLength || 15,
                includeNumbers: options.numbers || false,
                includeDashes: options.dashes || false,
                filterExisting: options.filter !== false,
                saveResults: options.save !== false
            });

            if (result.success) {
                const { suggestions, stats } = result.data;
                
                console.log('🎯 Domain Generation Results:');
                console.log(`   📊 Generated: ${stats.total} suggestions`);
                console.log(`   ⭐ Average Score: ${stats.averageScore}/100`);
                console.log(`   📏 Average Length: ${stats.averageLength} chars`);
                console.log(`   🏆 High Score (80+): ${stats.highScore}`);
                console.log(`   📈 Medium Score (60-79): ${stats.mediumScore}`);
                console.log(`   📉 Low Score (<60): ${stats.lowScore}\n`);

                console.log('💎 Top Domain Suggestions:');
                suggestions
                    .sort((a, b) => b.score - a.score)
                    .slice(0, options.top || 15)
                    .forEach((suggestion, index) => {
                        const scoreColor = suggestion.score >= 80 ? '🟢' : suggestion.score >= 60 ? '🟡' : '🔴';
                        console.log(`   ${(index + 1).toString().padStart(2)}. ${scoreColor} ${suggestion.name} (Score: ${suggestion.score})`);
                        
                        if (options.detailed) {
                            console.log(`       Length: ${suggestion.length} | Memory: ${suggestion.memorability} | Brand: ${suggestion.brandability} | SEO: ${suggestion.seoValue}`);
                            if (suggestion.tags.length > 0) {
                                console.log(`       Tags: ${suggestion.tags.join(', ')}`);
                            }
                        }
                    });

                if (options.extensions) {
                    console.log('\n🌐 With popular extensions:');
                    const topSuggestion = suggestions.sort((a, b) => b.score - a.score)[0];
                    topSuggestion.extensions.forEach(ext => {
                        console.log(`   • ${topSuggestion.name}${ext}`);
                    });
                }
                
            } else {
                console.error('❌ Domain generation failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * ⚡ Hızlı domain üretimi
     */
    async quickGenerate(keyword, options = {}) {
        try {
            console.log(`⚡ Quick domain generation for: ${keyword}`);
            console.log('⏳ Please wait...\n');

            const result = await this.generateDomainUseCase.quickGenerate(keyword, options.count || 10);

            if (result.success) {
                const { suggestions } = result.data;
                
                console.log('⚡ Quick Domain Suggestions:');
                suggestions.forEach((suggestion, index) => {
                    const scoreColor = suggestion.score >= 80 ? '🟢' : suggestion.score >= 60 ? '🟡' : '🔴';
                    console.log(`   ${index + 1}. ${scoreColor} ${suggestion.name}.com (${suggestion.score}/100)`);
                });
                
            } else {
                console.error('❌ Quick generation failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 🎨 Yaratıcı domain üretimi
     */
    async creativeGenerate(keywords, options = {}) {
        try {
            console.log(`🎨 Creative domain generation for: ${keywords.join(', ')}`);
            console.log('⏳ Unleashing creativity...\n');

            const result = await this.generateDomainUseCase.creativeGenerate(keywords, options.type || 'creative');

            if (result.success) {
                const { suggestions } = result.data;
                
                console.log('🎨 Creative Domain Suggestions:');
                suggestions
                    .sort((a, b) => b.brandability - a.brandability)
                    .slice(0, 20)
                    .forEach((suggestion, index) => {
                        console.log(`   ${index + 1}. 🎨 ${suggestion.name} (Brand: ${suggestion.brandability}/100)`);
                    });
                
            } else {
                console.error('❌ Creative generation failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 💼 İş odaklı domain üretimi
     */
    async businessGenerate(keywords, options = {}) {
        try {
            console.log(`💼 Business domain generation for: ${keywords.join(', ')}`);
            console.log('⏳ Creating professional suggestions...\n');

            const result = await this.generateDomainUseCase.businessGenerate(keywords, options.industry || 'business');

            if (result.success) {
                const { suggestions } = result.data;
                
                console.log('💼 Professional Domain Suggestions:');
                suggestions
                    .filter(s => !s.hasNumbers && !s.hasDashes)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 25)
                    .forEach((suggestion, index) => {
                        console.log(`   ${index + 1}. 💼 ${suggestion.name} (Score: ${suggestion.score}/100)`);
                    });
                
            } else {
                console.error('❌ Business generation failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 🔧 Teknoloji odaklı domain üretimi
     */
    async techGenerate(keywords, options = {}) {
        try {
            console.log(`🔧 Tech domain generation for: ${keywords.join(', ')}`);
            console.log('⏳ Computing modern tech names...\n');

            const result = await this.generateDomainUseCase.techGenerate(keywords);

            if (result.success) {
                const { suggestions } = result.data;
                
                console.log('🔧 Tech Domain Suggestions:');
                suggestions
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 30)
                    .forEach((suggestion, index) => {
                        const techScore = suggestion.seoValue + suggestion.memorability;
                        console.log(`   ${index + 1}. 🔧 ${suggestion.name} (Tech: ${Math.round(techScore/2)}/100)`);
                    });
                
            } else {
                console.error('❌ Tech generation failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    /**
     * 🎲 Rastgele domain üretimi
     */
    async randomGenerate(category = 'general', options = {}) {
        try {
            console.log(`🎲 Random domain generation for category: ${category}`);
            console.log('⏳ Rolling the dice...\n');

            const result = await this.generateDomainUseCase.randomGenerate(category, options.count || 15);

            if (result.success) {
                const { suggestions } = result.data;
                
                console.log(`🎲 Random ${category.toUpperCase()} Domain Suggestions:`);
                suggestions.forEach((suggestion, index) => {
                    console.log(`   ${index + 1}. 🎲 ${suggestion.name} (${suggestion.score}/100)`);
                });
                
            } else {
                console.error('❌ Random generation failed:', result.message);
            }

        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }
}

module.exports = { DomainCommands };
