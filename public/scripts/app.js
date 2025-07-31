/**
 * 🚀 Modern Who-Is Web Application
 * Frontend JavaScript for all features
 */

class WhoIsApp {
    constructor() {
        this.stats = {
            totalChecks: 0,
            onlineSites: 0,
            availableDomains: 0
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupTabs();
        this.updateStats();
        this.loadRecentActivity();
        this.setupSliders();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Enter key handlers
        document.getElementById('siteInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkSite();
        });

        document.getElementById('domainKeywords')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.huntDomains();
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.classList.toggle('dark', savedTheme === 'dark');
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupTabs() {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab') || 'site-check';
        this.switchTab(tab);
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== tabName);
            content.classList.toggle('active', content.id === tabName);
        });

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('tab', tabName);
        window.history.replaceState({}, '', url);
    }

    setupSliders() {
        const suggestionSlider = document.getElementById('suggestionCount');
        if (suggestionSlider) {
            suggestionSlider.addEventListener('input', (e) => {
                document.getElementById('suggestionCountValue').textContent = e.target.value;
            });
        }
    }

    // Site Checking Functions
    async checkSite() {
        const input = document.getElementById('siteInput');
        const url = input.value.trim();
        
        if (!url) {
            this.showToast('Please enter a URL', 'warning');
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, timeout: 10000 })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displaySiteResult([result.data]);
                this.stats.totalChecks++;
                if (result.data.isOnline) this.stats.onlineSites++;
                this.updateStats();
                this.addToActivity('check', `Checked ${url}`, result.data.isOnline ? 'success' : 'error');
            } else {
                this.showToast(result.error || 'Check failed', 'error');
            }
        } catch (error) {
            console.error('Site check error:', error);
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async quickCheck(url) {
        document.getElementById('siteInput').value = url;
        await this.checkSite();
    }

    async checkBulkSites() {
        const textarea = document.getElementById('bulkSites');
        const sites = textarea.value.trim().split('\n').filter(site => site.trim());
        
        if (sites.length === 0) {
            this.showToast('Please enter at least one site', 'warning');
            return;
        }

        this.showLoading();
        const results = [];
        
        try {
            // Process sites in batches to avoid overwhelming the server
            const batchSize = 5;
            for (let i = 0; i < sites.length; i += batchSize) {
                const batch = sites.slice(i, i + batchSize);
                const batchPromises = batch.map(site => this.checkSingleSite(site.trim()));
                const batchResults = await Promise.allSettled(batchPromises);
                
                batchResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        results.push(result.value);
                        if (result.value.isOnline) this.stats.onlineSites++;
                    } else {
                        results.push({
                            url: batch[index],
                            isOnline: false,
                            error: 'Check failed',
                            responseTime: 0
                        });
                    }
                    this.stats.totalChecks++;
                });

                // Update progress
                const progress = ((i + batchSize) / sites.length) * 100;
                this.updateProgress(Math.min(progress, 100));
            }

            this.displaySiteResult(results);
            this.updateStats();
            this.addToActivity('bulk-check', `Bulk checked ${sites.length} sites`, 'success');
            
        } catch (error) {
            console.error('Bulk check error:', error);
            this.showToast('Bulk check failed', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async checkSingleSite(url) {
        const response = await fetch('/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, timeout: 5000 })
        });

        const result = await response.json();
        return result.success ? result.data : { url, isOnline: false, error: 'Check failed' };
    }

    loadSampleSites() {
        const samples = [
            'google.com',
            'github.com',
            'stackoverflow.com',
            'npmjs.com',
            'tailwindcss.com',
            'expressjs.com'
        ];
        
        document.getElementById('bulkSites').value = samples.join('\n');
    }

    // Domain Hunting Functions
    async huntDomains() {
        const keywords = document.getElementById('domainKeywords').value.trim();
        const extensions = Array.from(document.getElementById('domainExtensions').selectedOptions)
            .map(option => option.value);
        const maxLength = parseInt(document.getElementById('maxLength').value);

        if (!keywords) {
            this.showToast('Please enter keywords', 'warning');
            return;
        }

        if (extensions.length === 0) {
            this.showToast('Please select at least one extension', 'warning');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch('/api/hunt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keywords: keywords.split(',').map(k => k.trim()),
                    extensions,
                    maxLength,
                    count: 20
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayDomainResults(result.data);
                this.addToActivity('hunt', `Domain hunt for "${keywords}"`, 'success');
            } else {
                this.showToast(result.error || 'Domain hunt failed', 'error');
            }
        } catch (error) {
            console.error('Domain hunt error:', error);
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async checkDomainAvailability() {
        const textarea = document.getElementById('domainList');
        const domains = textarea.value.trim().split('\n').filter(domain => domain.trim());
        
        if (domains.length === 0) {
            this.showToast('Please enter at least one domain', 'warning');
            return;
        }

        this.showLoading();
        const results = [];

        try {
            // Check domains in batches
            const batchSize = 10;
            for (let i = 0; i < domains.length; i += batchSize) {
                const batch = domains.slice(i, i + batchSize);
                
                const response = await fetch('/api/check-domains', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domains: batch })
                });

                const result = await response.json();
                if (result.success) {
                    results.push(...result.data);
                    result.data.forEach(domain => {
                        if (domain.available) this.stats.availableDomains++;
                    });
                }

                const progress = ((i + batchSize) / domains.length) * 100;
                this.updateProgress(Math.min(progress, 100));
            }

            this.displayDomainResults(results);
            this.updateStats();
            this.addToActivity('domain-check', `Checked ${domains.length} domains`, 'success');
            
        } catch (error) {
            console.error('Domain check error:', error);
            this.showToast('Domain check failed', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // AI Generation Functions
    async generateDomains() {
        const description = document.getElementById('businessDescription').value.trim();
        const category = document.getElementById('businessCategory').value;
        const count = parseInt(document.getElementById('suggestionCount').value);
        const extensions = Array.from(document.querySelectorAll('.ai-extension-checkbox:checked'))
            .map(checkbox => checkbox.value);
        const brandableOnly = document.getElementById('brandableOnly').checked;
        const shortNamesOnly = document.getElementById('shortNamesOnly').checked;
        const checkAvailability = document.getElementById('checkAvailability').checked;

        if (!description) {
            this.showToast('Please describe your business', 'warning');
            return;
        }

        if (extensions.length === 0) {
            this.showToast('Please select at least one extension', 'warning');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    category,
                    count,
                    extensions,
                    options: {
                        brandableOnly,
                        shortNamesOnly,
                        checkAvailability
                    }
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayAIResults(result.data);
                this.addToActivity('ai-generate', `Generated ${result.data.length} AI domains`, 'success');
            } else {
                this.showToast(result.error || 'AI generation failed', 'error');
            }
        } catch (error) {
            console.error('AI generation error:', error);
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Display Functions
    displaySiteResult(results) {
        const container = document.getElementById('siteResults');
        const content = document.getElementById('siteResultsContent');
        
        if (!results || results.length === 0) return;

        let html = '<div class="space-y-4">';
        
        results.forEach(result => {
            const statusClass = result.isOnline ? 'status-online' : 'status-offline';
            const statusText = result.isOnline ? 'Online' : 'Offline';
            const statusIcon = result.isOnline ? 'fa-check-circle' : 'fa-times-circle';
            
            html += `
                <div class="result-card">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                ${result.url}
                            </h4>
                            <div class="flex items-center space-x-4 text-sm">
                                <span class="flex items-center ${statusClass}">
                                    <i class="fas ${statusIcon} mr-2"></i>
                                    ${statusText}
                                </span>
                                ${result.responseTime ? `
                                    <span class="text-gray-600 dark:text-gray-400">
                                        ${result.responseTime}ms
                                    </span>
                                ` : ''}
                                ${result.statusCode ? `
                                    <span class="text-gray-600 dark:text-gray-400">
                                        ${result.statusCode}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="status-dot ${result.isOnline ? 'online' : 'offline'}"></span>
                        </div>
                    </div>
                    ${result.error ? `
                        <div class="mt-2 text-sm text-red-600 dark:text-red-400">
                            ${result.error}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        content.innerHTML = html;
        container.classList.remove('hidden');
    }

    displayDomainResults(results) {
        const container = document.getElementById('domainResults');
        const content = document.getElementById('domainResultsContent');
        
        if (!results || results.length === 0) return;

        // Group by availability
        const available = results.filter(d => d.available);
        const taken = results.filter(d => !d.available);

        let html = '<div class="space-y-6">';
        
        if (available.length > 0) {
            html += `
                <div>
                    <h4 class="text-lg font-semibold text-green-600 mb-4 flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        Available Domains (${available.length})
                    </h4>
                    <div class="space-y-2">
            `;
            
            available.forEach(domain => {
                html += `
                    <div class="domain-card domain-available">
                        <div>
                            <span class="font-semibold text-gray-900 dark:text-white">
                                ${domain.name}
                            </span>
                            ${domain.premium ? '<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Premium</span>' : ''}
                        </div>
                        <div class="flex items-center space-x-2">
                            ${domain.registrar ? `<span class="text-sm text-gray-600">${domain.registrar}</span>` : ''}
                            <button onclick="copyToClipboard('${domain.name}')" class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                Copy
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        if (taken.length > 0) {
            html += `
                <div>
                    <h4 class="text-lg font-semibold text-red-600 mb-4 flex items-center">
                        <i class="fas fa-times-circle mr-2"></i>
                        Taken Domains (${taken.length})
                    </h4>
                    <div class="space-y-2">
            `;
            
            taken.forEach(domain => {
                html += `
                    <div class="domain-card domain-taken">
                        <span class="font-semibold text-gray-900 dark:text-white">
                            ${domain.name}
                        </span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            Registered
                        </span>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        html += '</div>';
        
        // Add export button
        html += `
            <div class="mt-6 text-center">
                <button onclick="exportDomains(${JSON.stringify(results).replace(/"/g, '&quot;')})" 
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fas fa-download mr-2"></i>
                    Export Results
                </button>
            </div>
        `;
        
        content.innerHTML = html;
        container.classList.remove('hidden');
    }

    displayAIResults(results) {
        const container = document.getElementById('aiResults');
        const content = document.getElementById('aiResultsContent');
        
        if (!results || results.length === 0) return;

        let html = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">';
        
        results.forEach(domain => {
            const availabilityClass = domain.available ? 'border-green-500' : 'border-red-500';
            const availabilityIcon = domain.available ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600';
            const availabilityText = domain.available ? 'Available' : 'Taken';
            
            html += `
                <div class="bg-white dark:bg-gray-800 rounded-lg border-2 ${availabilityClass} p-4 hover:shadow-lg transition-all">
                    <div class="flex justify-between items-start mb-2">
                        <h5 class="font-semibold text-gray-900 dark:text-white">
                            ${domain.name}
                        </h5>
                        <i class="fas ${availabilityIcon}"></i>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        ${domain.description || 'AI Generated Domain'}
                    </p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-medium ${domain.available ? 'text-green-600' : 'text-red-600'}">
                            ${availabilityText}
                        </span>
                        ${domain.available ? `
                            <button onclick="copyToClipboard('${domain.name}')" 
                                    class="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                                Copy
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add export button
        html += `
            <div class="mt-6 text-center">
                <button onclick="exportDomains(${JSON.stringify(results).replace(/"/g, '&quot;')})" 
                        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <i class="fas fa-download mr-2"></i>
                    Export AI Results
                </button>
            </div>
        `;
        
        content.innerHTML = html;
        container.classList.remove('hidden');
    }

    // Utility Functions
    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    updateProgress(percent) {
        // Could implement a progress bar here
        console.log(`Progress: ${percent}%`);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getToastIcon(type)} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    updateStats() {
        document.getElementById('totalChecks').textContent = this.stats.totalChecks;
        document.getElementById('onlineSites').textContent = this.stats.onlineSites;
        document.getElementById('availableDomains').textContent = this.stats.availableDomains;
    }

    addToActivity(type, description, status) {
        const activity = {
            type,
            description,
            status,
            timestamp: new Date().toISOString()
        };
        
        let activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        activities.unshift(activity);
        activities = activities.slice(0, 10); // Keep only last 10
        localStorage.setItem('recentActivity', JSON.stringify(activities));
        
        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        const container = document.getElementById('recentActivity');
        
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No recent activity</p>';
            return;
        }

        let html = '';
        activities.forEach(activity => {
            const iconClass = this.getActivityIcon(activity.type);
            const time = new Date(activity.timestamp).toLocaleTimeString();
            
            html += `
                <div class="activity-item">
                    <div class="activity-icon activity-${activity.type}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-900 dark:text-white">
                            ${activity.description}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${time}
                        </p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    getActivityIcon(type) {
        const icons = {
            check: 'fa-check',
            'bulk-check': 'fa-list',
            hunt: 'fa-search',
            'domain-check': 'fa-globe',
            'ai-generate': 'fa-robot'
        };
        return icons[type] || 'fa-info';
    }
}

// Global Functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        app.showToast(`Copied: ${text}`, 'success');
    }).catch(() => {
        app.showToast('Failed to copy', 'error');
    });
}

function exportDomains(domains) {
    const csv = domains.map(d => `${d.name},${d.available ? 'Available' : 'Taken'}`).join('\n');
    const blob = new Blob([`Domain,Status\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `domains-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    app.showToast('Domains exported successfully', 'success');
}

// Initialize App
const app = new WhoIsApp();

// Make functions globally available
window.checkSite = () => app.checkSite();
window.quickCheck = (url) => app.quickCheck(url);
window.checkBulkSites = () => app.checkBulkSites();
window.loadSampleSites = () => app.loadSampleSites();
window.huntDomains = () => app.huntDomains();
window.checkDomainAvailability = () => app.checkDomainAvailability();
window.generateDomains = () => app.generateDomains();
window.copyToClipboard = copyToClipboard;
window.exportDomains = exportDomains;
