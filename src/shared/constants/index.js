/**
 * Application Constants
 */

// Site Status Constants
const SITE_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    PENDING: 'pending',
    ERROR: 'error'
};

// Domain Availability Constants
const DOMAIN_AVAILABILITY = {
    AVAILABLE: 'available',
    TAKEN: 'taken',
    UNKNOWN: 'unknown',
    ERROR: 'error'
};

// Hunt Session Status Constants
const HUNT_STATUS = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Domain Categories
const DOMAIN_CATEGORIES = {
    ULTRA_SHORT: 'ultra-short',
    SHORT: 'short',
    BRANDABLE: 'brandable',
    NUMERIC: 'numeric',
    HYPHENATED: 'hyphenated',
    MIXED: 'mixed',
    STANDARD: 'standard'
};

// Premium Extensions
const PREMIUM_EXTENSIONS = [
    '.com', '.net', '.org', '.io', '.co', '.ai', '.app', '.tech', '.dev'
];

// Default Extensions
const DEFAULT_EXTENSIONS = [
    '.com', '.net', '.org', '.io', '.co'
];

// Hunting Categories
const HUNTING_CATEGORIES = [
    'premium',
    'tech',
    'business',
    'creative',
    'health',
    'ecommerce',
    'short',
    'numbers'
];

// AI Sectors
const AI_SECTORS = [
    'tech',
    'business',
    'creative',
    'health',
    'education',
    'ecommerce',
    'finance',
    'startup'
];

// HTTP Status Code Ranges
const HTTP_STATUS = {
    SUCCESS: { min: 200, max: 299 },
    REDIRECT: { min: 300, max: 399 },
    CLIENT_ERROR: { min: 400, max: 499 },
    SERVER_ERROR: { min: 500, max: 599 }
};

// Default Timeouts (milliseconds)
const TIMEOUTS = {
    SITE_CHECK: 5000,
    DOMAIN_CHECK: 10000,
    AI_REQUEST: 30000,
    HUNT_INTERVAL: 2000
};

// Default Limits
const LIMITS = {
    CONCURRENT_CHECKS: 10,
    MAX_HUNT_LIMIT: 1000,
    MAX_WORD_HUNT_LIMIT: 100,
    MAX_AI_SUGGESTIONS: 50
};

// Quality Score Thresholds
const QUALITY_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 75,
    FAIR: 60,
    POOR: 40
};

// Value Category Thresholds (USD)
const VALUE_THRESHOLDS = {
    ULTRA_PREMIUM: 100000,
    PREMIUM_PLUS: 50000,
    PREMIUM: 10000,
    HIGH_VALUE: 5000,
    GOOD_VALUE: 1000,
    AVERAGE: 500,
    BASIC: 100
};

// File Paths
const FILE_PATHS = {
    CONFIG: './config',
    DOMAIN_RESULTS: './domain-results',
    LOGS: './logs'
};

// Configuration Keys
const CONFIG_KEYS = {
    ACTIVE_EXTENSIONS: 'activeExtensions',
    HUNT_SETTINGS: 'huntSettings',
    AI_SETTINGS: 'aiSettings',
    DEFAULT_TIMEOUT: 'defaultTimeout',
    CONCURRENCY: 'concurrency'
};

// Error Messages
const ERROR_MESSAGES = {
    INVALID_URL: 'Invalid URL format',
    INVALID_DOMAIN: 'Invalid domain name',
    INVALID_EXTENSION: 'Invalid extension format',
    NETWORK_ERROR: 'Network connection error',
    TIMEOUT_ERROR: 'Request timeout',
    DNS_ERROR: 'DNS resolution failed',
    SSL_ERROR: 'SSL certificate error',
    RATE_LIMIT: 'Rate limit exceeded',
    AI_ERROR: 'AI service unavailable',
    CONFIG_ERROR: 'Configuration error'
};

// Success Messages
const SUCCESS_MESSAGES = {
    SITE_ONLINE: 'Site is online',
    DOMAIN_AVAILABLE: 'Domain is available',
    HUNT_COMPLETED: 'Hunt session completed',
    CONFIG_UPDATED: 'Configuration updated',
    DATA_SAVED: 'Data saved successfully'
};

// Color Codes for CLI
const COLORS = {
    SUCCESS: '#28a745',
    ERROR: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    PRIMARY: '#007bff',
    SECONDARY: '#6c757d'
};

// Word Hunt Strategies
const WORD_HUNT_STRATEGIES = [
    'exact',
    'prefix',
    'suffix',
    'compound',
    'synonyms',
    'related',
    'acronym',
    'variations'
];

// Domain Generation Patterns
const GENERATION_PATTERNS = {
    VOWEL_CONSONANT: /^[aeiou][bcdfghjklmnpqrstvwxyz]/i,
    CONSONANT_VOWEL: /^[bcdfghjklmnpqrstvwxyz][aeiou]/i,
    ALTERNATING: /^([bcdfghjklmnpqrstvwxyz][aeiou])+$/i
};

module.exports = {
    SITE_STATUS,
    DOMAIN_AVAILABILITY,
    HUNT_STATUS,
    DOMAIN_CATEGORIES,
    PREMIUM_EXTENSIONS,
    DEFAULT_EXTENSIONS,
    HUNTING_CATEGORIES,
    AI_SECTORS,
    HTTP_STATUS,
    TIMEOUTS,
    LIMITS,
    QUALITY_THRESHOLDS,
    VALUE_THRESHOLDS,
    FILE_PATHS,
    CONFIG_KEYS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    COLORS,
    WORD_HUNT_STRATEGIES,
    GENERATION_PATTERNS
};
