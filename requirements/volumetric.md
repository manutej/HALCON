## 🌌 **Core System Components**

### 1. Volumetric 3D Interface System
**Purpose**: AI-driven 3D spatial workspace that adapts and reorganizes based on user behavior and cosmic context

**Technical Implementation**:
- **Three.js Integration**: 3D scene management with WebGL rendering
- **5 Primary Planetary Domains** with volumetric expansion capabilities:
  - **Mercury** (Communication): Email threads → Slack channels → Meeting recordings → Contact networks
  - **Venus** (Creativity): Design systems → Inspiration boards → Color palettes → Creative tools → Asset libraries
  - **Mars** (Execution): Projvect boards → Sprint planning → Code repositories → Deployment pipelines → Task dependencies
  - **Jupiter** (Knowledge): Research papers → Documentation → Learning paths → Knowledge graphs → Expert networks
  - **Saturn** (Structure): Analytics dashboards → System monitoring → Process documentation → Compliance tracking → Performance metrics

**Volumetric Expansion Logic**:
```javascript
const expandPlanet = async (planet, userContext) => {
  // AI-driven hierarchical analysis
  const relevantSubDomains = await analyzeRelevantSubDomains(planet, userContext);
  const predictiveTools = await predictRelevantTools(planet, userContext, cosmicTiming);
  const customIntegrations = await loadCustomIntegrations(planet, userPreferences);
  
  // 3D volumetric positioning
  const volumetricLayout = calculateVolumetricPositions(
    relevantSubDomains, 
    predictiveTools, 
    customIntegrations,
    currentCosmicContext
  );
  
  // Animate 3D expansion with intelligent clustering
  return animateVolumetricExpansion(volumetricLayout);
};
```

### 2. Hierarchical Auto-Expansion Engine
**Purpose**: Intelligently surfaces relevant sub-categories, tools, and integrations based on context and user patterns

**Auto-Expansion Triggers**:
- **Context Analysis**: Current project, time of day, cosmic timing, recent activity patterns
- **Predictive Logic**: Machine learning from user behavior patterns
- **Cosmic Timing**: Astrological context influences what tools/workflows are surfaced
- **Custom Rules**: User-defined automation and integration triggers

**Hierarchical Structure Example**:
```javascript
// Mercury (Communication) drill-down example
const mercuryHierarchy = {
  level1: ['Email', 'Messaging', 'Meetings', 'Networks'],
  level2: {
    Email: ['Inbox', 'Drafts', 'Scheduled', 'Templates', 'Filters'],
    Messaging: ['Slack', 'Teams', 'Discord', 'WhatsApp', 'Signal'],
    Meetings: ['Upcoming', 'Recording', 'Notes', 'Follow-ups', 'Scheduling'],
    Networks: ['Contacts', 'LinkedIn', 'Twitter', 'Professional Groups']
  },
  level3: {
    'Slack': ['#general', '#development', '#design', '#random', 'DMs'],
    'Inbox': ['Unread', 'Flagged', 'Today', 'This Week', 'Waiting For Reply']
  },
  customIntegrations: {
    'Email + Calendar': 'Smart meeting prep based on email context',
    'Slack + Notion': 'Auto-create meeting notes from Slack discussions'
  }
};
```

### 3. Predictive Surface Logic Engine
**Purpose**: AI system that anticipates user needs and pre-loads relevant tools, bookmarks, and workflows

**Prediction Algorithms**:
- **Pattern Recognition**: Learn from user behavior sequences and timing
- **Context Correlation**: Combine current planet selection + cosmic timing + recent activity
- **Cosmic Intelligence**: Factor in astrological transits for optimal timing suggestions
- **Cross-Domain Connections**: Understand relationships between different planetary domains

**Predictive Surface Implementation**:
```javascript
const predictiveSurfaceLogic = async (currentContext) => {
  const userPatterns = await analyzeUserPatterns(currentContext.userId);
  const cosmicContext = await getCurrentCosmicContext();
  const activeProjects = await getActiveProjects(currentContext);
  
  // AI-driven prediction
  const predictions = await claudeAPI.predict({
    prompt: `Analyze user context and predict what tools/workflows to surface:
    
    Current Context:
    - Selected Domain: ${currentContext.selectedPlanet}
    - Time: ${currentContext.timestamp}
    - Recent Activity: ${userPatterns.recentActivity}
    - Active Projects: ${activeProjects}
    - Cosmic Context: ${cosmicContext}
    
    Predict and return JSON with:
    - primaryTools: [top 3 tools to surface immediately]
    - secondaryTools: [tools to pre-load in background]
    - suggestedWorkflows: [workflow recommendations]
    - cosmicTiming: [timing-based suggestions]
    - customActions: [user-specific automation opportunities]
    `,
    maxTokens: 500
  });
  
  return predictions;
};
```

