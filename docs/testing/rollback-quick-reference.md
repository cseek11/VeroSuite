# Rollback Quick Reference Card

**Purpose:** One-page cheat sheet for emergency rollback execution  
**Created:** 2025-12-05  
**Version:** 1.0.0  
**For:** DevOps Team (print or keep open during rollback)

---

## 🚨 Emergency Contacts

**[CUSTOMIZE: Fill in your organization's contacts]**

| Role | Name | Phone | Slack | Email |
|------|------|-------|-------|-------|
| **Governance Lead** | ___ | ___ | @___ | ___ |
| **On-Call DevOps** | ___ | ___ | @___ | ___ |
| **Rules Champions** | ___ | ___ | @___ | ___ |
| **Emergency Escalation** | ___ | ___ | @___ | ___ |

**PagerDuty:** [CUSTOMIZE: Add PagerDuty service name]  
**Slack Channel:** #compliance-emergency

---

## ⚡ Critical Commands (One-Liners)

### Disable All OPA Policies (Emergency)
```bash
# Disable OPA in CI (5 minutes)
sed -i 's/- name: Run OPA evaluation/# - name: Run OPA evaluation/' .github/workflows/compliance-scan.yml && \
git commit -m "EMERGENCY: Disable OPA policies" && git push
```

### Revert to v2.0 Rules (Full Rollback)
```bash
# Find v2.0 commit and revert (15 minutes)
git checkout $(git log --oneline --grep="v2.0" | head -1 | cut -d' ' -f1) -- .cursor/rules/ && \
git commit -m "EMERGENCY: Rollback to v2.0 rules" && git push
```

### Notify Team (Slack)
```bash
# Post to Slack (1 minute)
curl -X POST $SLACK_WEBHOOK -d '{"text":"🚨 EMERGENCY ROLLBACK IN PROGRESS"}'
```

### Check Rollback Status
```bash
# Verify OPA disabled
grep -q "# - name: Run OPA evaluation" .github/workflows/compliance-scan.yml && echo "✅ OPA DISABLED" || echo "❌ OPA STILL ACTIVE"
```

---

## 🎯 Go/No-Go Decision Tree

```
Is production affected?
├─ YES → Emergency Rollback (<10 min)
│   └─ Disable OPA → Revert rules → Notify team
│
└─ NO → Check severity
    ├─ False positive rate >40% → Auto-rollback (<5 min)
    ├─ OPA timeout >5s → Auto-rollback (<5 min)
    ├─ CI failure rate >90% → Auto-rollback (<5 min)
    └─ Other → Manual review (<4 hours)
        └─ Governance Lead decides
```

---

## ⏱️ Expected Rollback Times

| Phase | Risk | Time | Command |
|-------|------|------|---------|
| **Phase -1** | LOW | 30 min | `rm -rf services/opa/` |
| **Phase 0** | MEDIUM | 45 min | `git checkout <v2.0> -- .cursor/rules/` |
| **Phase 1** | HIGH | 60 min | Disable Tier 1 policies |
| **Phase 2** | MEDIUM | 60 min | Disable Tier 2/3 policies |
| **Phase 3** | LOW | 30 min | Disable dashboard routes |
| **Emergency** | CRITICAL | 90 min | Full system rollback |

**Target:** All rollbacks <60 minutes (except emergency)

---

## 🚦 Escalation Triggers

### 🚨 Automatic Rollback (Immediate)
- False positive rate >40%
- OPA timeout >5s per policy
- CI failure rate >90%
- Production incident caused by OPA

### ⚠️ Manual Review (4 hours)
- Compliance score drop >15 points
- Tier 1 violations >15/day
- False positive rate >20%
- Override usage >30%

### 📊 Monitor (Investigate)
- Compliance score drop >5 points
- OPA time >200ms average
- Tier 1 violations >5/day
- False positive rate >10%

---

## 📋 Rollback Checklist (Quick)

- [ ] **Assess:** Production impact? (YES → Emergency, NO → Check triggers)
- [ ] **Disable:** OPA policies in CI (5 min)
- [ ] **Revert:** Rule files if needed (15 min)
- [ ] **Notify:** Team via Slack/Email (1 min)
- [ ] **Verify:** System operational (5 min)
- [ ] **Investigate:** Root cause (ongoing)
- [ ] **Fix:** Apply solution (ongoing)
- [ ] **Re-enable:** Policies after fix (10 min)

**Total Time:** <60 minutes (except emergency)

---

## 🔄 Restore Process (After Fix)

```bash
# 1. Restore policies
git checkout main -- services/opa/policies/
git checkout main -- .github/workflows/compliance-scan.yml

# 2. Test on sample PR
# Create test PR → Verify policies work

# 3. Re-enable in CI
git commit -m "Restore: OPA policies after fix"
git push

# 4. Monitor dashboard
# Verify violations detected correctly
```

---

## 📞 Escalation Path

```
Level 1: Monitoring Alert (Automated)
  ↓ (1 hour)
Level 2: Rules Champions
  ↓ (2 hours)
Level 3: Governance Lead
  ↓ (4 hours)
Level 4: Emergency Rollback Decision
  ↓ (critical)
Level 5: CTO/VP Engineering
```

**Contact:** [CUSTOMIZE: Add escalation contacts]

---

## 📚 Full Documentation

- **Detailed Checklist:** `docs/testing/rollback-testing-checklist.md`
- **Migration Guide:** `docs/developer/migration-v2.0-to-v2.1-DRAFT.md`
- **Alert Configuration:** `docs/operations/alert-threshold-configuration.md`

---

**Last Updated:** 2025-12-05  
**Print This Page:** Keep near your workstation for emergencies





