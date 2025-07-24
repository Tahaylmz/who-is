const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

// CLI komutlarını çalıştırmak için yardımcı fonksiyon
function runCliCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', ['index.js', command, ...args], {
            cwd: __dirname,
            stdio: 'pipe'
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(new Error(stderr || `Command failed with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Site kontrolü API'leri
app.post('/api/check-site', async (req, res) => {
    try {
        const { site, timeout } = req.body;
        const args = [site];
        if (timeout) args.push('--timeout', timeout);
        
        const result = await runCliCommand('check', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/check-bulk', async (req, res) => {
    try {
        const { sites, concurrency, timeout } = req.body;
        
        // Geçici dosya oluştur
        const tempFile = path.join(__dirname, 'temp-sites.txt');
        await fs.writeFile(tempFile, sites.join('\n'));
        
        const args = [tempFile];
        if (concurrency) args.push('--concurrency', concurrency);
        if (timeout) args.push('--timeout', timeout);
        
        const result = await runCliCommand('check-list', args);
        
        // Geçici dosyayı sil
        await fs.unlink(tempFile);
        
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Domain kontrol API'leri
app.post('/api/check-domain', async (req, res) => {
    try {
        const { domain, extensions } = req.body;
        const args = [domain];
        if (extensions) args.push('--extensions', extensions);
        
        const result = await runCliCommand('check-domain', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/check-availability', async (req, res) => {
    try {
        const { domain, extensions } = req.body;
        const args = [domain];
        if (extensions) args.push('--extensions', extensions);
        
        const result = await runCliCommand('check-availability', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// AI Domain Generation API'leri
app.post('/api/ai-suggest', async (req, res) => {
    try {
        const { description, count, premium } = req.body;
        const args = [description];
        if (count) args.push('--count', count);
        if (premium) args.push('--premium');
        
        const result = await runCliCommand('ai-suggest', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/ai-batch', async (req, res) => {
    try {
        const { keywords, count } = req.body;
        const args = [keywords];
        if (count) args.push('--count', count);
        
        const result = await runCliCommand('ai-batch', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Trend Analysis API'leri
app.get('/api/trend-analysis', async (req, res) => {
    try {
        const result = await runCliCommand('trend-analysis');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/trend-domains', async (req, res) => {
    try {
        const { count, trend } = req.body;
        const args = [];
        if (count) args.push('--count', count);
        if (trend) args.push('--trend', trend);
        
        const result = await runCliCommand('trend-domains', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Market Analysis API'leri
app.post('/api/market-analysis', async (req, res) => {
    try {
        const { domains, detailed } = req.body;
        const args = domains;
        if (detailed) args.push('--detailed');
        
        const result = await runCliCommand('market-analysis', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Domain Hunt API'leri
app.post('/api/hunt-start', async (req, res) => {
    try {
        const { categories, extensions, limit, interval } = req.body;
        const args = [];
        if (categories && categories.length > 0) {
            args.push('--categories', categories.join(','));
        }
        if (extensions) args.push('--extensions', extensions);
        if (limit) args.push('--limit', limit);
        if (interval) args.push('--interval', interval);
        
        // Hunt işlemini başlat (background)
        const child = spawn('node', ['index.js', 'hunt', ...args], {
            cwd: __dirname,
            detached: true,
            stdio: 'ignore'
        });
        
        child.unref();
        
        res.json({ success: true, huntId: child.pid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/hunt-stats', async (req, res) => {
    try {
        const result = await runCliCommand('hunt-stats');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/hunt-clear', async (req, res) => {
    try {
        const result = await runCliCommand('hunt-clear', ['--yes']);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Configuration API'leri
app.get('/api/config', async (req, res) => {
    try {
        const result = await runCliCommand('domain-config-show');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/config/hyphens', async (req, res) => {
    try {
        const { allow } = req.body;
        const result = await runCliCommand('domain-config-hyphens', [allow.toString()]);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/config/numbers', async (req, res) => {
    try {
        const { allow, position } = req.body;
        const args = [allow.toString()];
        if (position) args.push(position);
        
        const result = await runCliCommand('domain-config-numbers', args);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/config/length', async (req, res) => {
    try {
        const { maxLength } = req.body;
        const result = await runCliCommand('domain-config-length', [maxLength.toString()]);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/config/test', async (req, res) => {
    try {
        const { domain } = req.body;
        const result = await runCliCommand('domain-config-test', [domain]);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/config/reset', async (req, res) => {
    try {
        const result = await runCliCommand('domain-config-reset');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Monitor API'leri
app.post('/api/monitor', async (req, res) => {
    try {
        const { sites, interval } = req.body;
        
        // Geçici dosya oluştur
        const tempFile = path.join(__dirname, 'temp-monitor.txt');
        await fs.writeFile(tempFile, sites.join('\n'));
        
        const args = [tempFile];
        if (interval) args.push('--interval', interval);
        
        // Monitor işlemini başlat (background)
        const child = spawn('node', ['index.js', 'monitor', ...args], {
            cwd: __dirname,
            detached: true,
            stdio: 'ignore'
        });
        
        child.unref();
        
        res.json({ success: true, monitorId: child.pid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Domain results API'si
app.get('/api/results/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const filePath = path.join(__dirname, 'domain-results', `${category}-domains.txt`);
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            res.json({ success: true, results: lines });
        } catch (error) {
            res.json({ success: true, results: [] });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
    });
});

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ success: false, error: 'API endpoint not found' });
    } else {
        res.redirect('/');
    }
});

// Server başlat
app.listen(PORT, () => {
    console.log(`
🚀 Who-Is Web Dashboard Started!

📍 URL: http://localhost:${PORT}
📊 Dashboard: Complete web interface for all features
🤖 AI Integration: OpenAI-powered domain suggestions
📈 Trend Analysis: 2025 technology predictions
💰 Market Analysis: Domain value estimation
⚙️ Configuration: Domain generation settings
🔍 Domain Hunt: Automated domain discovery
📱 Responsive: Works on desktop, tablet, and mobile

Features Available:
✅ Site Status Checking
✅ Domain Availability Check
✅ AI Domain Generation
✅ Trend Analysis & Predictions
✅ Market Value Estimation
✅ Domain Hunt with Real-time Stats
✅ Configuration Management
✅ Bulk Operations
✅ Real-time Monitoring

Ready to explore domains! 🌐
    `);
});

module.exports = app;
