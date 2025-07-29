/**
 * File Helper Utility - Shared Layer
 * Provides file operations across the application
 */
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('./Logger');

class FileHelper {
    /**
     * Ensure directory exists
     * @param {string} dirPath - Directory path
     * @returns {Promise<boolean>} Success status
     */
    static async ensureDirectory(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
            return true;
        } catch (error) {
            logger.error('Failed to create directory', { dirPath, error: error.message });
            return false;
        }
    }

    /**
     * Read JSON file
     * @param {string} filePath - File path
     * @param {*} defaultValue - Default value if file doesn't exist
     * @returns {Promise<*>} File content or default value
     */
    static async readJSON(filePath, defaultValue = null) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.debug('File not found, returning default value', { filePath });
                return defaultValue;
            }
            logger.error('Failed to read JSON file', { filePath, error: error.message });
            throw error;
        }
    }

    /**
     * Write JSON file
     * @param {string} filePath - File path
     * @param {*} data - Data to write
     * @param {Object} options - Write options
     * @returns {Promise<boolean>} Success status
     */
    static async writeJSON(filePath, data, options = {}) {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await this.ensureDirectory(dir);

            const jsonData = JSON.stringify(data, null, options.indent || 2);
            await fs.writeFile(filePath, jsonData, 'utf8');
            
            logger.debug('JSON file written successfully', { filePath });
            return true;
        } catch (error) {
            logger.error('Failed to write JSON file', { filePath, error: error.message });
            return false;
        }
    }

    /**
     * Read text file
     * @param {string} filePath - File path
     * @param {string} encoding - File encoding
     * @returns {Promise<string|null>} File content or null
     */
    static async readText(filePath, encoding = 'utf8') {
        try {
            return await fs.readFile(filePath, encoding);
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.debug('File not found', { filePath });
                return null;
            }
            logger.error('Failed to read text file', { filePath, error: error.message });
            throw error;
        }
    }

    /**
     * Write text file
     * @param {string} filePath - File path
     * @param {string} content - Content to write
     * @param {Object} options - Write options
     * @returns {Promise<boolean>} Success status
     */
    static async writeText(filePath, content, options = {}) {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await this.ensureDirectory(dir);

            await fs.writeFile(filePath, content, options.encoding || 'utf8');
            
            logger.debug('Text file written successfully', { filePath });
            return true;
        } catch (error) {
            logger.error('Failed to write text file', { filePath, error: error.message });
            return false;
        }
    }

    /**
     * Append to text file
     * @param {string} filePath - File path
     * @param {string} content - Content to append
     * @param {Object} options - Append options
     * @returns {Promise<boolean>} Success status
     */
    static async appendText(filePath, content, options = {}) {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await this.ensureDirectory(dir);

            await fs.appendFile(filePath, content, options.encoding || 'utf8');
            return true;
        } catch (error) {
            logger.error('Failed to append to text file', { filePath, error: error.message });
            return false;
        }
    }

    /**
     * Check if file exists
     * @param {string} filePath - File path
     * @returns {Promise<boolean>} File exists status
     */
    static async exists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Delete file
     * @param {string} filePath - File path
     * @returns {Promise<boolean>} Success status
     */
    static async delete(filePath) {
        try {
            await fs.unlink(filePath);
            logger.debug('File deleted successfully', { filePath });
            return true;
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.debug('File not found for deletion', { filePath });
                return true; // Consider it success if file doesn't exist
            }
            logger.error('Failed to delete file', { filePath, error: error.message });
            return false;
        }
    }

    /**
     * Get file stats
     * @param {string} filePath - File path
     * @returns {Promise<Object|null>} File stats or null
     */
    static async getStats(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory()
            };
        } catch (error) {
            logger.error('Failed to get file stats', { filePath, error: error.message });
            return null;
        }
    }

    /**
     * List directory contents
     * @param {string} dirPath - Directory path
     * @param {Object} options - List options
     * @returns {Promise<string[]>} Directory contents
     */
    static async listDirectory(dirPath, options = {}) {
        try {
            const items = await fs.readdir(dirPath);
            
            if (options.filesOnly) {
                const files = [];
                for (const item of items) {
                    const itemPath = path.join(dirPath, item);
                    const stats = await fs.stat(itemPath);
                    if (stats.isFile()) {
                        files.push(item);
                    }
                }
                return files;
            }
            
            return items;
        } catch (error) {
            logger.error('Failed to list directory', { dirPath, error: error.message });
            return [];
        }
    }

    /**
     * Copy file
     * @param {string} source - Source file path
     * @param {string} destination - Destination file path
     * @returns {Promise<boolean>} Success status
     */
    static async copy(source, destination) {
        try {
            // Ensure destination directory exists
            const dir = path.dirname(destination);
            await this.ensureDirectory(dir);

            await fs.copyFile(source, destination);
            logger.debug('File copied successfully', { source, destination });
            return true;
        } catch (error) {
            logger.error('Failed to copy file', { source, destination, error: error.message });
            return false;
        }
    }

    /**
     * Move file
     * @param {string} source - Source file path
     * @param {string} destination - Destination file path
     * @returns {Promise<boolean>} Success status
     */
    static async move(source, destination) {
        try {
            // Ensure destination directory exists
            const dir = path.dirname(destination);
            await this.ensureDirectory(dir);

            await fs.rename(source, destination);
            logger.debug('File moved successfully', { source, destination });
            return true;
        } catch (error) {
            logger.error('Failed to move file', { source, destination, error: error.message });
            return false;
        }
    }

    /**
     * Read lines from file
     * @param {string} filePath - File path
     * @param {Object} options - Read options
     * @returns {Promise<string[]>} File lines
     */
    static async readLines(filePath, options = {}) {
        try {
            const content = await this.readText(filePath);
            if (!content) return [];

            let lines = content.split('\n').map(line => line.trim());
            
            if (options.filterEmpty) {
                lines = lines.filter(line => line.length > 0);
            }
            
            if (options.filterComments) {
                lines = lines.filter(line => !line.startsWith('#'));
            }
            
            return lines;
        } catch (error) {
            logger.error('Failed to read lines from file', { filePath, error: error.message });
            return [];
        }
    }

    /**
     * Write lines to file
     * @param {string} filePath - File path
     * @param {string[]} lines - Lines to write
     * @param {Object} options - Write options
     * @returns {Promise<boolean>} Success status
     */
    static async writeLines(filePath, lines, options = {}) {
        const separator = options.separator || '\n';
        const content = lines.join(separator);
        return await this.writeText(filePath, content, options);
    }

    /**
     * Get file size in human readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Human readable size
     */
    static formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Clean old files from directory
     * @param {string} dirPath - Directory path
     * @param {number} maxAgeMs - Maximum age in milliseconds
     * @returns {Promise<number>} Number of deleted files
     */
    static async cleanOldFiles(dirPath, maxAgeMs) {
        try {
            const items = await fs.readdir(dirPath);
            let deletedCount = 0;
            
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const stats = await fs.stat(itemPath);
                
                if (stats.isFile() && (Date.now() - stats.mtime.getTime() > maxAgeMs)) {
                    if (await this.delete(itemPath)) {
                        deletedCount++;
                    }
                }
            }
            
            logger.info('Cleaned old files', { dirPath, deletedCount });
            return deletedCount;
        } catch (error) {
            logger.error('Failed to clean old files', { dirPath, error: error.message });
            return 0;
        }
    }
}

module.exports = FileHelper;
