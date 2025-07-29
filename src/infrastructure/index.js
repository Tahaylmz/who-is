/**
 * 🔧 Infrastructure Layer Index
 * Dış bağımlılıkların merkezi export'u
 */

// Services
const HttpSiteChecker = require('./services/HttpSiteChecker');
const OpenAIDomainGenerator = require('./services/OpenAIDomainGenerator');

// Repositories
const FileDomainRepository = require('./repositories/FileDomainRepository');

module.exports = {
    Services: {
        HttpSiteChecker,
        OpenAIDomainGenerator
    },
    Repositories: {
        FileDomainRepository
    }
};
