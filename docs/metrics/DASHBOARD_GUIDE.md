# Dashboard Guide

**Last Updated:** 2025-12-05

## Overview

The REWARD_SCORE Dashboard provides a visual representation of code quality metrics across all Pull Requests in the VeroField repository.

## Accessing the Dashboard

The dashboard is available at:
- **Local:** Open `docs/metrics/dashboard.html` in your web browser (requires HTTP server due to CORS)
- **HTTP Server:** Run `python -m http.server 8000` in `docs/metrics/` directory, then open `http://localhost:8000/dashboard.html`
- **GitHub Pages:** (if configured) View at repository's GitHub Pages URL

**Note:** The dashboard must be served via HTTP server (not file://) due to browser CORS restrictions when loading JSON data.

## Dashboard Components

### Filters Section

Filter controls at the top allow you to:
- Filter by date range (7, 30, 90 days, or all time)
- Filter by author (dynamically populated from data)
- Filter by category (tests, bug_fix, docs, performance, security)
- Filter by score range (high, medium, low)
- Apply or reset filters

**Note:** All charts and tables update based on active filters.

### Metric Cards

Four key metrics are displayed (updated based on filters):

1. **Total PRs:** Total number of PRs with scores (filtered)
2. **Average Score:** Average REWARD_SCORE across filtered PRs
3. **High Scores (6+):** Number of filtered PRs with scores ≥ 6
4. **Low Scores (<0):** Number of filtered PRs with scores < 0

### Score Distribution Chart

A bar chart showing the distribution of scores across different ranges:
- **High (6+):** Green bars
- **Medium (3-5):** Orange bars
- **Low (0-2):** Red-orange bars
- **Negative (<0):** Red bars

### Score Trends Chart

A line chart showing the average score trend over the last 30 days, grouped by week. Helps identify:
- Improving or declining code quality trends
- Impact of process changes
- Seasonal patterns

### Category Performance Chart

A doughnut chart showing average scores by category:
- **Tests:** Average test score contribution
- **Bug Fix:** Average bug fix score contribution
- **Docs:** Average documentation score contribution
- **Performance:** Average performance score contribution
- **Security:** Average security score contribution

### Recent Scores Table

A table showing the 20 most recent PR scores (filtered) with:
- **PR #:** Link to the PR on GitHub
- **Author:** PR author username
- **Score:** Total REWARD_SCORE (color-coded)
- **Tests:** Points from test coverage
- **Bug Fix:** Points from bug fixes
- **Docs:** Points from documentation
- **Performance:** Points from performance improvements
- **Security:** Points from security analysis
- **Penalties:** Penalty points applied
- **Date:** When the score was computed

### Anti-Patterns Table

A table showing PRs with scores ≤ 0, including:
- **PR #:** Link to the PR on GitHub
- **Score:** Negative or zero score
- **Penalties:** Penalty points applied
- **Breakdown:** Category breakdown showing issues
- **Date:** When the score was computed

### Filters

The dashboard includes filtering capabilities:
- **Date Range:** Filter by last 7, 30, 90 days, or all time
- **Author:** Filter by PR author
- **Category:** Filter by scoring category (tests, bug_fix, docs, performance, security)
- **Score Range:** Filter by score range (high 6+, medium 0-5, low <0)
- **Apply Filters:** Apply selected filters to all charts and tables
- **Reset:** Clear all filters and show all data

## Interpreting the Data

### Healthy Metrics
- **Average Score:** Should be above 3.0
- **High Scores:** Should represent 30%+ of PRs
- **Low Scores:** Should be < 10% of PRs
- **Trends:** Should show stable or improving trend

### Warning Signs
- **Declining Trends:** Average score decreasing over time
- **High Low Scores:** Many PRs with negative scores
- **Low High Scores:** Few PRs achieving high scores

## Data Source

The dashboard reads from `docs/metrics/reward_scores.json`, which is automatically updated by the CI workflow after each PR is scored.

## Updating the Dashboard

The dashboard updates automatically:
1. After each PR is scored (via CI workflow)
2. Daily at midnight UTC (scheduled job)
3. Manually via workflow dispatch

## Troubleshooting

### Dashboard Not Loading
- Ensure `reward_scores.json` exists in `docs/metrics/`
- Check browser console for errors
- Verify file permissions

### No Data Showing
- Check if any PRs have been scored yet
- Verify metrics collection is working
- Check CI workflow logs

### Charts Not Rendering
- Ensure Chart.js is loaded (CDN)
- Check browser console for JavaScript errors
- Verify JSON data format is correct

## Reference

- **Metrics Script:** `.cursor/scripts/collect_metrics.py`
- **Update Workflow:** `.github/workflows/update_metrics_dashboard.yml`
- **Score Guide:** `REWARD_SCORE_GUIDE.md`

---

**Note:** The dashboard requires a modern web browser with JavaScript enabled. For best results, use Chrome, Firefox, Safari, or Edge.

