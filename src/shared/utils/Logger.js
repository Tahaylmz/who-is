/**
 * Logger Utility - Shared Layer
 * Provides logging functionality across the application
 */
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

class Logger {
    constructor(options = {}) {
        this.logLevel = options.logLevel || 'info';
        this.logToFile = options.logToFile || false;
        this.logFilePath = options.logFilePath || path.join(process.cwd(), 'logs', 'app.log');
        this.enableColors = options.enableColors !== false;
        
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4
        };
    }

    /**
     * Log error message
     */
    error(message, data = null) {
        this.log('error', message, data);
    }

    /**
     * Log warning message
     */
    warn(message, data = null) {
        this.log('warn', message, data);
    }

    /**
     * Log info message
     */
    info(message, data = null) {
        this.log('info', message, data);
    }

    /**
     * Log debug message
     */
    debug(message, data = null) {
        this.log('debug', message, data);
    }

    /**
     * Log trace message
     */
    trace(message, data = null) {
        this.log('trace', message, data);
    }

    /**
     * Main log method
     */
    log(level, message, data = null) {
        if (this.levels[level] > this.levels[this.logLevel]) {
            return;
        }

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            data
        };

        // Console output
        this.outputToConsole(logEntry);

        // File output
        if (this.logToFile) {
            this.outputToFile(logEntry);
        }
    }

    /**
     * Output log entry to console
     */
    outputToConsole(logEntry) {
        const { timestamp, level, message, data } = logEntry;
        const timeStr = timestamp.substring(11, 19); // HH:MM:SS
        
        let coloredLevel = level;
        if (this.enableColors) {
            switch (level) {
                case 'ERROR':
                    coloredLevel = chalk.red(level);
                    break;
                case 'WARN':
                    coloredLevel = chalk.yellow(level);
                    break;
                case 'INFO':
                    coloredLevel = chalk.blue(level);
                    break;
                case 'DEBUG':
                    coloredLevel = chalk.gray(level);
                    break;
                case 'TRACE':
                    coloredLevel = chalk.gray(level);
                    break;
            }
        }

        let output = `[${timeStr}] ${coloredLevel}: ${message}`;
        
        if (data) {
            output += '\n' + (typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
        }

        console.log(output);
    }

    /**
     * Output log entry to file
     */
    async outputToFile(logEntry) {
        try {
            // Ensure log directory exists
            const logDir = path.dirname(this.logFilePath);
            await fs.mkdir(logDir, { recursive: true });

            const logLine = JSON.stringify(logEntry) + '\n';
            await fs.appendFile(this.logFilePath, logLine);
        } catch (error) {
            console.error('Failed to write to log file:', error.message);
        }
    }

    /**
     * Create a child logger with additional context
     */
    child(context) {
        return new ChildLogger(this, context);
    }

    /**
     * Set log level
     */
    setLevel(level) {
        if (this.levels.hasOwnProperty(level)) {
            this.logLevel = level;
        }
    }

    /**
     * Clear log file
     */
    async clearLogFile() {
        if (this.logToFile) {
            try {
                await fs.writeFile(this.logFilePath, '');
                this.info('Log file cleared');
            } catch (error) {
                this.error('Failed to clear log file', error.message);
            }
        }
    }

    /**
     * Get recent log entries from file
     */
    async getRecentLogs(lines = 100) {
        if (!this.logToFile) {
            return [];
        }

        try {
            const content = await fs.readFile(this.logFilePath, 'utf8');
            const logLines = content.trim().split('\n').filter(line => line);
            const recentLines = logLines.slice(-lines);
            
            return recentLines.map(line => {
                try {
                    return JSON.parse(line);
                } catch {
                    return { message: line, level: 'INFO', timestamp: new Date().toISOString() };
                }
            });
        } catch (error) {
            this.error('Failed to read log file', error.message);
            return [];
        }
    }
}

/**
 * Child Logger with additional context
 */
class ChildLogger {
    constructor(parent, context) {
        this.parent = parent;
        this.context = context;
    }

    error(message, data = null) {
        this.parent.error(`[${this.context}] ${message}`, data);
    }

    warn(message, data = null) {
        this.parent.warn(`[${this.context}] ${message}`, data);
    }

    info(message, data = null) {
        this.parent.info(`[${this.context}] ${message}`, data);
    }

    debug(message, data = null) {
        this.parent.debug(`[${this.context}] ${message}`, data);
    }

    trace(message, data = null) {
        this.parent.trace(`[${this.context}] ${message}`, data);
    }
}

// Create default logger instance
const logger = new Logger({
    logLevel: process.env.LOG_LEVEL || 'info',
    logToFile: process.env.LOG_TO_FILE === 'true',
    enableColors: process.env.NO_COLOR !== 'true'
});

module.exports = { Logger, logger };
