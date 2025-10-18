# CLAUDE.md - AI Assistant Configuration for HALCON

## Project Overview
HALCON is a cosmic productivity platform combining orbital navigation UI with astrological insights and AI assistance. This project follows strict Test-Driven Development (TDD) methodology.

## Claude Code Skills Architecture

### Overview: Agent + Skills + Virtual Machine

Claude Code operates with a three-layer architecture that combines agent configuration, skills, and a virtual machine environment:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT CONFIGURATION                          │
│                                                                 │
│  ┌──────────────────────────────────────┐                     │
│  │     Core System Prompt               │                     │
│  └──────────────────────────────────────┘                     │
│                                                                 │
│  Equipped Skills:                                              │
│  ┌────────┐ ┌──────┐ ┌────────────┐ ┌──────┐ ┌──────┐       │
│  │bigquery│ │ docx │ │nda-review  │ │ pdf  │ │ pptx │  ...  │
│  └────────┘ └──────┘ └────────────┘ └──────┘ └──────┘       │
│                                                                 │
│  Equipped MCP Servers:                                         │
│  ○ MCP server 1                                                │
│  ○ MCP server 2                                                │
│  ○ MCP server 3                                                │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓ use computer
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT VIRTUAL MACHINE                        │
│                                                                 │
│  Runtime Environments:                                          │
│  ┌──────┐  ┌────────┐  ┌────────┐                            │
│  │ Bash │  │ Python │  │ Node.js│                            │
│  └──────┘  └────────┘  └────────┘                            │
│                                                                 │
│  File System - Skills Directory:                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ skills/                                                 │   │
│  │  ├── bigquery/                                          │   │
│  │  │    ├── SKILL.md                                      │   │
│  │  │    ├── datasources.md                                │   │
│  │  │    └── rules.md                                      │   │
│  │  ├── docx/                                              │   │
│  │  │    ├── SKILL.md                                      │   │
│  │  │    └── ooxml/                                        │   │
│  │  │         ├── spec.md                                  │   │
│  │  │         └── editing.md                               │   │
│  │  ├── pdf/                                               │   │
│  │  │    ├── SKILL.md                                      │   │
│  │  │    ├── forms.md                                      │   │
│  │  │    ├── reference.md                                  │   │
│  │  │    └── extract_fields.py                             │   │
│  │  └── ...                                                │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Skills: Model-Invoked Capabilities

**Key Concepts:**

1. **Automatic Invocation**: Skills are model-invoked—Claude autonomously decides when to use them based on your request and the skill's description. No manual activation required.

2. **Progressive Disclosure**: Skills use progressive disclosure as their core design principle, allowing Claude to load information only as needed without reading the entirety of a skill into context.

3. **File System Integration**: Skill directories live in the agent's file system and contain SKILL.md files plus supporting resources.

### SKILL.md File Format

Every skill requires a `SKILL.md` file with YAML frontmatter followed by markdown content:

```markdown
---
name: pdf
description: Comprehensive PDF toolkit for extracting text and tables,
  merging/splitting documents, and filling-out forms.
---

## Overview

This guide covers essential PDF processing operations using Python libraries
and command-line tools. For advanced features, JavaScript libraries, and
detailed examples, see ./reference.md. If you need to fill out a PDF form,
read ./forms.md and follow its instructions.

## Quick Start

```python
from pypdf import PdfReader, PdfWriter

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

...
```
```

### Skill Directory Structure

Each skill follows this pattern:

```
.claude/skills/skill-name/
├── SKILL.md              # Required: Main skill definition
├── README.md             # Optional: Overview and usage
├── EXAMPLES.md           # Optional: Code examples
├── reference.md          # Optional: Detailed reference
├── datasources.md        # Optional: Data source configs
├── rules.md              # Optional: Business rules
└── *.py, *.js, *.sh      # Optional: Helper scripts
```

### How Skills Work in HALCON Project

For the HALCON project, you have access to **67 specialized skills** covering:

**Backend Development**
- fastapi, postgresql, sqlalchemy, pydantic, pytest, alembic, pandas, psycopg
- expressjs, nodejs, golang, rust, spring-boot

