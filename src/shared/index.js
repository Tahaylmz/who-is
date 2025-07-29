/**
 * 🔧 Shared Layer Index
 * Ortak yardımcıların merkezi export'u
 */

// Utils
const Logger = require('./utils/Logger');
const FileHelper = require('./utils/FileHelper');
const DomainGenerationConfig = require('./utils/domainGenerationConfig');
const ExtensionConfig = require('./utils/extensionConfig');
const Display = require('./utils/display');

// Constants
const Constants = require('./constants');

// Types
const Types = require('./types');

module.exports = {
    Utils: {
        Logger,
        FileHelper,
        DomainGenerationConfig,
        ExtensionConfig,
        Display
    },
    Constants,
    Types
};
