# HALCON Quick Start Guide
**Get from zero to first test in 30 minutes**

---

## 🎯 Goal
Bootstrap HALCON development environment and run your first test following TDD methodology.

---

## ✅ Prerequisites Checklist

- [ ] Git installed and configured
- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm or pnpm available
- [ ] Code editor (VS Code recommended)
- [ ] Terminal access

---

## 🚀 Quick Start (30 Minutes)

### Step 1: Clean Repository (5 min)

```bash
# Navigate to HALCON directory
cd /Users/manu/Documents/LUXOR/PROJECTS/HALCON

# Check current git status
git status

# Review untracked files
ls -la .claude/agents/
ls -la .claude/commands/
ls -la commands/

# Add files to git (or .gitignore)
git add .claude/agents/
git add .claude/commands/
git add commands/aspects.backup

# Check claude-sdk-microservice
cd claude-sdk-microservice
git status
# If changes exist, commit or stash them
cd ..

# Commit organization
git commit -m "chore: organize repository structure

- Track .claude configuration files
- Track custom commands
- Clean up repository state

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Step 2: Initialize TypeScript Project (10 min)

```bash
# Initialize package.json
npm init -y

# Install core dependencies
npm install -D typescript @types/node tsx
npm install -D @tsconfig/node20

# Install Vitest (modern testing framework)
npm install -D vitest @vitest/ui @vitest/coverage-v8

# Install essential tools
npm install -D eslint prettier
npm install commander chalk ora

# Install Swiss Ephemeris (foundation)
npm install swisseph
```

### Step 3: Create Configuration Files (5 min)

**Create `tsconfig.json`:**
```bash
cat > tsconfig.json << 'EOF'
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF
```

**Create `vitest.config.ts`:**
```bash
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.config.ts'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
EOF
```

**Update `package.json` scripts:**
```bash
# Open package.json and add these scripts:
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:verify": "vitest run",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  }
}
```

### Step 4: Create Project Structure (3 min)

```bash
# Create directory structure
mkdir -p src/{lib/{swisseph,aspects,i18n},modules,commands,mcp,__tests__/{unit,integration}}

# Create initial index file
cat > src/index.ts << 'EOF'
/**
 * HALCON - Cosmic Productivity Platform
 * Main entry point
 */

console.log('🌟 HALCON is initializing...');

export {};
EOF
```

### Step 5: Write First Test (TDD Red) (5 min)

```bash
# Create sanity check test
cat > src/__tests__/unit/sanity.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';

describe('HALCON Sanity Check', () => {
  it('should confirm test framework is working', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('HALCON');
    expect(result).toBe('HALCON');
  });

  it('should support TypeScript types', () => {
    const greeting: string = 'Hello, Cosmic Traveler!';
    expect(greeting).toContain('Cosmic');
  });
});
EOF
```

### Step 6: Run First Test (TDD Green) (2 min)

```bash
# Run tests
npm test

# Expected output:
# ✓ src/__tests__/unit/sanity.test.ts (3)
#   ✓ HALCON Sanity Check (3)
#     ✓ should confirm test framework is working
#     ✓ should handle async operations
#     ✓ should support TypeScript types
#
# Test Files  1 passed (1)
#      Tests  3 passed (3)
```

### Step 7: Commit Progress (2 min)

```bash
git add .
git commit -m "feat: initialize TypeScript project with Vitest

- Add TypeScript configuration with strict mode
- Setup Vitest testing framework
- Configure build and test scripts
- Create project structure (lib, modules, commands, mcp)
- Add sanity check tests (all passing)

Test coverage: 100% (sanity tests)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git log --oneline -5
```

---

## ✨ What You Just Accomplished

1. ✅ Clean git repository
2. ✅ TypeScript project initialized
3. ✅ Modern testing framework (Vitest) setup
4. ✅ Project structure created
5. ✅ First tests written and passing
6. ✅ TDD methodology proven (Red → Green)

---

## 🎯 Next Steps (Choose Your Path)

### Path A: Foundation Layer (Recommended)
**Goal:** Build Swiss Ephemeris wrapper (Week 1 of roadmap)

```bash
# Create test file
cat > src/__tests__/unit/swisseph-wrapper.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { calculateChart } from '@/lib/swisseph';

