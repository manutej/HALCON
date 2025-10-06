# 🪐 Planetary Mission Control Hub - System Context

## 📍 **System Overview**

### Vision Statement
The Planetary Mission Control Hub is a revolutionary productivity dashboard that uses **planetary orbital mechanics as a spatial metaphor** for organizing and accessing work tools. By combining **real-time astrological data** with **AI-powered contextual guidance**, it creates an intuitive, cosmic-aware workspace that helps users align their productivity with natural rhythms and cosmic timing.

### Core Value Proposition
- **Spatial Navigation**: Replace traditional nested menus with intuitive orbital navigation
- **Cosmic Timing**: Leverage astrological insights for productivity optimization
- **AI Guidance**: Get contextual advice that combines practical workflow tips with cosmic awareness
- **Unified Access**: Single interface for all productivity tools organized by work domain

---

## 🏗️ **System Architecture**

### High-Level Component Structure
```
┌─────────────────────────────────────────────┐
│                Frontend Layer               │
│  React + TypeScript + Tailwind CSS         │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Orbital UI  │  │   Agent Interface   │   │
│  │ Component   │  │                     │   │
│  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────┘
           │                    │
           ▼                    ▼
┌─────────────────┐    ┌─────────────────┐
│ Astrology APIs  │    │   Claude API    │
│ (Swiss Ephemeris│    │ (AI Assistant)  │
│  /AstroAPI)     │    │                 │
└─────────────────┘    └─────────────────┘
           │                    │
           ▼                    ▼
┌─────────────────────────────────────────────┐
│             State Management                │
│  Cosmic Data + User Config + Agent Context │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│          Storage Layer                      │
│  LocalStorage → Supabase (future)          │
└─────────────────────────────────────────────┘
```

### Data Flow Architecture
```
User Interaction → Planet Selection → Context Building → Agent Query → Cosmic Response
     ↓                ↓                 ↓               ↓             ↓
Orbital UI     → Tool Expansion → Astrology Data → Claude API → Guided Action
```

---

## 🌌 **Core System Components**

### 1. Orbital Navigation System
**Purpose**: Primary interface using planetary metaphors for work domain organization

**Technical Implementation**:
- **5 Primary Planets** representing core work domains:
  - **Mercury** (120px orbit, 4x speed): Communication (Slack, Email, Calendar, Zoom)
  - **Venus** (160px orbit, 3x speed): Creativity (Figma, Adobe, Inspiration, Dribbble)
  - **Mars** (200px orbit, 2x speed): Execution (Jira, GitHub, Linear, Notion)
  - **Jupiter** (280px orbit, 1x speed): Knowledge (Research, Docs, Learning, Wiki)
  - **Saturn** (320px orbit, 0.5x speed): Structure (Analytics, Monitoring, Admin, Settings)

**Animation System**:
- CSS transforms with `translate()` for orbital positioning
- JavaScript timer updating planet positions: `angle = (time * planet.speed) % (2π)`
- Smooth hover effects with `scale(1.1)` and glow shadows
- Click interactions trigger expansion panels with spring animations

### 2. Astrological Context Engine
**Purpose**: Provides cosmic timing data for productivity optimization

**Data Sources**:
- **Primary API**: Swiss Ephemeris or AstroAPI for planetary positions
- **Fallback**: Cached astronomical data with 24-hour refresh cycle
- **Real-time Elements**:
  - Current planetary signs and degrees
  - Retrograde status indicators
  - Daily transit descriptions
  - Moon phase calculations

**Integration Pattern**:
```javascript
const cosmicContext = {
  currentSign: 'leo',        // Sun's current zodiac sign
  retrograde: ['mercury'],   // Currently retrograde planets
  dailyTransit: 'Mars entering Virgo - Focus on systematic execution',
  moonPhase: 'Waxing Gibbous',
  cosmicWeather: 'High creative energy with structured focus'
};
```

### 3. AI Agent Intelligence Layer
**Purpose**: Provides contextual productivity guidance combining practical advice with cosmic awareness

**Agent Capabilities**:
- **Context Synthesis**: Combines user query + selected planet domain + current astrology
- **Actionable Advice**: Specific tool recommendations and workflow suggestions
- **Cosmic Integration**: Natural incorporation of astrological timing into productivity advice
- **Conversation Memory**: Maintains context within session for follow-up questions

**Prompt Engineering Framework**:
```javascript
const agentPrompt = `
You are a cosmic productivity agent for a Planetary Mission Control Hub.
User query: "${userMessage}"

Current cosmic context:
- Active sign: ${cosmicData.currentSign} ${getZodiacSymbol(cosmicData.currentSign)}
- Retrograde planets: ${cosmicData.retrograde.join(', ')}
- Transit: ${cosmicData.dailyTransit}
- Selected domain: ${selectedPlanet?.domain || 'None'}
- Available tools: ${selectedPlanet?.tools?.map(t => t.name).join(', ') || 'None'}

Provide actionable productivity advice incorporating cosmic insights.
Response format: Under 150 words, specific tool/action recommendations, natural cosmic metaphors.
`;
```

### 4. Tool Integration Framework
**Purpose**: Extensible system for connecting productivity tools to planetary domains

**Current Implementation** (MVP):
- Static tool configurations per planet
- Direct URL linking to external tools
- Visual categorization by tool type

**Future Architecture** (Post-MVP):
- OAuth integration for direct tool access
- Real-time data pulling from connected services
- Dynamic tool suggestions based on cosmic timing

---

## 💾 **State Management Architecture**

