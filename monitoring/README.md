# VeroField Rules v2.1 - Monitoring Configuration

**Purpose:** Monitoring and alerting configuration for VeroField Rules v2.1  
**Created:** 2025-11-23  
**Version:** 1.0.0  
**Status:** Ready for deployment

---

## Overview

This directory contains monitoring and alerting configuration for VeroField Rules v2.1 migration. It includes:

- **Prometheus configuration** - Metrics collection and alert rules
- **Alertmanager configuration** - Alert routing and notifications
- **Alert definitions** - 3 tiers of alerts (Critical, Manual Review, Monitoring)

---

## Directory Structure

```
monitoring/
├── prometheus/
│   ├── prometheus.yml                          # Main Prometheus config
│   └── alerts/
│       ├── critical-rollback-triggers.yml      # Auto-rollback alerts (Tier 1)
│       ├── manual-review-required.yml          # Manual review alerts (Tier 2)
│       └── monitoring-alerts.yml               # Monitoring alerts (Tier 3)
├── alertmanager/
│   └── alertmanager.yml                        # Alertmanager routing config
└── README.md                                   # This file
```

---

## Alert Tiers

### 🚨 Tier 1: Critical (Auto-Rollback)
**Action:** Immediate automatic rollback  
**Response Time:** <5 minutes  
**Alerts:** 5 alerts
- High False Positive Rate (>40%)
- OPA Evaluation Timeout (>5s)
- High CI Failure Rate (>90%)
- High OPA Evaluation Error Rate (>10%)
- CI Time Increase Exceeded (>30%)

### ⚠️ Tier 2: Manual Review Required
**Action:** Governance lead review  
**Response Time:** <4 hours  
**Alerts:** 6 alerts
- Compliance Score Drop (>15 points)
- High Tier 1 Violations (>15/day)
- Moderate False Positive Rate (>20%)
- High Override Request Rate (>10%)
- OPA Performance Degrading (>20% increase)
- High Exemption Usage (>5%)

### 📊 Tier 3: Monitoring
**Action:** Investigation needed  
**Response Time:** <24 hours  
**Alerts:** 7 alerts
- Compliance Score Drop Minor (>5 points)
- Moderate Tier 1 Violations (>5/day)
- Elevated False Positive Rate (>10%)
- OPA Performance Warning (>150ms P99)
- CI Time Increase Warning (>15%)
- Policy Complexity Increasing (>80 lines avg)
- Prometheus Scrape Failing

---

## Quick Start

### Prerequisites

- Prometheus v2.40+ installed
- Alertmanager v0.25+ installed
- Slack workspace with webhook configured
- (Optional) PagerDuty account with service key

### Deployment Steps

1. **Configure environment variables:**
   ```bash
   export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
   export PAGERDUTY_SERVICE_KEY="your-pagerduty-service-key"
   export SMTP_USERNAME="your-smtp-username"
   export SMTP_PASSWORD="your-smtp-password"
   ```

2. **Deploy Prometheus:**
   ```bash
   # Copy configuration
   sudo cp monitoring/prometheus/prometheus.yml /etc/prometheus/
   sudo cp monitoring/prometheus/alerts/*.yml /etc/prometheus/alerts/
   
   # Reload Prometheus
   curl -X POST http://localhost:9090/-/reload
   
   # Verify
   curl http://localhost:9090/api/v1/rules
   ```

3. **Deploy Alertmanager:**
   ```bash
   # Copy configuration
   sudo cp monitoring/alertmanager/alertmanager.yml /etc/alertmanager/
   
   # Restart Alertmanager
   sudo systemctl restart alertmanager
   
   # Verify
   curl http://localhost:9093/api/v1/status
   ```

4. **Test alerts:**
   ```bash
   # Send test alert
   curl -X POST http://localhost:9093/api/v1/alerts \
     -H "Content-Type: application/json" \
     -d '{
       "alerts": [{
         "labels": {
           "alertname": "TestAlert",
           "severity": "info",
           "action": "monitoring"
         },
         "annotations": {
           "summary": "Test alert",
           "description": "This is a test alert"
         }
       }]
     }'
   
   # Check Slack for notification
   ```

