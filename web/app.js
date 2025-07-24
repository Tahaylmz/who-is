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
        themeIcon.style.color = '#f59e0b';
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
            const target = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// Utility Functions
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Processing...</div>
        </div>
    `;
}

function clearResults(containerId) {
    document.getElementById(containerId).innerHTML = '';
}

// Site Check Functions
async function checkSite() {
    const site = document.getElementById('siteInput').value.trim();
    if (!site) {
        showToast('Please enter a website URL', 'warning');
        return;
    }
    
    showLoading('siteResults');
    
    try {
        const response = await fetch('/api/check-site', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ site })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displaySiteResult(data.result);
            showToast('Site check completed', 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('siteResults');
    }
}

function displaySiteResult(result) {
    const container = document.getElementById('siteResults');
    const isOnline = result.includes('✅') || result.includes('ÇEVRIMIÇI');
    
    container.innerHTML = `
        <div class="result-item ${isOnline ? 'online' : 'offline'}">
            <div class="result-status">
                ${isOnline ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'}
            </div>
            <div class="result-content">
                <pre>${result}</pre>
            </div>
        </div>
    `;
}

async function bulkCheck() {
    const sitesText = document.getElementById('bulkSiteInput').value.trim();
    if (!sitesText) {
        showToast('Please enter websites to check', 'warning');
        return;
    }
    
    const sites = sitesText.split('\n').map(s => s.trim()).filter(s => s);
    if (sites.length === 0) {
        showToast('No valid websites found', 'warning');
        return;
    }
    
    showLoading('bulkResults');
    
    try {
        const response = await fetch('/api/check-sites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sites })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayBulkResults(data.result, sites);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('bulkResults');
    }
}

function displayBulkResults(result, sites) {
    const container = document.getElementById('bulkResults');
    const lines = result.split('\n').filter(line => line.trim());
    
    let onlineCount = 0;
    let offlineCount = 0;
    
    const results = lines.map(line => {
        const isOnline = line.includes('✅') || line.includes('Online');
        if (isOnline) onlineCount++;
        else offlineCount++;
        
        return {
            line,
            isOnline
        };
    });
    
    container.innerHTML = `
        <div class="bulk-summary">
            <div class="summary-item success">
                <i class="fas fa-check-circle"></i>
                <span>Online: ${onlineCount}</span>
            </div>
            <div class="summary-item error">
                <i class="fas fa-times-circle"></i>
                <span>Offline: ${offlineCount}</span>
            </div>
        </div>
        <div class="results-list">
            ${results.map(r => `
                <div class="result-item ${r.isOnline ? 'online' : 'offline'}">
                    <div class="result-status">
                        ${r.isOnline ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'}
                    </div>
                    <div class="result-content">
                        <code>${r.line}</code>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    showToast(`Bulk check completed: ${onlineCount}/${sites.length} sites online`, 'success');
}

// Domain Hunt Functions
async function generateDomains() {
    const count = parseInt(document.getElementById('domainCount').value) || 10;
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    
    if (categories.length === 0) {
        showToast('Please select at least one category', 'warning');
        return;
    }
    
    showLoading('domainResults');
    
    try {
        const response = await fetch('/api/generate-domains', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count, categories })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayDomainResults(data.result);
            showToast(`Generated ${data.result.length} domains`, 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('domainResults');
    }
}

function displayDomainResults(domains) {
    const container = document.getElementById('domainResults');
    
    container.innerHTML = `
        <div class="results-list">
            ${domains.map(domain => `
                <div class="result-item">
                    <div class="domain-info">
                        <div class="domain-name">${domain.name}</div>
                        <div class="domain-details">
                            Category: ${domain.category} | Quality: ${domain.quality}/100
                        </div>
                    </div>
                    <div class="domain-actions">
                        <button onclick="checkDomainAvailability('${domain.name}')" class="btn btn-small">
                            Check Availability
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function checkDomainAvailability(domain) {
    showToast(`Checking availability for ${domain}...`, 'info');
    
    try {
        const response = await fetch('/api/check-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const isAvailable = data.result.includes('MÜSAİT') || data.result.includes('AVAILABLE');
            showToast(
                isAvailable ? `${domain} is available!` : `${domain} is taken`,
                isAvailable ? 'success' : 'warning'
            );
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error checking ${domain}: ${error.message}`, 'error');
    }
}

// AI Domain Generation
async function generateAIDomains() {
    const sector = document.getElementById('aiSector').value;
    const count = parseInt(document.getElementById('aiCount').value) || 5;
    const style = document.getElementById('aiStyle').value;
    
    if (!sector) {
        showToast('Please select a sector', 'warning');
        return;
    }
    
    showLoading('aiResults');
    
    try {
        const response = await fetch('/api/ai-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sector, count, style })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayAIResults(data.result);
            showToast(`Generated ${data.result.length} AI domains`, 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('aiResults');
    }
}

function displayAIResults(domains) {
    const container = document.getElementById('aiResults');
    
    container.innerHTML = `
        <div class="results-grid">
            ${domains.map(domain => `
                <div class="ai-domain-card">
                    <div class="ai-domain-name">${domain.name}</div>
                    <div class="ai-domain-stats">
                        <div class="stat">
                            <span class="stat-label">Quality:</span>
                            <span class="stat-value">${domain.quality}/100</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Style:</span>
                            <span class="stat-value">${domain.style}</span>
                        </div>
                    </div>
                    <div class="ai-domain-actions">
                        <button onclick="checkDomainAvailability('${domain.name}')" class="btn btn-small">
                            Check Availability
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Trend Analysis
async function analyzeTrends() {
    const period = document.getElementById('trendPeriod').value;
    const category = document.getElementById('trendCategory').value;
    
    showLoading('trendResults');
    
    try {
        const response = await fetch('/api/trend-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ period, category })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayTrendResults(data.result);
            showToast(`Generated ${data.result.length} trend-based domains`, 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('trendResults');
    }
}

function displayTrendResults(domains) {
    const container = document.getElementById('trendResults');
    
    container.innerHTML = `
        <div class="trend-domains">
            ${domains.map(domain => `
                <div class="trend-domain-card">
                    <div class="trend-domain-name">${domain.name}</div>
                    <div class="trend-info">
                        <div class="trend-tag">${domain.trend}</div>
                        <div class="trend-scores">
                            <span class="score">Trend: ${domain.trendScore}/100</span>
                            <span class="score">Quality: ${domain.qualityScore}/100</span>
                        </div>
                    </div>
                    <div class="trend-value">$${domain.estimatedValue.toLocaleString()}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Market Analysis
async function analyzeMarket() {
    const domainInput = document.getElementById('marketDomains').value.trim();
    if (!domainInput) {
        showToast('Please enter domains to analyze', 'warning');
        return;
    }
    
    const domainList = domainInput.split('\n').map(d => d.trim()).filter(d => d);
    const detailed = document.getElementById('detailedAnalysis').checked;
    
    showLoading('marketResults');
    
    try {
        const response = await fetch('/api/market-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domains: domainList, detailed })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const analysis = await simulateMarketAnalysis(domainList, detailed);
            displayMarketResults(analysis);
            showToast(`Market analysis completed for ${domainList.length} domains`, 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('marketResults');
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
async function loadConfig() {
    showLoading('configResults');
    
    try {
        const config = await simulateGetConfig();
        displayConfig(config);
        showToast('Configuration loaded', 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('configResults');
    }
}

function displayConfig(config) {
    const container = document.getElementById('configResults');
    
    container.innerHTML = `
        <div class="config-display">
            <h3>Current Configuration</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-weight: 600;">Allow Hyphens:</td>
                    <td style="padding: 8px;">${config.allowHyphens ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-weight: 600;">Allow Numbers:</td>
                    <td style="padding: 8px;">${config.allowNumbers ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-weight: 600;">Max Length:</td>
                    <td style="padding: 8px;">${config.maxLength}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-weight: 600;">Min Length:</td>
                    <td style="padding: 8px;">${config.minLength}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-weight: 600;">Number Position:</td>
                    <td style="padding: 8px;">${config.numberPosition}</td>
                </tr>
            </table>
            
            <h4 style="margin-top: 20px;">Quality Bonuses</h4>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <div style="background: var(--card-bg); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                    No Hyphens: +${config.qualityBonuses.noHyphens}
                </div>
                <div style="background: var(--card-bg); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                    No Numbers: +${config.qualityBonuses.noNumbers}
                </div>
                <div style="background: var(--card-bg); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                    Short: +${config.qualityBonuses.shortLength}
                </div>
            </div>
        </div>
    `;
}

async function toggleHyphens() {
    const currentState = document.getElementById('hyphenStatus').textContent.includes('Enabled');
    
    try {
        await simulateUpdateConfig('hyphens', !currentState);
        document.getElementById('hyphenStatus').textContent = currentState ? 'Disabled' : 'Enabled';
        document.getElementById('hyphenStatus').className = currentState ? 'status-disabled' : 'status-enabled';
        showToast(`Hyphens ${currentState ? 'disabled' : 'enabled'}`, 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

async function toggleNumbers() {
    const currentState = document.getElementById('numberStatus').textContent.includes('Enabled');
    
    try {
        await simulateUpdateConfig('numbers', !currentState);
        document.getElementById('numberStatus').textContent = currentState ? 'Disabled' : 'Enabled';
        document.getElementById('numberStatus').className = currentState ? 'status-disabled' : 'status-enabled';
        showToast(`Numbers ${currentState ? 'disabled' : 'enabled'}`, 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
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
        document.getElementById('maxLength').value = '';
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

async function testConfiguration() {
    const testDomain = document.getElementById('testDomain').value.trim();
    if (!testDomain) {
        showToast('Please enter a test domain', 'warning');
        return;
    }
    
    showLoading('testResults');
    
    try {
        const result = await simulateTestConfig(testDomain);
        displayTestResults(result);
        showToast('Configuration test completed', 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        clearResults('testResults');
    }
}

function displayTestResults(result) {
    const container = document.getElementById('testResults');
    
    container.innerHTML = `
        <div class="test-result ${result.isValid ? 'valid' : 'invalid'}">
            <div class="test-domain">
                <i class="fas ${result.isValid ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${result.domain}
            </div>
            <div class="test-score">Quality Score: ${result.qualityScore}/100</div>
            ${result.issues.length > 0 ? `
                <div class="test-issues">
                    <strong>Issues:</strong>
                    <ul>
                        ${result.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

async function resetConfig() {
    try {
        await simulateResetConfig();
        showToast('Configuration reset to defaults', 'success');
        loadConfig(); // Reload config display
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Simulation Functions (for demo purposes)
async function simulateGenerateDomains(count, categories) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const domains = [];
    const sampleDomains = [
        'techvision', 'smartflow', 'databridge', 'cloudpeak', 'aiforce',
        'digitalhub', 'innovatelab', 'futuretech', 'nexuspoint', 'cybernet'
    ];
    
    for (let i = 0; i < count; i++) {
        const name = sampleDomains[Math.floor(Math.random() * sampleDomains.length)] + 
                     Math.floor(Math.random() * 1000);
        domains.push({
            name: name + '.com',
            category: categories[Math.floor(Math.random() * categories.length)],
            quality: Math.floor(Math.random() * 100)
        });
    }
    
    return domains;
}

async function simulateAIGeneration(sector, count, style) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const domains = [];
    const prefixes = ['smart', 'ai', 'auto', 'quick', 'pro', 'ultra', 'max', 'super'];
    const suffixes = ['ly', 'io', 'hub', 'lab', 'tech', 'app', 'net', 'zone'];
    
    for (let i = 0; i < count; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        domains.push({
            name: `${prefix}${sector}${suffix}.com`,
            quality: Math.floor(Math.random() * 100),
            style: style
        });
    }
    
    return domains;
}

async function simulateTrendAnalysis(period, category) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const trends = ['ai-automation', 'sustainable-tech', 'remote-work', 'blockchain', 'metaverse'];
    const trendKeywords = {
        'ai-automation': ['auto', 'smart', 'ai', 'bot', 'neural'],
        'sustainable-tech': ['green', 'eco', 'solar', 'clean', 'renew'],
        'remote-work': ['remote', 'virtual', 'digital', 'cloud', 'flex'],
        'blockchain': ['chain', 'crypto', 'block', 'defi', 'nft'],
        'metaverse': ['meta', 'vr', 'ar', 'virtual', '3d']
    };
    
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

async function simulateUpdateConfig(type, value) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
}

async function simulateDomainValidation(domain) {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeTabs();
    
    // Set initial configuration status
    document.getElementById('hyphenStatus').textContent = 'Disabled';
    document.getElementById('hyphenStatus').className = 'status-disabled';
    document.getElementById('numberStatus').textContent = 'Enabled';
    document.getElementById('numberStatus').className = 'status-enabled';
});