**Frontend Development**
- react-development, react-patterns, nextjs-development, angular, svelte, vue
- tailwind-css, responsive-design, figma-design, ui-design-patterns
- javascript-fundamentals, jest-react-testing

**Database & Data**
- postgresql-database-engineering, database-management-patterns
- vector-database-management, redis-state-management

**Infrastructure & DevOps**
- docker-compose-orchestration, kubernetes-orchestration
- aws-cloud-architecture, terraform-infrastructure
- ci-cd-pipeline-patterns, observability-monitoring

**API & Integration**
- rest-api-design-patterns, graphql-api-development
- oauth2-authentication, claude-sdk-integration-patterns
- linear-dev-accelerator

### Using Skills in Development

Skills are automatically available when relevant to your requests:

**Example 1: Backend API Development**
```
"Create a FastAPI endpoint with PostgreSQL integration and Pydantic validation"
→ Claude uses: fastapi, postgresql, pydantic, sqlalchemy skills
```

**Example 2: Frontend Component**
```
"Build a responsive React component with Tailwind CSS"
→ Claude uses: react-development, tailwind-css, responsive-design skills
```

**Example 3: Full Stack Feature**
```
"Implement user authentication with JWT"
→ Claude uses: fastapi, oauth2-authentication, react-development, rest-api-design-patterns
```

**Example 4: Testing**
```
"Write pytest tests for the API endpoints"
→ Claude uses: pytest, fastapi-development skills
```

### Skill Configuration Files

**Global Skills**: `~/.claude/skills/`
- Available to all projects
- 67 skills currently installed

**Project Skills**: `.claude/skills/` (project-specific)
- Can override or extend global skills
- Checked into version control

**Settings Configuration**: `.claude/settings.json`
```json
{
  "skills": {
    "enabled": true,
    "location": ".claude/skills",
    "total_skills": 67,
    "description": "Model-invoked capabilities used automatically by Claude"
  }
}
```

### MCP Server Integration

Skills work alongside MCP (Model Context Protocol) servers:

**Equipped MCP Servers in HALCON:**
- **Context7**: Library documentation lookup
- **Linear**: Project management and issue tracking
- **Playwright**: Browser automation and visual testing

**Integration Pattern:**
```
Skills (static knowledge) + MCP Servers (dynamic data) = Complete Context
```

Example:
```
"Create a Linear issue for the authentication feature and generate FastAPI code"
→ MCP Linear Server: Creates the issue
→ Skill fastapi: Provides code patterns and best practices
```

### Requirements for Skills

1. **Code Execution Tool**: Must be enabled in Claude Code Settings → Capabilities
2. **File System Access**: Skills directory must exist and be readable
3. **Restart Required**: After adding/modifying skills, restart Claude Code

### Best Practices

1. **Let Claude Choose**: Skills are automatically selected—trust the model's judgment
2. **Be Specific When Needed**: For specialized domains, explicitly reference skill names
3. **Combine Skills**: Complex tasks often use multiple skills together
4. **Progressive Learning**: Start simple; let skills provide deeper context as needed

### Troubleshooting

**Skills Not Loading:**
1. Verify directory structure: `.claude/skills/skill-name/SKILL.md`
2. Check YAML frontmatter is valid
3. Ensure Code Execution Tool is enabled
4. Restart Claude Code

**Skills Not Being Used:**
1. Make requests more specific to trigger relevant skills
2. Explicitly reference skill name in your request
3. Check skill description matches your use case

For complete skills documentation, see: `.claude/docs/SKILLS-USAGE-GUIDE.md`

## Development Workflow Requirements

### 1. ALWAYS Follow TDD Cycle
```
RED → GREEN → REFACTOR
```
- **RED**: Write failing tests first
- **GREEN**: Write minimal code to pass tests
- **REFACTOR**: Improve code while keeping tests green

### 2. Before Writing ANY Code
1. Check if tests exist for the feature
2. If no tests exist, write them first
3. Run tests to ensure they fail
4. Only then implement the feature