---

## Customization

### Required Customizations

Before deploying, customize these values:

1. **Slack channels** (in `alertmanager.yml`):
   - `#compliance-critical` - Critical auto-rollback alerts
   - `#compliance-alerts` - Manual review alerts
   - `#compliance-monitoring` - Monitoring alerts

2. **Email addresses** (in `alertmanager.yml`):
   - `governance-lead@company.com`
   - `rules-champions@company.com`

3. **Metric endpoints** (in `prometheus.yml`):
   - OPA metrics endpoint (default: `localhost:8080`)
   - Compliance API endpoint (default: `localhost:9090`)
   - GitHub Actions exporter (default: `localhost:9091`)

4. **Dashboard URLs** (in alert files):
   - Update `https://grafana.example.com/...` with your Grafana URLs

### Optional Customizations

- **Alert thresholds** - Adjust thresholds in alert files based on your baseline
- **Response times** - Adjust response time labels based on your SLAs
- **Inhibition rules** - Add custom inhibition rules in `alertmanager.yml`
- **Notification channels** - Add additional receivers (email, PagerDuty, etc.)

---

## Testing

### Test Individual Alerts

```bash
# Test critical alert
amtool alert add \
  --alertmanager.url=http://localhost:9093 \
  alertname=HighFalsePositiveRate \
  severity=critical \
  action=auto-rollback

# Test manual review alert
amtool alert add \
  --alertmanager.url=http://localhost:9093 \
  alertname=ComplianceScoreDrop \
  severity=warning \
  action=manual-review

# Test monitoring alert
amtool alert add \
  --alertmanager.url=http://localhost:9093 \
  alertname=ComplianceScoreDropMinor \
  severity=info \
  action=monitoring
```

### Verify Alert Routing

```bash
# Check active alerts
curl http://localhost:9093/api/v1/alerts

# Check alert groups
curl http://localhost:9093/api/v1/alerts/groups

# Check silences
curl http://localhost:9093/api/v1/silences
```

---

## Troubleshooting

### Prometheus not scraping metrics

```bash
# Check targets status
curl http://localhost:9090/api/v1/targets

# Check Prometheus logs
sudo journalctl -u prometheus -f

# Verify metric endpoints are accessible
curl http://localhost:8080/metrics  # OPA
curl http://localhost:9090/metrics  # Compliance API
```

### Alerts not firing

```bash
# Check alert rules
curl http://localhost:9090/api/v1/rules

# Check alert evaluation
curl 'http://localhost:9090/api/v1/query?query=ALERTS'

# Check Prometheus logs
sudo journalctl -u prometheus -f | grep -i alert
```

### Slack notifications not received

```bash
# Test Slack webhook
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test notification"}'

# Check Alertmanager logs
sudo journalctl -u alertmanager -f

# Verify Alertmanager config
amtool config show --alertmanager.url=http://localhost:9093
```

---

## Maintenance

### Regular Tasks

- **Weekly:** Review alert frequency and adjust thresholds if needed
- **Monthly:** Review false positive rate and refine alert rules
- **Quarterly:** Review and update dashboard URLs and runbook links

### Updating Alerts

```bash
# Edit alert files
vim monitoring/prometheus/alerts/critical-rollback-triggers.yml

# Reload Prometheus
curl -X POST http://localhost:9090/-/reload

# Verify changes
curl http://localhost:9090/api/v1/rules | jq '.data.groups[].rules[] | select(.name=="HighFalsePositiveRate")'
```

---

## Documentation

- **Alert Configuration Guide:** `docs/operations/alert-threshold-configuration.md`
- **Rollback Procedures:** `docs/operations/rollback-procedures.md`
- **Migration Guide:** `docs/developer/migration-v2.0-to-v2.1-DRAFT.md`

---

## Support

- **Slack:** #compliance-support
- **On-Call:** [CUSTOMIZE: Add PagerDuty/on-call info]
- **Governance Lead:** [CUSTOMIZE: Add contact info]

---

**Last Updated:** 2025-11-23  
**Maintained By:** DevOps + Governance Lead  
**Version:** 1.0.0



