# REWARD_SCORE Dashboard

**Last Updated:** 2025-12-05

## Quick Start

### Option 1: Local HTTP Server (Recommended)

The dashboard requires an HTTP server due to browser CORS restrictions when loading local files.

**Using Python:**
```bash
# Python 3
cd docs/metrics
python -m http.server 8000

# Then open: http://localhost:8000/dashboard.html
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run server
cd docs/metrics
http-server -p 8000

# Then open: http://localhost:8000/dashboard.html
```

**Using PowerShell (Windows):**
```powershell
cd docs/metrics
.\serve.ps1
```

This will start a simple HTTP server on http://localhost:8000/

### Option 2: GitHub Pages

If the repository is hosted on GitHub, you can enable GitHub Pages:
1. Go to repository Settings > Pages
2. Select source branch (e.g., `main`)
3. Select folder: `/docs`
4. Access dashboard at: `https://[username].github.io/[repo]/metrics/dashboard.html`

### Option 3: VS Code Live Server

If using VS Code:
1. Install "Live Server" extension
2. Right-click on `dashboard.html`
3. Select "Open with Live Server"

## Setup Chart.js

The dashboard uses Chart.js for visualization. You have two options:

### Option 1: Download Chart.js Locally (Recommended)

**Using PowerShell script:**
```powershell
cd docs/metrics
.\download-chartjs.ps1
```

**Manual download:**
1. Download Chart.js 4.4.0 from: https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
2. Save it to: `docs/metrics/lib/chart.umd.min.js`
3. The dashboard will automatically use the local copy

### Option 2: Use CDN (Fallback)

The dashboard will automatically fall back to CDN if local copy is not available. However, some browsers may block CDN resources due to tracking prevention.

## Troubleshooting

### CORS Error: "Cross origin requests are only supported for protocol schemes"

**Problem:** Opening `dashboard.html` directly from file system (file:// protocol)

**Solution:** Use a local HTTP server (see Option 1 above)

### Chart.js Not Loading

**Problem:** Browser tracking prevention blocking CDN

**Solution:** 
1. Download Chart.js locally (see Setup Chart.js above)
2. Or adjust browser tracking prevention settings (not recommended for security)

### No Data Showing

**Problem:** `reward_scores.json` is empty or missing

**Solution:**
1. Ensure metrics collection workflow has run
2. Check that `reward_scores.json` exists in `docs/metrics/`
3. Verify JSON file is valid (check for syntax errors)

## Files

- `dashboard.html` - Main dashboard page
- `dashboard.js` - Dashboard JavaScript logic
- `dashboard.css` - Dashboard styles
- `reward_scores.json` - Metrics data (auto-generated)
- `REWARD_SCORE_GUIDE.md` - Scoring guide
- `DASHBOARD_GUIDE.md` - Dashboard usage guide

## Reference

- **Metrics Script:** `.cursor/scripts/collect_metrics.py`
- **Update Workflow:** `.github/workflows/update_metrics_dashboard.yml`
- **Score Guide:** `REWARD_SCORE_GUIDE.md`

