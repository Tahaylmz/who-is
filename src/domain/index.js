/**
 * 🏛️ Domain Layer Index
 * İş mantığı ve kuralların merkezi export'u
 */

// Entities
const SiteEntity = require('./entities/SiteEntity');
const DomainEntity = require('./entities/DomainEntity');

// Repositories (Interfaces)
const ISiteRepository = require('./repositories/ISiteRepository');
const IDomainRepository = require('./repositories/IDomainRepository');

// Services
const DomainValidationService = require('./services/DomainValidationService');

module.exports = {
    Entities: {
        SiteEntity,
        DomainEntity
    },
    Repositories: {
        ISiteRepository,
        IDomainRepository
    },
    Services: {
        DomainValidationService
    }
};