### Global State Structure
```javascript
interface CosmicState {
  // Core UI state
  selectedPlanet: Planet | null;
  showAgent: boolean;
  showSettings: boolean;
  
  // Cosmic data
  astrologyData: {
    currentSign: string;
    retrograde: string[];
    dailyTransit: string;
    moonPhase: string;
    lastUpdated: Date;
  };
  
  // Agent state
  agentConversation: {
    messages: Array<{role: 'user' | 'assistant', content: string}>;
    isThinking: boolean;
    lastResponse: string;
  };
  
  // User configuration
  userConfig: {
    planetConfigurations: Record<string, PlanetConfig>;
    preferredTools: string[];
    astrologyPreferences: {
      showRetrograde: boolean;
      dailyTransits: boolean;
      cosmicWeather: boolean;
    };
  };
}
```

### State Management Pattern
- **Primary**: React Context + useReducer for global state
- **Local**: useState for component-specific state (animations, UI interactions)
- **Persistence**: localStorage for user preferences, with future migration to Supabase
- **Cache**: Session storage for astrology data with TTL

---

## 🛠️ **Technology Stack Details**

### Frontend Technologies
```javascript
// Core framework
React 18+ with TypeScript for type safety
Tailwind CSS for utility-first styling
Framer Motion for advanced animations (alternative: GSAP)

// Key libraries
lucide-react: Icon system (with custom astrology symbols)
date-fns: Time calculations for astrology
clsx: Conditional className utilities

// Development tools
Vite: Build tool and dev server
ESLint + Prettier: Code quality
TypeScript: Type checking
```

### API Integration Layer
```javascript
// Astrology data
Primary: AstroAPI (https://api.astroapi.com)
Fallback: Swiss Ephemeris calculations
Rate limiting: 100 requests/day (cached 24h)

// AI assistant
Claude API: Anthropic Claude Sonnet 4
Error handling: Graceful degradation to cached responses
Cost optimization: Prompt compression and caching

// Future integrations
OAuth providers: Google, Microsoft, Slack
Tool APIs: Notion, Figma, Jira, Linear
```

### Deployment & Infrastructure
```javascript
// Development
Local: Vite dev server with hot reload
Environment variables for API keys
Proxy setup for CORS handling

// Production
Hosting: Vercel (preferred) or Netlify
Domain: Custom domain with SSL
Environment management: Preview/production branches
Performance monitoring: Web Vitals tracking
```

---

## 🎯 **System Constraints & Considerations**

### Performance Requirements
- **Animation**: Maintain 60fps for orbital animations
- **API Response**: Astrology data cached for 24h, Claude responses <3s
- **Bundle Size**: <500KB initial load, lazy loading for advanced features
- **Mobile**: Responsive design with touch-optimized interactions

### Browser Compatibility
- **Target**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Progressive Enhancement**: Core functionality without JavaScript
- **Responsive Breakpoints**: Mobile-first design with 768px/1024px breakpoints

### Security & Privacy
- **API Keys**: Server-side proxy for external API calls
- **User Data**: Local storage only (no personal data collection in MVP)
- **CORS**: Proper configuration for cross-origin requests
- **Content Security Policy**: Strict CSP headers in production

### Accessibility Standards
- **WCAG 2.1 AA**: Full compliance with accessibility guidelines
- **Keyboard Navigation**: Complete keyboard accessibility for orbital interface
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Motion Preferences**: Respect `prefers-reduced-motion` for animations

---

## 🔄 **Development Context**

### Current Development Phase
**MVP Development**: Building core orbital interface with Claude agent integration

### Key Development Patterns
```javascript
// Component structure
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // State management
  const { globalState, actions } = useCosmicContext();
  const [localState, setLocalState] = useState(initialValue);
  
  // Effects and calculations
  const derivedValue = useMemo(() => computeValue(prop1), [prop1]);
  
  // Event handlers
  const handleEvent = useCallback((event) => {
    // Handle with cosmic context
  }, [dependencies]);
  
  // Render with cosmic styling
  return (
    <div className="cosmic-component-classes">
      {/* Component JSX */}
    </div>
  );
};
```

### Error Handling Philosophy
- **Graceful Degradation**: System remains functional if astrology API fails
- **User Feedback**: Clear loading states and error messages
- **Fallback Content**: Cached cosmic data and default agent responses
- **Recovery Paths**: Retry mechanisms for failed API calls

### Testing Strategy
- **Unit Tests**: Core business logic and utility functions
- **Integration Tests**: API integrations and state management
- **E2E Tests**: Critical user journeys (planet selection, agent interaction)
- **Performance Tests**: Animation frame rates and bundle size monitoring

---

## 📝 **Usage Notes for AI Development Assistance**

### When to Reference This Document
- Starting any new development conversation about the system
- Implementing new components or features
- Debugging integration issues
- Planning architecture changes or extensions

### Key Context for Claude
- **System metaphor**: Always maintain the cosmic/planetary theme in code and UX
- **Integration approach**: Prefer composition over inheritance for component design
- **State management**: Use the defined global state structure consistently
- **Performance first**: Consider animation performance in all UI implementations
- **Accessibility**: Include ARIA labels and keyboard navigation in all components

### Development Workflow Integration
1. **Feature Planning**: Reference this document for architecture consistency
2. **Implementation**: Use component patterns and state structure defined here
3. **Testing**: Follow testing strategy and error handling patterns
4. **Deployment**: Use defined infrastructure and performance requirements

This system context provides the foundation for all development decisions and AI-assisted coding sessions.