describe('Swiss Ephemeris Wrapper', () => {
  const testDate = new Date('1990-03-10T12:55:00Z');
  const testLocation = {
    lat: 15.83,
    lon: 78.04,
    name: 'Kurnool, India'
  };

  it('should calculate planetary positions', async () => {
    const chart = await calculateChart(testDate, testLocation);

    expect(chart.bodies.sun).toBeDefined();
    expect(chart.bodies.moon).toBeDefined();
    expect(chart.bodies.mercury).toBeDefined();
  });

  it('should include Chiron by default', async () => {
    const chart = await calculateChart(testDate, testLocation);
    expect(chart.bodies.chiron).toBeDefined();
  });

  it('should calculate houses with Ascendant', async () => {
    const chart = await calculateChart(testDate, testLocation, {
      houseSystem: 'placidus'
    });

    expect(chart.angles.ascendant).toBeDefined();
    expect(chart.houses.cusps).toHaveLength(12);
  });
});
EOF

# Run test (will fail - RED phase)
npm test

# Now implement in src/lib/swisseph/index.ts (GREEN phase)
```

### Path B: Explore Existing Code
```bash
# Examine existing commands
ls -la commands/

# Check claude-sdk-microservice
cd claude-sdk-microservice
npm test  # if tests exist
cd ..

# Review requirements
ls -la requirements/
```

### Path C: Setup Development Tools
```bash
# Install VS Code extensions (if using VS Code)
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension vitest.explorer

# Setup pre-commit hooks
npm install -D husky lint-staged
npx husky install
```

---

## 📊 Verify Your Setup

Run this checklist:

```bash
# ✅ TypeScript compilation works
npm run typecheck

# ✅ Tests run successfully
npm run test:verify

# ✅ Build succeeds
npm run build

# ✅ Dev mode works
npm run dev  # Should show: "🌟 HALCON is initializing..."
# Press Ctrl+C to stop

# ✅ Git is clean
git status
```

---

## 🐛 Troubleshooting

### Issue: Swiss Ephemeris fails to install
```bash
# On macOS, you may need to install build tools
xcode-select --install

# Try installing again
npm install swisseph
```

### Issue: Tests not found
```bash
# Ensure Vitest globals are enabled in vitest.config.ts
# Check that test files end with .test.ts or .spec.ts
```

### Issue: TypeScript errors
```bash
# Clear build cache
rm -rf dist/
npm run build
```

### Issue: Import paths not resolving
```bash
# Ensure tsconfig.json has paths configured:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 📚 Resources

### Internal Documentation
- `IMPROVEMENTS_ROADMAP.md` - Full 10-week plan
- `ARCHITECTURE_REVISED.md` - System architecture
- `CLAUDE.md` - TDD methodology
- `UPGRADE_PLAN.md` - Feature specifications

### Testing
- [Vitest Documentation](https://vitest.dev)
- Test-Driven Development: Red → Green → Refactor
- Aim for 80%+ code coverage

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Strict mode is enabled for better type safety

---

## 🎉 Success!

You now have a working HALCON development environment!

**Time invested:** 30 minutes
**Value created:** Foundation for world-class astrology platform

**Next milestone:** Implement Swiss Ephemeris wrapper (Week 1)

---

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server (watch mode)
npm run build        # Build for production
npm run typecheck    # Check TypeScript types

# Testing (TDD workflow)
npm test            # Run tests in watch mode
npm run test:ui     # Open Vitest UI
npm run test:verify # Run tests once (CI mode)
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint        # Check code quality
npm run format      # Format code with Prettier

# Git workflow
git status          # Check repository state
git add .           # Stage all changes
git commit -m ""    # Commit with message
git push            # Push to remote
```

---

**Ready to build the future of cosmic productivity! 🌟**
