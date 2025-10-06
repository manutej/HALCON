StarboardMissionControlHub/
├── docs/                           # Documentation for the project
│   ├── Systemic_Vision.md          # Overview and goals of the hub
│   ├── Technical_Architecture.md   # High-level technical structure
│   ├── Component_Ephemeris_Data_Fetcher.md
│   ├── Component_Astrological_Insights_Dashboard.md
│   ├── Component_Productivity_Integration.md
│   ├── Component_Model_Context_Protocol_Integration.md
│   ├── Component_User_Interface.md
│   └── API_Specification.md        # Detailed API endpoints (optional, to be developed)
├── src/                           # Source code for the application
│   ├── frontend/                  # Frontend code (React/Vue.js)
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ZodiacWheel.js     # Renders zodiac wheel visualization
│   │   │   ├── BiWheelChart.js    # Renders natal + transit bi-wheel
│   │   │   ├── GraphicalEphemeris.js # Displays planetary movements
│   │   │   ├── TaskList.js        # Task management UI
│   │   │   └── NotificationBar.js # Displays alerts and recommendations
│   │   ├── pages/                 # Page-level components
│   │   │   ├── Dashboard.js       # Main dashboard with insights and tasks
│   │   │   ├── Calendar.js        # Calendar with astrological events
│   │   │   └── Settings.js        # User preferences (zodiac, notifications)
│   │   ├── assets/                # Static assets (images, fonts)
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useEphemerisData.js # Fetches ephemeris data via API
│   │   └── App.js                 # Main app entry point
│   ├── backend/                   # Backend code (Node.js, serverless)
│   │   ├── functions/             # Serverless functions (Netlify/AWS Lambda)
│   │   │   ├── ephemeris.js       # Handles ephemeris API calls
│   │   │   ├── mcp_client.js      # MCP client for external data/tools
│   │   │   ├── productivity.js    # Syncs with productivity tools
│   │   │   └── insights.js        # Generates astrological insights
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── swissEphemeris.js  # Wrapper for Swiss Ephemeris API
│   │   │   └── mcp_sdk.js        # MCP SDK integration
│   │   └── models/                # Data models
│   │       ├── User.js            # User data (birth details, preferences)
│   │       ├── Task.js            # Task and project data
│   │       └── EphemerisCache.js  # Cached planetary positions
│   ├── database/                  # Database configuration
│   │   ├── schemas/               # Database schemas (MongoDB/PostgreSQL)
│   │   │   ├── userSchema.js      # Schema for user data
│   │   │   ├── taskSchema.js      # Schema for tasks
│   │   │   └── ephemerisSchema.js # Schema for cached ephemeris data
│   │   └── migrations/            # Database migration scripts
│   └── tests/                     # Unit and integration tests
│       ├── frontend/              # Frontend tests
│       ├── backend/               # Backend tests
│       └── e2e/                   # End-to-end tests
├── scripts/                       # Build and deployment scripts
│   ├── build.js                   # Compiles frontend and backend
│   ├── deploy.js                  # Deploys to Netlify/AWS
│   └── seedDatabase.js            # Seeds initial ephemeris data
├── config/                        # Configuration files
│   ├── env.js                     # Environment variables (API keys, etc.)
│   └── mcp_config.js              # MCP server configurations
├── public/                        # Public assets for frontend
│   ├── index.html                 # Main HTML file
│   └── favicon.ico                # App favicon
└── README.md                      # Project overview and setup instructions