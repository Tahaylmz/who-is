// Global Variables
let huntInterval = null;
let huntStats = {
    checked: 0,
    available: 0,
    total: 0
};

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    loadStats();
    initializeEventListeners();
    initializeTheme();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const themeIcon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.style.color = async function simulateDomainValidation(domain) {
            await new Promise(resolve => setTimeout(resolve, 300));

            // Domain'den uzantıyı çıkararak ana domain uzunluğunu hesapla
            const mainDomain = domain.includes('.') ? domain.split('.')[0] : domain;

            const issues = [];
            if (mainDomain.includes('-')) issues.push('Contains hyphens');
            if (/\d/.test(mainDomain)) issues.push('Contains numbers');
            if (mainDomain.length > 15) issues.push('Too long');

            return {
                domain,
                isValid: issues.length === 0,
                qualityScore: Math.max(100 - (issues.length * 25), 0),
                issues
            };
        } else {
            themeIcon.className = 'fas fa-moon';
            themeIcon.style.color = '#6366f1';
        }
    }

    // Tab Management
    function initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    // Event Listeners
    function initializeEventListeners() {
        // Enter key listeners for inputs
        document.getElementById('siteInput').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkSite();
        });

        document.getElementById('aiDescription').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') generateAIDomains();
        });

        document.getElementById('marketDomains').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') analyzeMarket();
        });
    }

    // Load Statistics
    function loadStats() {
        // Load from localStorage or set defaults
        const stats = JSON.parse(localStorage.getItem('whoIsStats')) || {
            totalChecks: 0,
            onlineSites: 0,
            availableDomains: 0
        };

        document.getElementById('totalChecks').textContent = stats.totalChecks;
        document.getElementById('onlineSites').textContent = stats.onlineSites;
        document.getElementById('availableDomains').textContent = stats.availableDomains;
    }

    // Update Statistics
    function updateStats(type, increment = 1) {
        const stats = JSON.parse(localStorage.getItem('whoIsStats')) || {
            totalChecks: 0,
            onlineSites: 0,
            availableDomains: 0
        };

        stats[type] += increment;
        localStorage.setItem('whoIsStats', JSON.stringify(stats));
        loadStats();
    }

    // Utility Functions
    function showLoading() {
        document.getElementById('loadingSpinner').classList.add('show');
    }

    function hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('show');
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

        document.getElementById('toastContainer').appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    // Add slideOut animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideOut {
        to { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
        }
    }
