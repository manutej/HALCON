# 🛡️ HALCON Protection Strategy - Never Lose Working Code

## Critical Safety Measures

### 1. Git Tags for Recovery Points

**Current Safe State:** `v1.0.0-working`

```bash
# View all safe states
git tag -l "v*-working"

# Restore to last working state
git checkout v1.0.0-working

# Restore only commands (if something breaks)
git checkout v1.0.0-working -- commands/
```

### 2. Protected Files (NEVER MODIFY DIRECTLY)

These files are WORKING and TESTED. Changes must go through development branch:

```
commands/
├── halcon          🔒 PROTECTED - Main router
├── transits        🔒 PROTECTED - Planetary transits
├── chart           🔒 PROTECTED - Natal charts
├── progressions    🔒 PROTECTED - Secondary progressions
└── aspects         🔒 PROTECTED - Aspect calculations
```

### 3. Branch Protection Strategy

```
main                    🔒 LOCKED - Only working, tested code
├── v1.0.0-working     🏷️  TAG - Current safe state
├── v1.1.0-working     🏷️  TAG - After House Systems added
├── v1.2.0-working     🏷️  TAG - After Synastry added
└── ...

develop                 🔓 UNLOCKED - Integration branch
├── feature/swisseph-wrapper
├── feature/i18n
├── feature/houses
├── feature/synastry
└── ...
```

### 4. Development Workflow (MANDATORY)

```bash
# ❌ NEVER do this:
git checkout main
# edit commands/chart  ← DANGER! Could break working code

# ✅ ALWAYS do this:
git checkout develop
git checkout -b feature/new-feature
# Create NEW files alongside existing ones
# Test thoroughly
# Merge to develop
# Test integration
# Only then merge to main
```

### 5. Backup Strategy

**Before ANY changes:**

```bash
# 1. Tag current state
git tag -a v1.x.x-working -m "Safe state before [feature]"

# 2. Create develop branch if not exists
git checkout -b develop

# 3. Create feature branch
git checkout -b feature/[name]

# 4. Work in feature branch only
# ... make changes ...

# 5. Test thoroughly
npm test
./commands/halcon --version

# 6. Merge to develop (NOT main)
git checkout develop
git merge feature/[name]

# 7. Integration test on develop
npm run test:integration

# 8. Only after ALL tests pass, merge to main
git checkout main
git merge develop
git tag -a v1.x.x-working -m "Safe state after [feature]"
```

### 6. File Organization (Additive, Not Replacement)

**❌ BAD (Destructive):**
```bash
# Replace existing command
rm commands/chart
# Write new version
echo "..." > commands/chart  ← DANGER!
```

**✅ GOOD (Additive):**
```bash
# Create new implementation alongside old
commands/
├── chart              ← Keep existing (working!)
├── chart-v2           ← New version (experimental)
└── _lib/
    └── chart-core.ts  ← Shared logic

# Test new version
./commands/chart-v2 manu

# Only after thorough testing, replace
mv commands/chart commands/chart.backup
mv commands/chart-v2 commands/chart
# Test again
./commands/chart manu
# If broken, restore
mv commands/chart.backup commands/chart
```

### 7. Testing Requirements (Before Merging to Main)

**Checklist:**
```bash
# ✓ All existing commands still work
./commands/halcon transits
./commands/halcon chart manu
./commands/halcon progressions manu
./commands/halcon aspects

# ✓ New features work
./commands/halcon houses manu
./commands/halcon synastry manu alice

# ✓ Unit tests pass
npm run test:unit

# ✓ Integration tests pass  
npm run test:integration

# ✓ No regressions
npm run test:regression

# ✓ Manual verification
halcon --version
halcon --help
```

### 8. Emergency Recovery Procedures

**If something breaks:**

```bash
# Step 1: Don't panic - we have backups!

# Step 2: Check what changed
git diff v1.0.0-working

# Step 3: Restore to last working state
git checkout v1.0.0-working

# Step 4: Create recovery branch
git checkout -b recovery/fix-issue

# Step 5: Identify the problem
git log --oneline

# Step 6: Restore specific files
git checkout v1.0.0-working -- commands/chart

# Step 7: Test restoration
./commands/chart manu

# Step 8: Commit fix
git add commands/chart
git commit -m "fix: restore working chart command from v1.0.0-working"
```

### 9. Safe Upgrade Path

**How to add new features WITHOUT breaking existing ones:**

```typescript
// Example: Adding Chiron to chart command

// commands/chart (existing - DON'T TOUCH)
// ... existing code ...

// src/lib/celestial-bodies.ts (NEW FILE)
export const STANDARD_BODIES = ['sun', 'moon', 'mercury', ...];
export const EXTENDED_BODIES = [...STANDARD_BODIES, 'chiron', 'lilith'];

// commands/chart-enhanced (NEW FILE - test here first)
import { EXTENDED_BODIES } from '../src/lib/celestial-bodies.ts';
// ... new implementation with Chiron ...

// After testing chart-enhanced works perfectly:
// 1. Rename chart to chart-legacy
// 2. Rename chart-enhanced to chart
// 3. Test again
// 4. If broken, rename back
```

### 10. Version Control Best Practices

**Commit Messages:**
```bash
# ✅ GOOD
git commit -m "feat(houses): add Placidus house system calculation"
git commit -m "fix(chart): restore working geocoding integration"
git commit -m "test(aspects): add tests for Chiron aspects"

# ❌ BAD
git commit -m "stuff"
git commit -m "fixed it"
git commit -m "wip"
```

**Branch Names:**
```bash
# ✅ GOOD
feature/swiss-ephemeris-wrapper
feature/i18n-infrastructure
bugfix/chart-timezone-issue

# ❌ BAD
new-stuff
fix
temp
```

### 11. Pre-Commit Checklist

Before `git commit`:
- [ ] Existing commands still work
- [ ] New code has tests
- [ ] Tests pass locally
- [ ] No debug console.log() left in code
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

### 12. GitHub Protection Rules (After Setup)

**main branch:**
- Require PR approval
- Require status checks to pass
- No force push
- No deletion

**develop branch:**
- Require status checks to pass
- Allow force push (for rebasing)

### 13. Backup Locations

**Local:**
```bash
# Git tags
git tag -l

# Stash
git stash list

# Reflog (30-day history)
git reflog
```

**Remote:**
```bash
# GitHub (after push)
https://github.com/[user]/halcon-astro-platform/releases
https://github.com/[user]/halcon-astro-platform/tags
```

### 14. Recovery Commands Quick Reference

```bash
# List all safe states
git tag -l "*-working"

# Restore entire repo to safe state
git checkout v1.0.0-working

# Restore only commands directory
git checkout v1.0.0-working -- commands/

# See what changed since safe state
git diff v1.0.0-working

# Create new branch from safe state
git checkout -b feature/new-work v1.0.0-working

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Find lost commits
git reflog
git checkout [commit-hash]
```

---

## 🎯 Golden Rule

**"If it works, TAG IT. If it's experimental, BRANCH IT. If it breaks, REVERT IT."**

Never let working code disappear. When in doubt, create a tag first.

---

**Last Updated:** 2025-10-06  
**Safe State Tag:** v1.0.0-working