### 3. Test Verification Commands
```bash
# Run tests for specific component
npm test -- [component-name].test.ts --watch

# Verify all tests pass
npm run test:verify

# Check coverage (must be >80%)
npm run test:coverage
```

### 4. Component Development Order
1. **Claude SDK Wrapper** (FIRST PRIORITY)
   - Location: `src/lib/claude-sdk-wrapper/`
   - Tests: `src/__tests__/unit/claude-sdk-wrapper.test.ts`
   - Follow architecture in: `requirements/claude-sdk-wrapper-architecture.md`

2. **Core HALCON Components**
   - Orbital Navigation System
   - Astrological Data Integration
   - Graph Visualization
   - UI Components

### 5. File Structure Convention
```
src/
├── lib/
│   └── claude-sdk-wrapper/
│       ├── index.ts
│       ├── types.ts
│       ├── error-handler.ts
│       └── mcp-integration.ts
├── components/
│   ├── orbital-navigation/
│   ├── astrological-dashboard/
│   └── agent-interface/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── test-setup.ts
```

### 6. Testing Requirements
- Unit test coverage: minimum 80%
- All public methods must have tests
- Test error scenarios and edge cases
- Use mocks for external dependencies
- Follow AAA pattern: Arrange, Act, Assert

### 7. Code Quality Standards
- TypeScript strict mode enabled
- ESLint and Prettier configured
- No any types without justification
- Comprehensive JSDoc comments
- Follow functional programming principles where appropriate

### 8. Commit Message Format
```
type(scope): description

- Write test for [feature]
- Implement [feature] to pass test
- Refactor [component] for clarity
```

Types: feat, fix, test, refactor, docs, style, perf

### 9. Development Commands
```bash
# Initial setup
npm install
npm run setup

# Development
npm run dev          # Start dev server
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code quality
npm run typecheck    # TypeScript validation

# Before committing
npm run test:verify  # Run all tests
npm run lint:fix     # Fix linting issues
npm run build        # Ensure build works
```

### 10. Integration Points
- **MCP Servers**: Configure in `mcp-config.json`
- **API Keys**: Use environment variables only
- **Astrological APIs**: Mock in tests, real in production

### 11. AI Assistant Permissions
- **Web Search**: Auto-allowed for research and documentation lookup
- **GitHub Actions**: Auto-allowed for repository operations, issue tracking, and code research
- **Linear Integration**: Auto-allowed for project management and task tracking via MCP server

## Current Development Focus

### Phase 1: Claude SDK Wrapper (Current)
1. ✅ Architecture document created
2. ✅ TDD workflow established
3. ⏳ Write comprehensive test suite
4. ⏳ Implement wrapper following tests
5. ⏳ Integration tests with mock MCP
6. ⏳ Documentation and examples

### Phase 2: Core HALCON Setup
1. Project initialization with Vite + React + TypeScript
2. Testing framework setup (Jest + React Testing Library)
3. Component architecture following atomic design
4. State management with Zustand
5. Styling with Tailwind CSS

### Phase 3: Orbital Navigation
1. Physics engine tests
2. Animation performance tests
3. Interaction handling tests
4. Component implementation
5. Integration with Claude SDK

## Important Notes

1. **Never skip tests** - They are the specification
2. **Test behavior, not implementation** - Tests should survive refactoring
3. **Keep tests simple** - Complex tests indicate design issues
4. **Mock external services** - Tests must run offline
5. **Use semantic HTML** - Accessibility is not optional

## Questions to Ask Before Implementation

1. Have I written tests for this feature?
2. Do the tests clearly define the requirements?
3. Am I writing the minimal code to pass tests?
4. Is the test coverage adequate (>80%)?
5. Will these tests catch regressions?

## Resources

- TDD Workflow: `requirements/test-driven-development-workflow.md`
- Claude SDK Architecture: `requirements/claude-sdk-wrapper-architecture.md`
- System Context: `requirements/system-context.md`
- Dev Context: `requirements/dev-context.md`

Remember: The goal is to build a reliable, maintainable system where every line of code is justified by a test. Quality over speed, always.