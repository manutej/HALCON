# HALCON - Cosmic Productivity Platform

> Navigate your productivity through the cosmos with orbital navigation and astrological insights

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tests](https://img.shields.io/badge/tests-54%20passing-brightgreen.svg)

---

## 🌟 Overview

HALCON is a next-generation productivity platform that combines orbital navigation UI with real-time astrological data to help you optimize your workflow. Built with React, TypeScript, and Swiss Ephemeris for accurate astronomical calculations.

### Key Features

✨ **Orbital Navigation** - Interactive planetary interface with 5 productivity domains
🌙 **Cosmic Weather** - Real-time astrological conditions and insights
📊 **Swiss Ephemeris Integration** - Precise planetary calculations
🎨 **Beautiful UI** - Tailwind CSS with cosmic theming
🧪 **Test-Driven** - 80%+ test coverage with Vitest
⚡ **Modern Stack** - React 18, TypeScript 5, Vite 5, Zustand

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/manutej/HALCON.git
cd HALCON

# Install dependencies
npm install

# Run tests
npm run test:verify

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

---

## 📦 Project Structure

```
HALCON/
├── src/
│   ├── components/          # React components (atomic design)
│   │   ├── atoms/           # Planet, Star
│   │   ├── molecules/       # CosmicWeather, PlanetInfo
│   │   └── organisms/       # OrbitalDashboard
│   ├── stores/              # Zustand state management
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Core libraries
│   │   ├── swisseph/        # Swiss Ephemeris wrapper
│   │   └── profiles/        # User profile management
│   ├── types/               # TypeScript definitions
│   ├── commands/            # CLI commands (chart, houses)
│   └── __tests__/           # Test suites
├── docs/                    # Documentation
├── requirements/            # Architecture specs
└── examples/                # Usage examples
```

---

## 🎯 Usage

### Web Interface

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### CLI Tools

```bash
# Calculate birth chart
npm run chart

# Calculate house positions
npm run houses
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit
```

**Current Test Results**: ✅ 54/54 tests passing

---

## 🏗️ Architecture

### Component Hierarchy (Atomic Design)

- **Atoms**: Basic building blocks (Planet, Star)
- **Molecules**: Simple combinations (CosmicWeather, PlanetInfo)
- **Organisms**: Complex components (OrbitalDashboard)

### State Management

Uses Zustand for global state:

```typescript
const { selectedPlanet, setSelectedPlanet } = useAppStore();
```

### Planetary Domains

Each planet represents a productivity domain:

- 🟡 **Mercury** - Communication (Slack, Email)
- 🔴 **Venus** - Creativity (Figma, Canva)
- 🟠 **Mars** - Execution (Linear, GitHub)
- 🟣 **Jupiter** - Knowledge (Notion, Obsidian)
- 🔵 **Saturn** - Structure (Analytics, Monitoring)

---

## 🔧 Development

### Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build && tsc",     // Build for production
  "test": "vitest",                 // Run tests
  "lint": "eslint src --ext .ts,.tsx",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write \"src/**/*.{ts,tsx,json,md,css}\""
}
```

### Code Quality

- TypeScript strict mode enabled
- ESLint + Prettier configured
- Vitest for testing
- 80%+ test coverage requirement

---

## 🌍 Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool
- **Tailwind CSS 4.1** - Styling

### State & Data
- **Zustand 4.4** - State management
- **Swiss Ephemeris 0.5** - Astronomical calculations
- **Luxon 3.7** - Timezone handling

### Testing
- **Vitest 3.2** - Test runner
- **React Testing Library 14.1** - Component testing
- **Playwright 1.40** - E2E testing (planned)

---

## 📚 Documentation

- [Development Progress](./docs/progress.md) - Complete project history
- [Architecture](./ARCHITECTURE_REVISED.md) - System design
- [Test-Driven Development](./requirements/test-driven-development-workflow.md)
- [Claude AI Configuration](./CLAUDE.md) - AI-assisted development setup

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- Project initialization
- TypeScript setup
- Testing framework
- Swiss Ephemeris wrapper

### ✅ Phase 2: Core HALCON Setup (Complete)
- React + Vite integration
- Orbital navigation UI
- Zustand state management
- Component architecture
- Tailwind CSS styling

### 🔄 Phase 3: Enhanced Features (In Progress)
- Real astrological data integration
- User profiles and preferences
- Claude AI agent integration
- Advanced animations
- Mobile optimization

### 📋 Phase 4: Production Ready
- Performance optimization
- Accessibility improvements
- OAuth integrations
- Deployment pipeline
- Analytics and monitoring

---

## 🤝 Contributing

This is currently a personal project. Contributions, issues, and feature requests are welcome!

---

## 📄 License

MIT © HALCON Team

---

## 🙏 Acknowledgments

- Swiss Ephemeris by Astrodienst for astronomical calculations
- Claude AI by Anthropic for development assistance
- The astrological and productivity communities

---

**Built with ❤️ and ✨ cosmic energy**

*Navigate your productivity through the stars* 🌟
