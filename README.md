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

HALCON includes a powerful command-line interface for astrological calculations.

#### Option 1: Use npm scripts directly

```bash
npm run chart -- manu
npm run transits
npm run progressions -- manu
npm run analysis -- manu --data-only
```

#### Option 2: Set up the `halcon` command (recommended)

```bash
# Create a symlink to the halcon CLI (adjust path as needed)
ln -s "$(pwd)/commands/halcon" ~/bin/halcon

# Or add to your PATH in ~/.bashrc or ~/.zshrc:
export PATH="$PATH:/path/to/HALCON/commands"
```

#### Available Commands

```bash
halcon chart <profile>          # Generate natal birth chart
halcon houses <profile>         # Calculate house cusps
halcon transits                 # Show current planetary positions
halcon progressions <profile>   # Calculate secondary progressions
halcon aspects <profile>        # Show planetary aspects
halcon analysis <profile>       # AI-powered astrological snapshot
```

#### Create a Profile

Profiles are stored in `~/.halcon/profiles.json`:

```bash
# Create the directory
mkdir -p ~/.halcon

# Create a profile (example)
cat > ~/.halcon/profiles.json << 'EOF'
{
  "manu": {
    "name": "manu",
    "date": "1990-03-10",
    "time": "12:55:00",
    "latitude": 15.8309,
    "longitude": 78.0425,
    "location": "Kurnool, India",
    "timezone": "Asia/Kolkata",
    "utcOffset": "+05:30"
  }
}
EOF
```

#### AI Analysis Setup (Optional)

For AI-powered analysis with Claude:

```bash
# Option 1: Create .env file in project root
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Option 2: Create key file in home directory
echo "your-key-here" > ~/.anthropic_api_key

# Then run
halcon analysis manu              # Full AI analysis
halcon analysis manu --type career # Career-focused
halcon analysis manu --data-only   # Data only (no API needed)
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
