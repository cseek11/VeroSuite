// VeroField REWARD_SCORE Dashboard JavaScript

// Fetch metrics from GitHub raw URL (always latest) or fallback to local file
const GITHUB_REPO = 'cseek11/VeroSuite';
const GITHUB_BRANCH = 'main';
const GITHUB_METRICS_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/docs/metrics/reward_scores.json`;
const LOCAL_METRICS_FILE = 'reward_scores.json';

let distributionChart = null;
let trendsChart = null;
let categoryChart = null;

// Filter state
let currentFilters = {
    dateRange: 30,
    author: 'all',
    category: 'all',
    scoreRange: 'all'
};

// Load and render metrics
async function loadMetrics() {
    try {
        // Try GitHub raw URL first (always latest data)
        let response;
        let usingGitHub = false;
        
        try {
            response = await fetch(GITHUB_METRICS_URL);
            if (response.ok) {
                usingGitHub = true;
            } else {
                throw new Error('GitHub fetch failed');
            }
        } catch (githubError) {
            // Fallback to local file if GitHub fetch fails
            console.warn('Failed to fetch from GitHub, trying local file:', githubError);
            
            // Check if we're running from file:// protocol
            if (window.location.protocol === 'file:') {
                showError('Dashboard must be served via HTTP server due to CORS restrictions. See README.md for setup instructions.');
                return;
            }
            
            response = await fetch(LOCAL_METRICS_FILE);
        }
        
        if (!response.ok) {
            throw new Error(`Failed to load metrics: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Show data source indicator
        if (usingGitHub) {
            console.log('✅ Loaded metrics from GitHub (latest data)');
        } else {
            console.log('⚠️ Loaded metrics from local file (may be outdated)');
        }
        
        renderMetrics(data);
    } catch (error) {
        console.error('Error loading metrics:', error);
        if (error.message.includes('CORS') || error.message.includes('fetch')) {
            showError('CORS error: Dashboard must be served via HTTP server. See README.md for setup instructions.');
        } else {
            showError('Failed to load metrics data. Please ensure reward_scores.json exists and is valid JSON.');
        }
    }
}

function applyFilters(scores) {
    let filtered = [...scores];
    
    // Date range filter
    if (currentFilters.dateRange !== 'all') {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(currentFilters.dateRange));
        filtered = filtered.filter(entry => {
            try {
                const entryDate = new Date(entry.timestamp);
                return entryDate >= cutoffDate;
            } catch {
                return true;
            }
        });
    }
    
    // Author filter
    if (currentFilters.author !== 'all') {
        filtered = filtered.filter(entry => entry.author === currentFilters.author);
    }
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(entry => {
            const breakdown = entry.breakdown || {};
            return breakdown[currentFilters.category] !== undefined && breakdown[currentFilters.category] !== 0;
        });
    }
    
    // Score range filter
    if (currentFilters.scoreRange !== 'all') {
        filtered = filtered.filter(entry => {
            const score = entry.score || 0;
            if (currentFilters.scoreRange === 'high') return score >= 6;
            if (currentFilters.scoreRange === 'medium') return score >= 0 && score < 6;
            if (currentFilters.scoreRange === 'low') return score < 0;
            return true;
        });
    }
    
    return filtered;
}

function populateAuthorFilter(scores) {
    const authors = new Set();
    scores.forEach(entry => {
        if (entry.author) {
            authors.add(entry.author);
        }
    });
    
    const select = document.getElementById('authorFilter');
    // Keep "All authors" option
    const allOption = select.querySelector('option[value="all"]');
    select.innerHTML = '';
    select.appendChild(allOption);
    
    Array.from(authors).sort().forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        select.appendChild(option);
    });
}

function renderMetrics(data) {
    const aggregates = data.aggregates || {};
    const scores = data.scores || [];
    
    // Populate author filter
    populateAuthorFilter(scores);
    
    // Apply filters
    const filteredScores = applyFilters(scores);
    
    // Update last updated timestamp
    const lastUpdated = data.last_updated || new Date().toISOString();
    document.getElementById('lastUpdated').textContent = formatDate(lastUpdated);                                                                               

    // Update metric cards (use filtered data)
    document.getElementById('totalPRs').textContent = filteredScores.length;
    const avgScore = filteredScores.length > 0 
        ? (filteredScores.reduce((sum, e) => sum + (e.score || 0), 0) / filteredScores.length).toFixed(2)
        : '0.00';
    document.getElementById('averageScore').textContent = avgScore;

    // Calculate high and low scores from filtered data
    const highScores = filteredScores.filter(e => (e.score || 0) >= 6).length;
    const lowScores = filteredScores.filter(e => (e.score || 0) < 0).length;
    document.getElementById('highScores').textContent = highScores;
    document.getElementById('lowScores').textContent = lowScores;

    // Calculate distribution from filtered data
    const distribution = {};
    filteredScores.forEach(entry => {
        const score = entry.score || 0;
        let range = 'negative (<0)';
        if (score >= 6) range = 'high (6+)';
        else if (score >= 3) range = 'medium (3-5)';
        else if (score >= 0) range = 'low (0-2)';
        distribution[range] = (distribution[range] || 0) + 1;
    });

    // Render charts
    renderDistributionChart(distribution);
    renderTrendsChart(aggregates.trends || []);
    renderCategoryChart(aggregates.category_performance || {});

    // Render recent scores table (filtered)
    renderRecentScoresTable(filteredScores.slice(-20).reverse());
    
    // Render anti-patterns table
    const antiPatterns = aggregates.anti_patterns || [];
    renderAntiPatternsTable(antiPatterns.slice(0, 20));
}

