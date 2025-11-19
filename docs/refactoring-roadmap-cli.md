# CLI Commands Refactoring Roadmap

**Created**: 2025-11-19
**Status**: Planning Phase
**Estimated Total Effort**: 25-35 hours
**Expected Impact**: 73% code reduction, 100% duplication elimination

---

## Visual Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REFACTORING ROADMAP                                 │
│                    From 956 lines to ~260 lines                             │
└─────────────────────────────────────────────────────────────────────────────┘

WEEK 1: FOUNDATION
═══════════════════════════════════════════════════════════════════════════════

Day 1-2: Shared Utilities (3-4 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: URGENT | Risk: LOW | Impact: HIGH                 │
├─────────────────────────────────────────────────────────────┤
│ Create:                                                     │
│  ✓ src/lib/display/formatters.ts                           │
│  ✓ src/lib/display/symbols.ts                              │
│  ✓ src/utils/cli/borders.ts                                │
│                                                             │
│ Eliminates: ~100 lines of duplication                      │
│ Benefits: Immediate code reuse                              │
└─────────────────────────────────────────────────────────────┘

Day 2-3: Type Definitions (2-3 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: URGENT | Risk: LOW | Impact: HIGH                 │
├─────────────────────────────────────────────────────────────┤
│ Create:                                                     │
│  ✓ src/lib/display/types.ts                                │
│  ✓ Update src/lib/swisseph/types.ts                        │
│                                                             │
│ Eliminates: All 'any' types                                │
│ Benefits: Full type safety                                  │
└─────────────────────────────────────────────────────────────┘

Day 3-5: Profile Middleware (4-5 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: HIGH | Risk: MEDIUM | Impact: CRITICAL            │
├─────────────────────────────────────────────────────────────┤
│ Create:                                                     │
│  ✓ src/lib/middleware/profile-loader.ts                    │
│  ✓ src/lib/profiles/timezone.ts                            │
│                                                             │
│ Eliminates: ~200 lines of duplication                      │
│ Benefits: Consistent profile handling                       │
└─────────────────────────────────────────────────────────────┘

Day 5: Error Handling (2-3 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: HIGH | Risk: LOW | Impact: MEDIUM                 │
├─────────────────────────────────────────────────────────────┤
│ Create:                                                     │
│  ✓ src/lib/middleware/error-handler.ts                     │
│                                                             │
│ Eliminates: Inconsistent error messages                    │
│ Benefits: Standardized UX                                   │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
WEEK 1 COMPLETION: 50% of refactoring done
                   ~300 lines eliminated
                   Foundation established
═══════════════════════════════════════════════════════════════════════════════


WEEK 2: DISPLAY LAYER & COMMAND REFACTORING
═══════════════════════════════════════════════════════════════════════════════

Day 6-8: Display Renderers (6-8 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: MEDIUM | Risk: LOW | Impact: HIGH                 │
├─────────────────────────────────────────────────────────────┤
│ Create:                                                     │
│  ✓ src/lib/display/renderers/chart-renderer.ts             │
│  ✓ src/lib/display/renderers/houses-renderer.ts            │
│  ✓ src/lib/display/renderers/progressions-renderer.ts      │
│                                                             │
│ Eliminates: ~250 lines of display logic                    │
│ Benefits: Separation of concerns                            │
└─────────────────────────────────────────────────────────────┘

Day 9-10: Refactor Commands (4-6 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: MEDIUM | Risk: MEDIUM | Impact: CRITICAL          │
├─────────────────────────────────────────────────────────────┤
│ Refactor:                                                   │
│  ✓ chart.ts: 258 → ~80 lines (69% reduction)               │
│  ✓ houses.ts: 293 → ~80 lines (73% reduction)              │
│  ✓ progressions.ts: 405 → ~100 lines (75% reduction)       │
│                                                             │
│ Eliminates: Remaining duplication                          │
│ Benefits: Thin, maintainable commands                       │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
WEEK 2 COMPLETION: 80% of refactoring done
                   ~700 lines eliminated
                   Clean architecture achieved
═══════════════════════════════════════════════════════════════════════════════


WEEK 3: TESTING & DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════════

Day 11-13: Unit Tests (6-8 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: HIGH | Risk: LOW | Impact: CRITICAL               │
├─────────────────────────────────────────────────────────────┤
│ Test Coverage:                                              │
│  ✓ formatters.ts: 100%                                      │
│  ✓ symbols.ts: 100%                                         │
│  ✓ profile-loader.ts: 100%                                  │
│  ✓ error-handler.ts: 100%                                   │
│  ✓ All renderers: >80%                                      │
│                                                             │
│ Benefits: Confidence, prevent regressions                   │
└─────────────────────────────────────────────────────────────┘

Day 13-14: Integration Tests (2-3 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: MEDIUM | Risk: LOW | Impact: HIGH                 │
├─────────────────────────────────────────────────────────────┤
│ Test:                                                       │
│  ✓ Complete command flows                                   │
│  ✓ Error scenarios                                          │
│  ✓ Edge cases                                               │
│                                                             │
│ Benefits: End-to-end validation                             │
└─────────────────────────────────────────────────────────────┘

Day 14-15: Documentation (2-3 hours)
┌─────────────────────────────────────────────────────────────┐
│ Priority: HIGH | Risk: LOW | Impact: MEDIUM                 │
├─────────────────────────────────────────────────────────────┤
│ Document:                                                   │
│  ✓ Update docs/progress.md                                 │
│  ✓ Architecture documentation                               │
│  ✓ JSDoc comments                                           │
│  ✓ Update README                                            │
│                                                             │
│ Benefits: Knowledge transfer, maintainability               │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
WEEK 3 COMPLETION: 100% refactoring complete
                   Tests passing, docs updated
                   Ready for production
═══════════════════════════════════════════════════════════════════════════════
```

---

## Dependency Graph

```
┌────────────────────────────────────────────────────────────────┐
│                      DEPENDENCY GRAPH                          │
│         (What needs to be built before what)                   │
└────────────────────────────────────────────────────────────────┘

                         START
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    formatters.ts    symbols.ts      borders.ts
      (3 hours)       (1 hour)        (1 hour)
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                      types.ts
                      (2 hours)
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    profile-loader   error-handler   timezone.ts
      (4 hours)        (2 hours)      (1 hour)
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                    Renderers Layer
                    ┌──────┴──────┐
                    │      │      │
                    ▼      ▼      ▼
                 chart  houses  prog
                render render  render
                (2h)   (2h)    (3h)
                    │      │      │
                    └──────┼──────┘
                           │
                           ▼
                   Refactor Commands
                   ┌──────┴──────┐
                   │      │      │
                   ▼      ▼      ▼
               chart   houses   prog
               (2h)    (1h)    (2h)
                   │      │      │
                   └──────┼──────┘
                           │
                           ▼
                        Tests
                   ┌──────┴──────┐
                   │             │
                   ▼             ▼
                 Unit       Integration
                (6h)          (3h)
                   │             │
                   └──────┬──────┘
                          │
                          ▼
                   Documentation
                       (3h)
                          │
                          ▼
                        DONE

CRITICAL PATH: 22 hours
TOTAL EFFORT: 25-35 hours (including testing)
```

---

## Risk Assessment

### Low Risk (Safe to Start Immediately)

```
✅ formatters.ts
   - Pure functions
   - Easy to test
   - No external dependencies

✅ symbols.ts
   - Constant data
   - No side effects
   - Trivial to verify

✅ borders.ts
   - Simple utilities
   - Visual only
   - Low impact if bugs exist

✅ types.ts
   - Compile-time only
   - TypeScript will catch errors
   - No runtime impact
```

### Medium Risk (Needs Testing)

```
⚠️  profile-loader.ts
   - Complex logic
   - Timezone conversions
   - Needs thorough testing
   - Mitigation: Write tests first (TDD)

⚠️  Commands refactoring
   - Behavior must stay identical
   - User-facing changes
   - Mitigation: Integration tests before & after
```

### Zero Risk (Already Tested)

```
✅ Existing functionality
   - Current commands work
   - Keep them until new code tested
   - Parallel development possible
```

---

## Success Metrics

### Code Quality Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| **Lines of Code** | 956 | ~260 | `cloc src/commands/` |
| **Duplication** | ~300 lines | 0 | Manual review |
| **Test Coverage** | ~40% | >80% | `npm run test:coverage` |
| **Type Safety** | Many `any` | 0 `any` | `tsc --noImplicitAny` |
| **Cyclomatic Complexity** | High | Low | ESLint complexity rule |
| **Function Length** | >100 lines | <50 lines | ESLint max-lines rule |

### Performance Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| **Command Startup** | ~200ms | <150ms | `time halcon-chart` |
| **Import Size** | Large | Small | Bundle analysis |
| **Memory Usage** | Baseline | Same or better | `node --trace-gc` |

### Developer Experience Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| **New Command Creation** | 2-3 hours | <30 min | Time to add command |
| **Bug Fix Time** | 3 locations | 1 location | Track bug fixes |
| **Onboarding Time** | 2-3 days | <1 day | New dev feedback |

---

## Rollout Strategy

### Phase 1: Parallel Development (Week 1)

```
1. Create new modules WITHOUT touching existing commands
2. Write tests for new modules
3. Existing commands continue working
4. Zero user impact
```

### Phase 2: Gradual Migration (Week 2)

```
1. Refactor ONE command at a time
2. Keep old version for rollback
3. Test extensively before next command
4. User impact: None (same behavior)
```

### Phase 3: Cleanup (Week 3)

```
1. Remove old code once all commands migrated
2. Run full test suite
3. Update documentation
4. User impact: None (invisible refactor)
```

### Rollback Plan

```
IF something breaks:
  1. Git revert to last working commit
  2. Deploy old version immediately
  3. Fix issue in development branch
  4. Re-deploy when fixed

BECAUSE:
  - Each commit is atomic
  - Tests prevent regressions
  - Parallel development = easy rollback
```

---

## Developer Checklist

Use this checklist for each refactoring task:

### Before Starting
- [ ] Read architecture review document
- [ ] Understand dependencies (check graph above)
- [ ] Ensure prerequisites are complete
- [ ] Create feature branch: `feature/refactor-<component>`

### During Development (TDD)
- [ ] Write tests first (RED)
- [ ] Implement minimal code to pass (GREEN)
- [ ] Refactor for clarity (REFACTOR)
- [ ] Ensure >80% test coverage
- [ ] Run TypeScript compiler (no errors)
- [ ] Run ESLint (no warnings)

### Before Committing
- [ ] All tests passing
- [ ] Test coverage meets minimum
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Manual testing of affected commands
- [ ] Documentation updated (JSDoc)

### Commit & Push
- [ ] Atomic commit (one logical change)
- [ ] Descriptive commit message
- [ ] Reference Linear issue
- [ ] Push to feature branch
- [ ] Create PR with checklist

### PR Review
- [ ] Self-review before requesting review
- [ ] All CI checks passing
- [ ] No merge conflicts
- [ ] Documentation complete
- [ ] Ready for team review

---

## Quick Start Guide

### Start Refactoring Today

```bash
# 1. Create feature branch
git checkout -b feature/refactor-cli-foundation

# 2. Create directory structure
mkdir -p src/lib/display src/lib/middleware src/utils/cli

# 3. Start with formatters (safest, highest impact)
touch src/lib/display/formatters.ts
touch src/lib/display/__tests__/formatters.test.ts

# 4. Write test first (TDD)
# Open formatters.test.ts and write tests

# 5. Implement to pass tests
# Open formatters.ts and implement

# 6. Verify
npm run test formatters
npm run typecheck
npm run lint

# 7. Commit
git add src/lib/display/formatters.*
git commit -m "feat(display): Add formatDegree and coordinate formatters

- Add formatDegree() with configurable sign format
- Add formatCoordinates() with hemisphere indicators
- Add calculateMovement() for planetary motion
- Add formatMovement() with direction indicators

Testing:
- 100% test coverage
- All edge cases handled
- Validates against existing behavior

Related: HALCON-XXX"

# 8. Push and continue
git push -u origin feature/refactor-cli-foundation
```

---

## Resources

### Reference Documents
- [Architecture Review](./architecture-review-cli-commands.md) - Full analysis
- [CLAUDE.md](../CLAUDE.md) - TDD requirements
- [Progress Tracking](./progress.md) - Update after each phase

### Testing Resources
- [Jest Documentation](https://jestjs.io/)
- [Testing Commander.js](https://github.com/tj/commander.js/tree/master/tests)
- [Chalk Testing](https://github.com/chalk/chalk#testing) - Strip colors in tests

### Architecture Patterns
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

---

## Questions & Support

**Questions During Refactoring?**
1. Check architecture review document
2. Check this roadmap
3. Review existing code patterns
4. Ask team for guidance

**Blockers?**
- Document in Linear issue
- Update roadmap with revised estimate
- Communicate early

**Ideas for Improvement?**
- Document in architecture review
- Create separate Linear issue
- Discuss in PR

---

**STATUS**: Ready to Begin
**NEXT STEP**: Create Linear issue and start Phase 1