`;
    document.head.appendChild(style);

    function getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    function getQualityClass(score) {
        if (score >= 90) return 'quality-excellent';
        if (score >= 75) return 'quality-good';
        if (score >= 60) return 'quality-average';
        return 'quality-poor';
    }

    function formatResponseTime(time) {
        return time ? `${time}ms` : 'N/A';
    }

    // Site Check Functions
    async function checkSite() {
        const siteInput = document.getElementById('siteInput');
        const site = siteInput.value.trim();

        if (!site) {
            showToast('Please enter a site URL', 'warning');
            return;
        }

        showLoading();

        try {
            const result = await simulateSiteCheck(site);
            displaySiteResult(result);
            updateStats('totalChecks');
            if (result.status === 'online') {
                updateStats('onlineSites');
            }
            showToast(`Site check completed for ${site}`, 'success');
        } catch (error) {
            showToast(`Error checking ${site}: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }

    async function checkBulkSites() {
        const bulkSites = document.getElementById('bulkSites').value.trim();

        if (!bulkSites) {
            showToast('Please enter sites to check', 'warning');
            return;
        }

        const sites = bulkSites.split('\n')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('#'));

        if (sites.length === 0) {
            showToast('No valid sites found', 'warning');
            return;
        }

        showLoading();
        const resultsContainer = document.getElementById('siteResults');
        resultsContainer.innerHTML = '<h3>Checking sites...</h3>';

        let onlineCount = 0;

        for (const site of sites) {
            try {
                const result = await simulateSiteCheck(site);
                displaySiteResult(result, false);
                updateStats('totalChecks');
                if (result.status === 'online') {
                    onlineCount++;
                    updateStats('onlineSites');
                }

                // Small delay between requests
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`Error checking ${site}:`, error);
            }
        }

        hideLoading();
        showToast(`Bulk check completed: ${onlineCount}/${sites.length} sites online`, 'success');
    }

    function displaySiteResult(result, clear = true) {
        const resultsContainer = document.getElementById('siteResults');

        if (clear) {
            resultsContainer.innerHTML = '';
        }

        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
        <div class="result-info">
            <div class="result-domain">${result.url}</div>
            <div class="result-details">
                Response: ${formatResponseTime(result.responseTime)} | 
                Status: ${result.statusCode || 'N/A'} | 
                Server: ${result.server || 'Unknown'}
            </div>
        </div>
        <div class="result-status status-${result.status}">
            <i class="fas fa-${result.status === 'online' ? 'check' : 'times'}"></i>
            ${result.status.toUpperCase()}
        </div>
    `;

        resultsContainer.appendChild(resultElement);
    }

    // Domain Hunt Functions
    function startHunt() {
        const categories = Array.from(document.getElementById('huntCategories').selectedOptions)
            .map(option => option.value);
        const extensions = document.getElementById('huntExtensions').value.split(',').map(e => e.trim());
        const limit = parseInt(document.getElementById('huntLimit').value);
        const interval = parseInt(document.getElementById('huntInterval').value);

        if (categories.length === 0) {
            showToast('Please select at least one category', 'warning');
            return;
        }

        // Reset stats
        huntStats = { checked: 0, available: 0, total: limit };
        updateHuntStats();

        // Update UI
        document.getElementById('startHuntBtn').disabled = true;
        document.getElementById('stopHuntBtn').disabled = false;

        // Clear previous results
        document.getElementById('huntResults').innerHTML = '';

        showToast('Domain hunt started!', 'success');

        // Start hunting
        huntInterval = setInterval(async () => {
            if (huntStats.checked >= limit) {
                stopHunt();
                return;
            }

            try {
                const domain = await generateRandomDomain(categories, extensions);
                const result = await simulateDomainCheck(domain);

                huntStats.checked++;
                if (result.available) {
                    huntStats.available++;
                    updateStats('availableDomains');
                    displayHuntResult(result);
                }

                updateHuntStats();
            } catch (error) {
                console.error('Hunt error:', error);
            }
        }, interval);
    }

    function stopHunt() {
        if (huntInterval) {
            clearInterval(huntInterval);
            huntInterval = null;
        }

        document.getElementById('startHuntBtn').disabled = false;
        document.getElementById('stopHuntBtn').disabled = true;

        showToast('Domain hunt stopped', 'info');
    }

    function clearResults() {
        document.getElementById('huntResults').innerHTML = '';
        huntStats = { checked: 0, available: 0, total: 0 };
        updateHuntStats();
        showToast('Results cleared', 'info');
    }

    function updateHuntStats() {
        document.getElementById('huntChecked').textContent = huntStats.checked;
        document.getElementById('huntAvailable').textContent = huntStats.available;
        const successRate = huntStats.checked > 0 ? ((huntStats.available / huntStats.checked) * 100).toFixed(1) : 0;
        document.getElementById('huntSuccessRate').textContent = `${successRate}%`;
    }

    function displayHuntResult(result) {
        const resultsContainer = document.getElementById('huntResults');

        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
        <div class="result-info">
            <div class="result-domain">${result.domain}</div>
            <div class="result-details">
                Category: ${result.category} | 
                Quality Score: ${result.qualityScore}
                ${result.estimatedValue ? ` | Est. Value: $${result.estimatedValue}` : ''}
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <span class="quality-score ${getQualityClass(result.qualityScore)}">${result.qualityScore}</span>
            <div class="result-status status-available">
                <i class="fas fa-check"></i>
                AVAILABLE
            </div>
        </div>
    `;

        resultsContainer.insertBefore(resultElement, resultsContainer.firstChild);
    }

    // AI Domain Generation Functions
    async function generateAIDomains() {
        const description = document.getElementById('aiDescription').value.trim();
        const count = parseInt(document.getElementById('aiCount').value);
        const sector = document.getElementById('aiSector').value;
        const strategy = document.getElementById('aiStrategy').value;
        const premium = document.getElementById('aiPremium').checked;
        const checkAvailability = document.getElementById('aiCheckAvailability').checked;

        if (!description) {
            showToast('Please enter a description', 'warning');
            return;
        }

        showLoading();

        try {
            const domains = await simulateAIGeneration(description, count, sector, strategy, premium);

            if (checkAvailability) {
                // Check availability for each domain
                for (const domain of domains) {
                    const availabilityResult = await simulateDomainCheck(domain.name + '.com');
                    domain.available = availabilityResult.available;
                }
            }

            displayAIResults(domains);
            showToast(`Generated ${domains.length} AI domains`, 'success');
        } catch (error) {
            showToast(`Error generating domains: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }

    function displayAIResults(domains) {
        const resultsContainer = document.getElementById('aiResults');
        resultsContainer.innerHTML = '';

        domains.forEach(domain => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
            <div class="result-info">
                <div class="result-domain">${domain.name}</div>
                <div class="result-details">
                    Strategy: ${domain.strategy} | 
                    Sector: ${domain.sector} | 
                    Quality: ${domain.qualityScore}
                    ${domain.estimatedValue ? ` | Est. Value: $${domain.estimatedValue}` : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="quality-score ${getQualityClass(domain.qualityScore)}">${domain.qualityScore}</span>
                ${domain.available !== undefined ?
                    `<div class="result-status status-${domain.available ? 'available' : 'taken'}">
                        <i class="fas fa-${domain.available ? 'check' : 'times'}"></i>
                        ${domain.available ? 'AVAILABLE' : 'TAKEN'}
                    </div>` : ''
                }
            </div>
        `;

            resultsContainer.appendChild(resultElement);
        });
    }

    // Trend Analysis Functions
    async function getTrendAnalysis() {
        showLoading();

        try {
            const analysis = await simulateTrendAnalysis();
            displayTrendAnalysis(analysis);
            showToast('Trend analysis completed', 'success');
        } catch (error) {
            showToast(`Error getting trend analysis: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }

    async function generateTrendDomains() {
        const count = parseInt(document.getElementById('trendCount').value);
        const specificTrend = document.getElementById('specificTrend').value;

        showLoading();

        try {
            const domains = await simulateTrendDomainGeneration(count, specificTrend);
            displayTrendResults(domains);
            showToast(`Generated ${domains.length} trend-based domains`, 'success');
        } catch (error) {
            showToast(`Error generating trend domains: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }

    function displayTrendAnalysis(analysis) {
        const resultsContainer = document.getElementById('trendResults');
        resultsContainer.innerHTML = `
        <div style="padding: 20px;">
            <h3 style="margin-bottom: 20px; color: var(--dark-color);">
                <i class="fas fa-chart-line"></i> 2025 Technology Trends Analysis
            </h3>
            ${analysis.trends.map(trend => `
                <div style="margin-bottom: 20px; padding: 15px; background: var(--light-color); border-radius: var(--border-radius);">
                    <h4 style="color: var(--primary-color); margin-bottom: 10px;">${trend.name}</h4>
                    <p style="margin-bottom: 10px;">${trend.description}</p>
                    <div style="display: flex; gap: 15px; font-size: 0.9rem; color: var(--secondary-color);">
                        <span><strong>Growth:</strong> ${trend.growth}</span>
                        <span><strong>Market Size:</strong> ${trend.marketSize}</span>
                        <span><strong>Investment:</strong> ${trend.investment}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    }

    function displayTrendResults(domains) {
        const resultsContainer = document.getElementById('trendResults');
        resultsContainer.innerHTML = '';

        domains.forEach(domain => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
            <div class="result-info">
                <div class="result-domain">${domain.name}</div>
                <div class="result-details">
                    Trend: ${domain.trend} | 
                    Score: ${domain.trendScore} | 
                    Quality: ${domain.qualityScore}
                    ${domain.estimatedValue ? ` | Est. Value: $${domain.estimatedValue}` : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="quality-score ${getQualityClass(domain.qualityScore)}">${domain.qualityScore}</span>
                <span style="padding: 3px 8px; background: var(--info-color); color: white; border-radius: 15px; font-size: 0.8rem;">
                    Trend: ${domain.trendScore}
                </span>
            </div>
        `;

            resultsContainer.appendChild(resultElement);
        });
    }

    // Market Analysis Functions
    async function analyzeMarket() {
        const domains = document.getElementById('marketDomains').value.trim();
        const detailed = document.getElementById('detailedAnalysis').checked;

        if (!domains) {
            showToast('Please enter domains to analyze', 'warning');
            return;
        }

        const domainList = domains.split(',').map(d => d.trim()).filter(d => d);

        showLoading();

        try {
            const analysis = await simulateMarketAnalysis(domainList, detailed);
            displayMarketResults(analysis);
            showToast(`Market analysis completed for ${domainList.length} domains`, 'success');
        } catch (error) {
            showToast(`Error analyzing market: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }

    function displayMarketResults(analysis) {
        const resultsContainer = document.getElementById('marketResults');
        resultsContainer.innerHTML = '';

        analysis.forEach(domain => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
            <div class="result-info">
                <div class="result-domain">${domain.name}</div>
                <div class="result-details">
                    ${domain.detailed ? `
                        Category: ${domain.category} | 
                        Age: ${domain.age} years | 
                        SEO Score: ${domain.seoScore} | 
                        Brandability: ${domain.brandability}
                    ` : `
                        Length: ${domain.length} chars | 
                        Extension: ${domain.extension}
                    `}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; flex-direction: column; align-items: flex-end;">
                <div style="font-size: 1.2rem; font-weight: 700; color: var(--success-color);">
                    $${domain.estimatedValue.toLocaleString()}
                </div>
                <div style="font-size: 0.9rem; color: var(--secondary-color);">
                    Investment Rating: ${domain.investmentRating}
                </div>
            </div>
        `;

            resultsContainer.appendChild(resultElement);
        });
    }

    // Configuration Functions
    async function showCurrentConfig() {
        showLoading();

        try {
            const config = await simulateGetConfig();
            displayCurrentConfig(config);
            showToast('Configuration loaded', 'success');
        } catch (error) {
            showToast(`Error loading configuration: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }

    function displayCurrentConfig(config) {
        const configDisplay = document.getElementById('currentConfig');
        configDisplay.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px; font-weight: 600;">Allow Hyphens:</td>
                <td style="padding: 8px;">${config.allowHyphens ? 'Yes' : 'No'}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px; font-weight: 600;">Allow Numbers:</td>
                <td style="padding: 8px;">${config.allowNumbers ? 'Yes' : 'No'}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px; font-weight: 600;">Number Position:</td>
                <td style="padding: 8px;">${config.numberPosition || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px; font-weight: 600;">Max Length:</td>
                <td style="padding: 8px;">${config.maxLength}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px; font-weight: 600;">Min Length:</td>
                <td style="padding: 8px;">${config.minLength}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: 600;">Quality Bonuses:</td>
                <td style="padding: 8px;">
                    No Hyphens: +${config.qualityBonuses.noHyphens}, 
                    No Numbers: +${config.qualityBonuses.noNumbers}, 
                    Short: +${config.qualityBonuses.shortLength}
                </td>
            </tr>
        </table>
    `;
    }

    async function updateHyphens() {
        const allowHyphens = document.querySelector('input[name="hyphens"]:checked')?.value === 'true';

        if (allowHyphens === undefined) {
            showToast('Please select a hyphen option', 'warning');
            return;
        }

        try {
            await simulateUpdateConfig('hyphens', allowHyphens);
            showToast(`Hyphens ${allowHyphens ? 'enabled' : 'disabled'}`, 'success');
        } catch (error) {
            showToast(`Error updating hyphens: ${error.message}`, 'error');
        }
    }

    async function updateNumbers() {
        const allowNumbers = document.querySelector('input[name="numbers"]:checked')?.value === 'true';
        const position = document.getElementById('numberPosition').value;

        if (allowNumbers === undefined) {
            showToast('Please select a number option', 'warning');
            return;
        }

        try {
            await simulateUpdateConfig('numbers', allowNumbers, position);
            showToast(`Numbers ${allowNumbers ? 'enabled' : 'disabled'}${allowNumbers ? ` (${position})` : ''}`, 'success');
        } catch (error) {
            showToast(`Error updating numbers: ${error.message}`, 'error');
        }
    }

    async function updateLength() {
        const maxLength = parseInt(document.getElementById('maxLength').value);

        if (!maxLength || maxLength < 3 || maxLength > 50) {
            showToast('Please enter a valid length (3-50)', 'warning');
            return;
        }

        try {
            await simulateUpdateConfig('length', maxLength);
            showToast(`Max length updated to ${maxLength}`, 'success');
        } catch (error) {
            showToast(`Error updating length: ${error.message}`, 'error');
        }
    }

    async function testConfig() {
        const testDomain = document.getElementById('testDomain').value.trim();

        if (!testDomain) {
            showToast('Please enter a domain to test', 'warning');
            return;
        }

        try {
            const result = await simulateTestConfig(testDomain);
            displayConfigTest(result);
            showToast('Configuration test completed', 'success');
        } catch (error) {
            showToast(`Error testing configuration: ${error.message}`, 'error');
        }
    }

    function displayConfigTest(result) {
        const configResults = document.getElementById('configResults');
        configResults.innerHTML = `
        <div class="result-item">
            <div class="result-info">
                <div class="result-domain">Test: ${result.domain}</div>
                <div class="result-details">
                    Valid: ${result.isValid ? 'Yes' : 'No'} | 
                    Quality Score: ${result.qualityScore} | 
                    Issues: ${result.issues.length > 0 ? result.issues.join(', ') : 'None'}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="quality-score ${getQualityClass(result.qualityScore)}">${result.qualityScore}</span>
                <div class="result-status status-${result.isValid ? 'available' : 'taken'}">
                    <i class="fas fa-${result.isValid ? 'check' : 'times'}"></i>
                    ${result.isValid ? 'VALID' : 'INVALID'}
                </div>
            </div>
        </div>
    `;
    }

    async function resetConfig() {
        try {
            await simulateResetConfig();
            showToast('Configuration reset to defaults', 'success');
            showCurrentConfig();
        } catch (error) {
            showToast(`Error resetting configuration: ${error.message}`, 'error');
        }
    }

    // Simulation Functions (Replace with actual API calls)
    async function simulateSiteCheck(site) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        const isOnline = Math.random() > 0.2; // 80% chance of being online
        const responseTime = isOnline ? Math.floor(Math.random() * 1000 + 100) : null;
        const statusCode = isOnline ? [200, 301, 302][Math.floor(Math.random() * 3)] : [404, 500, 503][Math.floor(Math.random() * 3)];
        const servers = ['nginx', 'Apache', 'IIS', 'Cloudflare', 'AWS'];

        return {
            url: site,
            status: isOnline ? 'online' : 'offline',
            responseTime,
            statusCode,
            server: isOnline ? servers[Math.floor(Math.random() * servers.length)] : null
        };
    }

    async function simulateDomainCheck(domain) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

        const available = Math.random() > 0.95; // 5% chance of being available
        const qualityScore = Math.floor(Math.random() * 100);
        const estimatedValue = available ? Math.floor(Math.random() * 5000 + 100) : null;

        return {
            domain,
            available,
            qualityScore,
            estimatedValue,
            category: ['general', 'tech', 'business', 'creative'][Math.floor(Math.random() * 4)]
        };
    }

    async function generateRandomDomain(categories, extensions) {
        const prefixes = {
            'one-letter': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
            'two-letter': ['ai', 'io', 'go', 'my', 'we', 'hi', 'ok', 'up', 'to', 'in'],
            'three-letter': ['app', 'api', 'dev', 'web', 'net', 'pro', 'lab', 'hub', 'box', 'new'],
            'short': ['quick', 'smart', 'fast', 'easy', 'cool', 'nice', 'good', 'best', 'top', 'mega'],
            'numbers': ['1', '2', '3', '24', '365', '99', '100', '247', '360', '2025'],
            'tech': ['tech', 'data', 'cloud', 'code', 'byte', 'pixel', 'digital', 'cyber', 'nano', 'micro'],
            'turkish': ['hızlı', 'kolay', 'güzel', 'iyi', 'yeni', 'büyük', 'küçük', 'akıllı', 'modern', 'dijital']
        };

        const category = categories[Math.floor(Math.random() * categories.length)];
        const prefix = prefixes[category][Math.floor(Math.random() * prefixes[category].length)];
        const extension = extensions[Math.floor(Math.random() * extensions.length)];

        return `${prefix}${extension}`;
    }

    async function simulateAIGeneration(description, count, sector, strategy, premium) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

        const baseNames = [
            'innovate', 'create', 'build', 'grow', 'scale', 'flow', 'spark', 'boost', 'leap', 'swift',
            'nexus', 'vertex', 'zenith', 'prime', 'core', 'edge', 'fusion', 'quantum', 'neural', 'cosmic'
        ];

        const domains = [];

        for (let i = 0; i < count; i++) {
            const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
            const suffix = ['ly', 'io', 'app', 'lab', 'hub', 'pro', 'ai', 'tech'][Math.floor(Math.random() * 8)];
            const name = `${baseName}${suffix}`;

            domains.push({
                name,
                strategy,
                sector,
                qualityScore: premium ? Math.floor(Math.random() * 20 + 80) : Math.floor(Math.random() * 100),
                estimatedValue: Math.floor(Math.random() * 10000 + 500)
            });
        }

        return domains;
    }

    async function simulateTrendAnalysis() {
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            trends: [
                {
                    name: 'AI & Machine Learning',
                    description: 'Artificial intelligence continues to dominate with breakthrough applications in automation, healthcare, and creative industries.',
                    growth: '+45%',
                    marketSize: '$190B',
                    investment: '$75B'
                },
                {
                    name: 'Sustainable Technology',
                    description: 'Green tech solutions driving environmental sustainability and carbon neutrality goals.',
                    growth: '+38%',
                    marketSize: '$85B',
                    investment: '$45B'
                },
                {
                    name: 'Web3 & Blockchain',
                    description: 'Decentralized web technologies reshaping digital ownership and financial systems.',
                    growth: '+32%',
                    marketSize: '$120B',
                    investment: '$35B'
                },
                {
                    name: 'Edge Computing',
                    description: 'Processing data closer to source for reduced latency and improved performance.',
                    growth: '+28%',
                    marketSize: '$95B',
                    investment: '$25B'
                },
                {
                    name: 'Quantum Computing',
                    description: 'Revolutionary computing power for complex problem solving and cryptography.',
                    growth: '+55%',
                    marketSize: '$65B',
                    investment: '$40B'
                }
            ]
        };
    }

    async function simulateTrendDomainGeneration(count, specificTrend) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const trendKeywords = {
            'ai-automation': ['ai', 'auto', 'smart', 'neural', 'learn', 'think', 'mind', 'brain'],
            'sustainable-tech': ['green', 'eco', 'sustain', 'clean', 'earth', 'solar', 'wind', 'bio'],
            'web3-blockchain': ['web3', 'crypto', 'defi', 'nft', 'dao', 'meta', 'chain', 'block'],
            'edge-computing': ['edge', 'fast', 'instant', 'real', 'time', 'quick', 'speed', 'rapid'],
            'quantum-tech': ['quantum', 'qbit', 'super', 'ultra', 'hyper', 'mega', 'infinite', 'max']
        };

        const trends = specificTrend ? [specificTrend] : Object.keys(trendKeywords);
        const domains = [];

        for (let i = 0; i < count; i++) {
            const trend = trends[Math.floor(Math.random() * trends.length)];
            const keywords = trendKeywords[trend] || trendKeywords['ai-automation'];
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];
            const suffix = ['ly', 'io', 'app', 'lab', 'hub', 'ai', '2025'][Math.floor(Math.random() * 7)];

            domains.push({
                name: `${keyword}${suffix}`,
                trend: trend.replace('-', ' '),
                trendScore: Math.floor(Math.random() * 100),
                qualityScore: Math.floor(Math.random() * 100),
                estimatedValue: Math.floor(Math.random() * 15000 + 1000)
            });
        }

        return domains;
    }

    async function simulateMarketAnalysis(domains, detailed) {
        await new Promise(resolve => setTimeout(resolve, domains.length * 300));

        return domains.map(domain => {
            // Domain'den uzantıyı çıkararak sadece ana domain uzunluğunu hesapla
            const domainParts = domain.split('.');
            const mainDomain = domainParts[0]; // Ana domain adı (uzantı hariç)
            const length = mainDomain.length;
            const extension = domainParts.slice(1).join('.') || 'com'; // Uzantı kısmı
            const baseValue = Math.floor(Math.random() * 50000 + 1000);

            const analysis = {
                name: domain,
                length,
                extension,
                estimatedValue: baseValue,
                investmentRating: ['A+', 'A', 'B+', 'B', 'C+', 'C'][Math.floor(Math.random() * 6)]
            };

            if (detailed) {
                analysis.detailed = true;
                analysis.category = ['Tech', 'Business', 'Brandable', 'Generic', 'Geo'][Math.floor(Math.random() * 5)];
                analysis.age = Math.floor(Math.random() * 20 + 1);
                analysis.seoScore = Math.floor(Math.random() * 100);
                analysis.brandability = Math.floor(Math.random() * 100);
            }

            return analysis;
        });
    }

    async function simulateGetConfig() {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            allowHyphens: false,
            allowNumbers: true,
            numberPosition: 'end',
            maxLength: 15,
            minLength: 3,
            qualityBonuses: {
                noHyphens: 15,
                noNumbers: 20,
                shortLength: 30
            }
        };
    }

    async function simulateUpdateConfig(type, value, extra) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async function simulateTestConfig(domain) {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Domain'den uzantıyı çıkararak ana domain uzunluğunu hesapla
        const mainDomain = domain.includes('.') ? domain.split('.')[0] : domain;

        const issues = [];
        if (mainDomain.includes('-')) issues.push('Contains hyphens');
        if (/\d/.test(mainDomain)) issues.push('Contains numbers');
        if (mainDomain.length > 15) issues.push('Too long');

        return {
            domain,
            isValid: issues.length === 0,
            qualityScore: Math.max(100 - (issues.length * 25), 0),
            issues
        };
    }

    async function simulateResetConfig() {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
