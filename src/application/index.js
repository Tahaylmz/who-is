/**
 * 💼 Application Layer Index
 * Use case'lerin merkezi export'u
 */

// Use Cases
const { CheckSiteUseCase } = require('./usecases/CheckSiteUseCase');
const { GenerateDomainUseCase } = require('./usecases/GenerateDomainUseCase');
const { HuntDomainUseCase } = require('./usecases/HuntDomainUseCase');

module.exports = {
    UseCases: {
        CheckSiteUseCase,
        GenerateDomainUseCase,
        HuntDomainUseCase
    }
};
