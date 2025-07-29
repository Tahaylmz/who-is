const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../config/extensions.json');

class ExtensionConfig {
    constructor() {
        this.loadConfig();
    }

    loadConfig() {
        try {
            const data = fs.readFileSync(CONFIG_PATH, 'utf8');
            this.config = JSON.parse(data);
        } catch (error) {
            // Eğer config dosyası yoksa varsayılan oluştur
            this.config = {
                extensions: ['.com'],
                availableExtensions: [
                    '.com', '.com.tr', '.net', '.org', '.info', '.biz',
                    '.co', '.io', '.dev', '.app', '.tech', '.online'
                ]
            };
            this.saveConfig();
        }
    }

    saveConfig() {
        try {
            const configDir = path.dirname(CONFIG_PATH);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Konfigürasyon kaydedilemedi:', error.message);
        }
    }

    getActiveExtensions() {
        return this.config.extensions || ['.com'];
    }

    getAvailableExtensions() {
        return this.config.availableExtensions || ['.com'];
    }

    setActiveExtensions(extensions) {
        // Sadece mevcut uzantıları kabul et
        const validExtensions = extensions.filter(ext =>
            this.config.availableExtensions.includes(ext)
        );

        if (validExtensions.length === 0) {
            throw new Error('Geçerli uzantı bulunamadı');
        }

        this.config.extensions = validExtensions;
        this.saveConfig();
        return validExtensions;
    }

    addExtension(extension) {
        if (!this.config.availableExtensions.includes(extension)) {
            throw new Error(`${extension} desteklenmediği için eklenemedi`);
        }

        if (!this.config.extensions.includes(extension)) {
            this.config.extensions.push(extension);
            this.saveConfig();
        }

        return this.config.extensions;
    }

    removeExtension(extension) {
        const index = this.config.extensions.indexOf(extension);
        if (index > -1) {
            this.config.extensions.splice(index, 1);

            // En az bir uzantı kalmalı
            if (this.config.extensions.length === 0) {
                this.config.extensions = ['.com'];
            }

            this.saveConfig();
        }

        return this.config.extensions;
    }

    resetToDefault() {
        this.config.extensions = ['.com'];
        this.saveConfig();
        return this.config.extensions;
    }

    getConfigAsJson() {
        return JSON.stringify(this.config, null, 2);
    }
}

module.exports = ExtensionConfig;
