# 🪐 Planetary Mission Control Hub - Core Development Context

## 📋 **Context Engineering Documents for AI-Assisted Development**

*These documents provide Claude and other AI assistants with the essential context needed to effectively help with development tasks.*

---

## 1. **SYSTEM CONTEXT MAP** (`system-context.md`)

### Core System Purpose
```
A productivity dashboard using planetary orbits as navigation metaphor, enhanced with:
- Real-time astrological data for contextual productivity advice
- AI agent integration for cosmic-aware workflow optimization
- Interactive orbital UI for intuitive tool access
```

### Key Components
```
🌌 Frontend: React-based orbital interface with animated planets
🧠 Agent Layer: Claude API integration for contextual advice
🌐 Astrology API: Real-time planetary position and transit data
🔗 Tool Integrations: OAuth connections to productivity tools
💾 State Management: User preferences and orbital configurations
```

### Technical Stack Context
```
Primary: React, TypeScript, Tailwind CSS
Animation: Framer Motion or GSAP
APIs: Claude API, Astrology API (AstroAPI/Swiss Ephemeris)
State: Zustand or React Context
Storage: LocalStorage → Supabase (future)
Deployment: Vercel/Netlify
```

---

## 2. **FEATURE SPECIFICATION** (`features-spec.md`)

### Core Features (MVP)
```
✨ Animated Planetary Orbits
- 5 planets representing work domains (Mercury=Comm, Venus=Creative, etc.)
- Real orbital physics with different speeds
- Click to expand tool categories

🌙 Astrology Integration
- Current planetary positions and signs
- Retrograde indicators
- Daily transit information
- Cosmic weather context

🧠 AI Agent Assistant
- Claude API integration
- Cosmic-aware productivity advice
- Context from selected planet/domain
- Natural language workflow guidance

🔧 Tool Integration Framework
- Configurable links per planetary domain
- Quick access to productivity tools
- Future: OAuth integrations
```

### User Interaction Patterns
```
Primary Flow:
1. View orbital dashboard with animated planets
2. Check cosmic weather in top-right
3. Click planet → see domain tools
4. Use agent for contextual advice
5. Access tools directly from expanded planet

Agent Flow:
1. Click agent button (lightning icon)
2. Ask productivity/focus questions
3. Get cosmic-contextual advice
4. Agent considers current transits + selected domain
```

---

## 3. **DEVELOPMENT PHASES** (`dev-roadmap.md`)

### Phase 1: Core Orbital Interface (Week 1-2)
```
Goals:
- Animated planetary orbits with proper physics
- Planet selection and tool expansion
- Basic astrology data display (mock data first)
- Responsive design foundation

Tasks:
□ Set up React project with TypeScript
□ Implement orbital animation system
□ Create planet components with hover/click states
□ Build expansion panels for tool categories
□ Add cosmic styling and starfield background
□ Make responsive for mobile/desktop

Deliverable: Interactive orbital dashboard with mock data
```

### Phase 2: AI Agent Integration (Week 3)
```
Goals:
- Full Claude API integration
- Contextual prompt engineering
- Agent chat interface
- Cosmic-aware response generation

Tasks:
□ Implement Claude API calls with error handling
□ Design agent prompt templates
□ Build chat interface component
□ Add agent thinking states and animations
□ Test prompt engineering for cosmic context
□ Implement agent memory for conversation context

Deliverable: Working AI agent that gives cosmic productivity advice
```

### Phase 3: Real Astrology Data (Week 4)
```
Goals:
- Live astrological data integration
- Accurate planetary positions
- Retrograde detection
- Transit calculations

Tasks:
□ Research and select astrology API
□ Implement API integration with fallbacks
□ Add retrograde detection and display
□ Calculate daily transits
□ Cache astrology data for performance
□ Add cosmic weather logic

Deliverable: Live astrology data powering cosmic context
```

### Phase 4: Enhanced Interactions (Week 5-6)
```
Goals:
- Advanced animations and polish
- User customization
- Tool integration framework
- Performance optimization

Tasks:
□ Advanced orbital animations (WebGL consideration)
□ User settings for planetary configurations
□ OAuth integration framework
□ Performance monitoring and optimization
□ Accessibility improvements
□ Production deployment setup

Deliverable: Production-ready MVP
```

---

## 4. **API INTEGRATION GUIDE** (`api-integrations.md`)

