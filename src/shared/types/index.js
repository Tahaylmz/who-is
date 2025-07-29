/**
 * Application Types
 * TypeScript-style type definitions for JavaScript
 */

/**
 * @typedef {Object} SiteCheckOptions
 * @property {number} [timeout=5000] - Request timeout in milliseconds
 * @property {string} [userAgent] - Custom user agent string
 * @property {boolean} [followRedirects=true] - Follow HTTP redirects
 * @property {Object} [headers] - Custom headers
 */

/**
 * @typedef {Object} SiteCheckResult
 * @property {string} url - The checked URL
 * @property {string} status - Site status (online|offline|error)
 * @property {number|null} responseTime - Response time in milliseconds
 * @property {number|null} statusCode - HTTP status code
 * @property {string|null} error - Error message if any
 * @property {Date} timestamp - Check timestamp
 * @property {Object} [headers] - Response headers
 */

/**
 * @typedef {Object} DomainCheckOptions
 * @property {string[]} [extensions] - Extensions to check
 * @property {number} [timeout=10000] - Request timeout
 * @property {boolean} [checkAvailability=false] - Check WHOIS availability
 * @property {boolean} [includeValue=false] - Include value estimation
 */

/**
 * @typedef {Object} DomainCheckResult
 * @property {string} name - Domain name without extension
 * @property {string} extension - Domain extension
 * @property {string} fullDomain - Complete domain name
 * @property {boolean|null} isAvailable - Availability status
 * @property {string|null} registrar - Domain registrar
 * @property {Date|null} creationDate - Domain creation date
 * @property {Date|null} expirationDate - Domain expiration date
 * @property {number|null} value - Estimated value
 * @property {number|null} qualityScore - Quality score (0-100)
 * @property {string} category - Domain category
 */

/**
 * @typedef {Object} HuntOptions
 * @property {string[]} [categories] - Hunting categories
 * @property {string[]} [extensions] - Extensions to check
 * @property {string|null} [sector] - Target sector
 * @property {boolean} [useAI=false] - Use AI generation
 * @property {number} [interval=2000] - Check interval in milliseconds
 * @property {number} [limit=0] - Maximum checks (0 = unlimited)
 * @property {number} [concurrency=10] - Concurrent checks
 */

/**
 * @typedef {Object} HuntStatistics
 * @property {number} totalChecked - Total domains checked
 * @property {number} availableFound - Available domains found
 * @property {number} premiumFound - Premium domains found
 * @property {number} shortFound - Short domains found
 * @property {number} errorCount - Number of errors
 * @property {number} averageResponseTime - Average response time
 * @property {Date|null} lastCheckTime - Last check timestamp
 */

/**
 * @typedef {Object} WordHuntOptions
 * @property {number} [limit=50] - Maximum combinations to check
 * @property {string[]} [extensions] - Extensions to check
 * @property {number} [minLength=3] - Minimum domain length
 * @property {number} [maxLength=15] - Maximum domain length
 * @property {boolean} [useAI=true] - Use AI suggestions
 * @property {boolean} [useNumbers=true] - Include numbers
 * @property {boolean} [useHyphens=true] - Include hyphens
 * @property {boolean} [save=false] - Save results to file
 */

/**
 * @typedef {Object} AIGenerationOptions
 * @property {string} [sector='tech'] - Target sector
 * @property {number} [count=10] - Number of suggestions
 * @property {number} [minLength=4] - Minimum length
 * @property {number} [maxLength=12] - Maximum length
 * @property {boolean} [checkAvailability=false] - Check availability
 * @property {boolean} [includeAnalysis=false] - Include quality analysis
 * @property {string} [model='gpt-3.5-turbo'] - AI model to use
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Validation result
 * @property {string[]} errors - Validation errors
 * @property {string[]} warnings - Validation warnings
 */

/**
 * @typedef {Object} BrandabilityAnalysis
 * @property {number} score - Brandability score (0-100)
 * @property {string} grade - Letter grade (A+, A, B, C, D, F)
 * @property {Object} factors - Individual factor scores
 * @property {string[]} recommendations - Improvement recommendations
 */

/**
 * @typedef {Object} SEOAnalysis
 * @property {number} score - SEO score (0-100)
 * @property {string} grade - Letter grade
 * @property {Object} factors - SEO factors breakdown
 * @property {boolean} isSEOFriendly - Overall SEO friendliness
 */

/**
 * @typedef {Object} ValuationResult
 * @property {number} estimatedValue - Estimated market value
 * @property {Object} factors - Valuation factors breakdown
 * @property {number} confidence - Confidence percentage
 * @property {Object} valueRange - Value range (low, high, estimated)
 * @property {string} category - Value category
 */

/**
 * @typedef {Object} MonitorOptions
 * @property {number} [interval=60] - Check interval in seconds
 * @property {number} [concurrency=10] - Concurrent checks
 * @property {number} [timeout=5000] - Request timeout
 * @property {boolean} [continuous=true] - Continuous monitoring
 * @property {string[]} [alertConditions] - Alert conditions
 */

/**
 * @typedef {Object} ConfigurationOptions
 * @property {string[]} activeExtensions - Active extension list
 * @property {Object} huntSettings - Hunt configuration
 * @property {Object} aiSettings - AI configuration
 * @property {number} defaultTimeout - Default timeout value
 * @property {number} concurrency - Default concurrency
 */

/**
 * @typedef {Object} FileOperationResult
 * @property {boolean} success - Operation success
 * @property {string|null} error - Error message if any
 * @property {*} data - Operation result data
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Request success
 * @property {*} data - Response data
 * @property {string|null} error - Error message
 * @property {number} timestamp - Response timestamp
 */

/**
 * @typedef {Object} CLICommandOptions
 * @property {string} command - Command name
 * @property {string[]} args - Command arguments
 * @property {Object} flags - Command flags
 */

module.exports = {
    // Types are exported for JSDoc purposes
    // In TypeScript, these would be actual type definitions
};