### 4. Custom Integration Framework
**Purpose**: Extensible system allowing users to add custom buttons, integrations, and connections that the AI learns to incorporate

**Integration Types**:
- **Tool Connections**: OAuth integrations with external services
- **Custom Automations**: User-defined workflow triggers and actions
- **Bookmark Clusters**: Intelligent grouping of frequently accessed resources
- **Cross-Platform Bridges**: Connect tools that don't natively integrate
- **Cosmic Automations**: Time-based actions triggered by astrological events

**Custom Integration Architecture**:
```javascript
interface CustomIntegration {
  id: string;
  name: string;
  type: 'tool' | 'automation' | 'bookmark' | 'bridge' | 'cosmic-trigger';
  planetDomain: string;
  hierarchyLevel: number;
  triggers: {
    contextual: string[];     // When to surface this integration
    cosmic: string[];         // Astrological triggers
    behavioral: string[];     // User pattern triggers
  };
  actions: {
    primary: string;          // Main action (URL, API call, etc.)
    secondary?: string[];     // Related actions to surface
  };
  customization: {
    icon: string;
    color: string;
    position: 'auto' | 'fixed';
    priority: number;
  };
  aiLearning: {
    usagePatterns: UserPattern[];
    effectivenessScore: number;
    lastOptimized: Date;
  };
}
```

### 5. AI-Driven Context Engine (Enhanced)
**Purpose**: Combines astrological data, user behavior, and cosmic timing to create intelligent contextual awareness

**Enhanced Context Capabilities**:
- **Multi-Layered Context**: Personal + professional + cosmic + temporal context
- **Behavioral Learning**: AI learns user patterns and preferences over time
- **Cosmic Correlation**: Understands how# 🪐 Planetary Mission Control Hub - System Context

## 📍 **System Overview**

### Vision Statement
The Planetary Mission Control Hub is a **volumetric intelligence system** that uses **3D spatial computing and AI-driven hierarchical expansion** to create an adaptive workspace. Rather than static navigation, the system employs **predictive volumetric logic** where interactive elements automatically reorganize, surface relevant content, and intelligently expand based on user context, intent, and cosmic timing.

### Core Value Proposition
- **Volumetric Intelligence**: 3D spatial interface that adapts and reorganizes based on user behavior and AI predictions
- **Hierarchical Auto-Expansion**: Drilling into planets automatically opens relevant sub-domains, tools, and contextual integrations
- **Predictive Surface Logic**: System anticipates user needs and pre-loads related tools, bookmarks, and workflows
- **Cosmic Timing Integration**: AI considers astrological context when deciding what to surface and when
- **Dynamic Customization**: Users can add custom integrations, buttons, and connections that the system learns to incorporate intelligently

---

## 🏗️ **System Architecture**

### Volumetric Intelligence Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│          React + Three.js + TypeScript                     │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐   │
│  │ Volumetric  │ │ Hierarchical│ │   Agent Interface    │   │
│  │    3D UI    │ │  Expansion  │ │   (Context Aware)    │   │
│  │  Component  │ │   Engine    │ │                      │   │
│  └─────────────┘ └─────────────┘ └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           │                │                    │
           ▼                ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Volumetric      │ │ Predictive      │ │   Claude API    │
│ Intelligence    │ │ Surface Logic   │ │ (AI Assistant)  │
│ Engine (AI)     │ │ (Context Aware) │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
           │                │                    │
           ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│             Intelligent State Management                    │
│  User Context + Cosmic Data + Hierarchical Tree +          │
│  Predictive Cache + Custom Integrations                    │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│               Dynamic Storage Layer                         │
│  User Patterns + Custom Configs + Integration Endpoints    │
└─────────────────────────────────────────────────────────────┘
```

### Volumetric Intelligence Data Flow
```
User Intent Detection → Volumetric Analysis → Hierarchical Expansion → Predictive Surfacing → Dynamic Reorganization
        ↓                      ↓                    ↓                     ↓                    ↓
   AI Pattern Analysis → Context Building → Auto Sub-Tab Opening → Related Tool Loading → Cosmic Timing Integration
        ↓                      ↓                    ↓                     ↓                    ↓
   Custom Integration → Hierarchical Tree → Volumetric Positioning → Smart Clustering → Adaptive Interface
```

### Volumetric Intelligence Engine
```
User Interaction → AI Intent Detection → Context Analysis → Hierarchical Mapping → Predictive Loading
     ↓                 ↓                    ↓                ↓                     ↓
Planet Selection → Drill-Down Logic → Sub-Domain Analysis → Related Tool Discovery → Auto-Expansion
     ↓                 ↓                    ↓                ↓                     ↓
Custom Actions → Integration Points → Volumetric Positioning → Smart Clustering → Cosmic Contextualization
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