function renderDistributionChart(distribution) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        showError('Chart.js library failed to load. Please refresh the page.');
        return;
    }
    
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (distributionChart) {
        distributionChart.destroy();
    }
    
    const labels = Object.keys(distribution);
    const data = Object.values(distribution);
    const colors = labels.map(label => {
        if (label.includes('high')) return '#10b981';
        if (label.includes('medium')) return '#f59e0b';
        if (label.includes('low')) return '#f97316';
        return '#ef4444';
    });
    
    distributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of PRs',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => c + '80'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} PRs`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderTrendsChart(trends) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        showError('Chart.js library failed to load. Please refresh the page.');
        return;
    }
    
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (trendsChart) {
        trendsChart.destroy();
    }
    
    const labels = trends.map(t => t.period);
    const data = trends.map(t => t.average);
    
    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Score',
                data: data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Average: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderCategoryChart(categoryPerformance) {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    const ctx = document.getElementById('categoryChart').getContext('2d');

    if (categoryChart) {
        categoryChart.destroy();
    }

    const categories = Object.keys(categoryPerformance).filter(cat => cat !== 'penalties');
    const averages = categories.map(cat => categoryPerformance[cat]?.average || 0);
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(cat => cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
            datasets: [{
                label: 'Average Score',
                data: averages,
                backgroundColor: colors.slice(0, categories.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

function renderRecentScoresTable(scores) {
    const tbody = document.getElementById('recentScoresBody');
    tbody.innerHTML = '';

    if (scores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-secondary);">No scores available</td></tr>';                        
        return;
    }

    scores.forEach(entry => {
        const row = document.createElement('tr');
        const score = entry.score || 0;
        const breakdown = entry.breakdown || {};

        const scoreClass = score >= 6 ? 'score-high' : score >= 0 ? 'score-medium' : 'score-low';                                                               

        row.innerHTML = `
            <td><a href="https://github.com/verofield/verofield/pull/${entry.pr}" target="_blank">#${entry.pr}</a></td>
            <td>${entry.author || 'N/A'}</td>                                         
            <td class="${scoreClass}">${score}</td>
            <td>${breakdown.tests || 0}</td>
            <td>${breakdown.bug_fix || 0}</td>
            <td>${breakdown.docs || 0}</td>
            <td>${breakdown.performance || 0}</td>
            <td>${breakdown.security || 0}</td>
            <td>${breakdown.penalties || 0}</td>
            <td>${formatDate(entry.timestamp)}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderAntiPatternsTable(antiPatterns) {
    const tbody = document.getElementById('antiPatternsBody');
    tbody.innerHTML = '';

    if (antiPatterns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No anti-patterns detected</td></tr>';
        return;
    }

    antiPatterns.forEach(entry => {
        const row = document.createElement('tr');
        const score = entry.score || 0;
        const breakdown = entry.breakdown || {};
        const breakdownStr = Object.entries(breakdown)
            .filter(([k, v]) => v !== 0)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ') || 'N/A';

        row.innerHTML = `
            <td><a href="https://github.com/verofield/verofield/pull/${entry.pr}" target="_blank">#${entry.pr}</a></td>
            <td class="score-low">${score}</td>
            <td>${entry.penalties || breakdown.penalties || 0}</td>
            <td style="font-size: 0.85em;">${breakdownStr}</td>
            <td>${formatDate(entry.timestamp)}</td>
        `;
        tbody.appendChild(row);
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

function showError(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    container.insertBefore(errorDiv, container.firstChild);
}

// Filter event handlers
function setupFilters() {
    document.getElementById('applyFilters').addEventListener('click', () => {
        currentFilters.dateRange = document.getElementById('dateRange').value;
        currentFilters.author = document.getElementById('authorFilter').value;
        currentFilters.category = document.getElementById('categoryFilter').value;
        currentFilters.scoreRange = document.getElementById('scoreRange').value;
        
        // Reload metrics with filters
        if (typeof loadMetrics === 'function') {
            loadMetrics();
        }
    });
    
    document.getElementById('resetFilters').addEventListener('click', () => {
        document.getElementById('dateRange').value = '30';
        document.getElementById('authorFilter').value = 'all';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('scoreRange').value = 'all';
        
        currentFilters = {
            dateRange: 30,
            author: 'all',
            category: 'all',
            scoreRange: 'all'
        };
        
        // Reload metrics without filters
        if (typeof loadMetrics === 'function') {
            loadMetrics();
        }
    });
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    
    // Wait for Chart.js to load before initializing
    if (typeof Chart !== 'undefined') {
        loadMetrics();
        // Auto-refresh every 5 minutes
        setInterval(loadMetrics, 5 * 60 * 1000);
    } else {
        // Chart.js will call initDashboard when loaded
        console.log('Waiting for Chart.js to load...');
    }
});

