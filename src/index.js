/**
 * 📁 Clean Architecture Index
 * Tüm modüllere merkezi erişim noktası
 */

// Domain Layer
const DomainEntities = require('./domain/entities');
const DomainRepositories = require('./domain/repositories');
const DomainServices = require('./domain/services');

// Application Layer  
const ApplicationUseCases = require('./application/usecases');

// Infrastructure Layer
const InfrastructureServices = require('./infrastructure/services');
const InfrastructureRepositories = require('./infrastructure/repositories');
const InfrastructureAdapters = require('./infrastructure/adapters');

// Presentation Layer
const PresentationCLI = require('./presentation/cli');
const PresentationWeb = require('./presentation/web');

// Shared Layer
const SharedUtils = require('./shared/utils');
const SharedConstants = require('./shared/constants');
const SharedTypes = require('./shared/types');

module.exports = {
    // Domain Layer Exports
    Domain: {
        Entities: DomainEntities,
        Repositories: DomainRepositories,
        Services: DomainServices
    },

    // Application Layer Exports
    Application: {
        UseCases: ApplicationUseCases
    },

    // Infrastructure Layer Exports
    Infrastructure: {
        Services: InfrastructureServices,
        Repositories: InfrastructureRepositories,
        Adapters: InfrastructureAdapters
    },

    // Presentation Layer Exports
    Presentation: {
        CLI: PresentationCLI,
        Web: PresentationWeb
    },

    // Shared Layer Exports
    Shared: {
        Utils: SharedUtils,
        Constants: SharedConstants,
        Types: SharedTypes
    }
};