### Claude Agent API Pattern
```javascript
// Standard prompt template for cosmic productivity advice
const generatePrompt = (userQuery, context) => `
You are a cosmic productivity agent. User asks: "${userQuery}"

Current cosmic context:
- Active sign: ${context.currentSign} ${context.signSymbol}
- Retrograde planets: ${context.retrograde.join(', ')}
- Transit: ${context.dailyTransit}
- Selected domain: ${context.selectedPlanet || 'None'}
- Available tools: ${context.tools?.join(', ') || 'None'}

Provide actionable productivity advice incorporating cosmic insights.
Keep under 150 words. Be specific about tools/actions.
`;

// Error handling pattern
try {
  const response = await fetch('/api/claude', {
    method: 'POST',
    body: JSON.stringify({ prompt, context })
  });
  // Handle response...
} catch (error) {
  // Fallback to cached wisdom or default advice
}
```

### Astrology API Integration
```javascript
// Daily astrology data fetch
const fetchCosmicData = async () => {
  try {
    // Primary API call
    const data = await fetch('/api/astrology/current');
    return {
      currentSign: data.sun.sign,
      retrograde: data.planets.filter(p => p.retrograde).map(p => p.name),
      dailyTransit: data.transits.today[0]?.description,
      moonPhase: data.moon.phase
    };
  } catch (error) {
    // Fallback to cached data or default cosmic weather
    return getCachedCosmicData();
  }
};
```

---

## 5. **COMPONENT ARCHITECTURE** (`components-spec.md`)

### Core Components
```
🪐 PlanetaryOrbit
Props: planets[], selectedPlanet, onPlanetSelect
Purpose: Main orbital interface with animated planets

🌙 CosmicWeather  
Props: astrologyData
Purpose: Display current cosmic conditions

🧠 AgentChat
Props: selectedPlanet, cosmicContext
Purpose: AI assistant interface

🔧 PlanetTools
Props: planet, tools[], onToolSelect
Purpose: Expanded tool panel for selected planet

⚙️ Settings
Props: userConfig, onConfigChange
Purpose: User customization interface
```

### State Management Structure
```javascript
const useCosmicState = () => {
  // Core application state
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [cosmicData, setCosmicData] = useState(null);
  const [agentChat, setAgentChat] = useState([]);
  const [userConfig, setUserConfig] = useState(defaultConfig);
  
  // Derived state
  const currentCosmicContext = useMemo(() => ({
    ...cosmicData,
    selectedPlanet: selectedPlanet?.name,
    availableTools: selectedPlanet?.tools
  }), [cosmicData, selectedPlanet]);
  
  return { /* state and actions */ };
};
```

---

## 6. **PROMPT ENGINEERING TEMPLATES** (`prompts.md`)

### Agent System Prompts
```
Base Identity:
"You are a cosmic productivity agent for a Planetary Mission Control Hub. 
You help users optimize their workflow by combining practical productivity 
advice with astrological insights and cosmic timing."

Context Integration Pattern:
"Current cosmic conditions: [ASTROLOGY_DATA]
User's current focus: [SELECTED_PLANET_DOMAIN]  
Available tools: [TOOLS_LIST]
User question: [USER_QUERY]

Provide specific, actionable advice that honors both cosmic timing and 
practical productivity principles."

Response Format:
"Keep responses under 150 words, be specific about tools/actions, 
use cosmic metaphors naturally without being overly mystical."
```

### Domain-Specific Prompts
```
Mercury (Communication): 
"Focus on messaging, meetings, and information flow optimization"

Venus (Creativity):
"Emphasize creative workflows, design tools, and inspiration management"

Mars (Execution):
"Prioritize task completion, project management, and goal achievement"

Jupiter (Knowledge):
"Center on learning, research, documentation, and knowledge synthesis"

Saturn (Structure):
"Address systems, processes, monitoring, and organizational efficiency"
```

---

## 📝 **HOW TO USE THESE DOCS WITH CLAUDE**

1. **Start conversations** by sharing the relevant context document
2. **Reference specific sections** when asking for implementation help
3. **Update documents** as features evolve during development
4. **Use as templates** for generating component code, API integrations, etc.

### Example Context Prompt:
```
"I'm building the Planetary Mission Control Hub from these specs:
[paste system-context.md and features-spec.md]

Help me implement the orbital animation system for the planets..."
```

This focused documentation set gives Claude all the essential context needed for effective development assistance while staying lean and actionable.