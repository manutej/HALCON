+-----------------------------------+
|           User Interface          |
|  (React/Vue.js, D3.js)            |
|  - Zodiac Wheel, Bi-Wheel Chart   |
|  - Task List, Calendar View       |
|  - Settings, Notifications        |
+-----------------------------------+
            ↑↓ (HTTP/REST)
+-----------------------------------+
|          Backend Services         |
|  (Node.js, Netlify Edge Functions)|
|  - Ephemeris Data Fetcher         |
|  - Productivity Integration       |
|  - Insights Generation            |
+-----------------------------------+
            ↑↓ (Internal API Calls)
+-----------------------------------+
|      MCP Integration (Client)     |
|  - Connects to MCP Servers        |
|  - Fetches Ephemeris, Tasks       |
|  - Prompt Templates for Insights  |
+-----------------------------------+
            ↑↓ (MCP Protocol)
+-----------------------------------+
|      External MCP Servers         |
|  - Swiss Ephemeris (Planetary)    |
|  - Astro-Seek.com (Planetary)     |
|  - Google Calendar (Tasks)        |
|  - Asana (Projects)               |
+-----------------------------------+
            ↑↓ (Database Queries)
+-----------------------------------+
|            Database               |
|  (MongoDB/PostgreSQL, Redis)      |
|  - User Data (Natal Chart, Prefs) |
|  - Task Data                     |
|  - Cached Ephemeris Data         |
+-----------------------------------+

Diagram Explanation:

User Interface: The frontend (React/Vue.js) renders visualizations and task views, sending user inputs (e.g., birth data, task creation) to the backend via HTTP/REST.
Backend Services: Serverless functions handle ephemeris calculations (Ephemeris Data Fetcher), task syncing (Productivity Integration), and insight generation (Astrological Insights Dashboard logic).
MCP Integration: Acts as a client to connect with external MCP servers (e.g., Swiss Ephemeris, Google Calendar), fetching real-time data and tools using the MCP protocol (stdio, HTTP/SSE).
External MCP Servers: Provide planetary positions (e.g., Sun in Leo ~2° on July 24, 2025) and productivity data (e.g., tasks from Google Calendar).
Database: Stores user profiles (encrypted natal charts, preferences), tasks, and cached ephemeris data for performance optimization, accessed by Backend Services.
Data Flow Example (July 24, 2025, 4:31 PM PDT, New York):

User inputs birth data via the UI, sent to Backend Services.
Backend Services use MCP Integration to query a Swiss Ephemeris MCP server for planetary positions (e.g., Moon in Cancer).
MCP Integration retrieves data and passes it to the Ephemeris Data Fetcher for processing.
Astrological Insights Dashboard generates a bi-wheel chart and insights (e.g., “Moon trine natal Jupiter: Nurture collaborations”).
Productivity Integration syncs tasks from Google Calendar via an MCP server, recommending scheduling for the New Moon (July 25, 2025).
Database caches ephemeris data and stores user tasks, accessed by Backend Services for future queries.
UI renders the zodiac wheel, task list, and notifications.


Additional Considerations
Stored Data:
User Data: Birth date, time, location (encrypted); preferences (e.g., tropical/sidereal zodiac).
Task Data: Project details, deadlines, categories (e.g., creative, analytical).
Ephemeris Cache: Daily/hourly planetary positions to reduce API calls (e.g., Redis cache for Sun in Leo ~2°).
APIs:
Internal APIs: REST endpoints (e.g., /api/ephemeris, /api/tasks) for frontend-backend communication.
External APIs: MCP-compliant servers for Swiss Ephemeris, Astro-Seek.com, Google Calendar, and Asana.
Frontend:
Built with React/Vue.js and D3.js for visualizations.
Responsive design for web and mobile, with ARIA labels for accessibility.
Backend:
Serverless architecture (Netlify Edge Functions) for scalability.
Node.js for ephemeris calculations and MCP client operations.
Scalability:
Use Redis for caching frequent ephemeris queries.
Compress ephemeris data (e.g., Swiss Ephemeris’s 97 MB dataset) for efficient storage.
Security:
Encrypt user data with AES-256.
Implement OAuth 2.0 for MCP server authentication.
Validate MCP server responses to prevent unauthorized access.