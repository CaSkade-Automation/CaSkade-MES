# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (NestJS)
```bash
cd backend
npm install              # Install dependencies
npm run start:dev        # Start development server with watch mode (port 9090)
npm run build           # Build for production
npm run lint            # Run ESLint on routes directory
```

### Frontend (Angular)
```bash
cd frontend
npm install              # Install dependencies
npm run start:dev        # Start dev server with proxy (port 4200)
npm run build           # Production build
npm run test            # Run Karma/Jasmine tests
npm run lint            # Run linting
ng test --include='**/specific.spec.ts'  # Run specific test file
```

### Shared Module
```bash
cd shared
npm install              # Install dependencies
npm run build           # Build TypeScript files
npm run lint            # Run ESLint
```

## High-Level Architecture

### System Overview
SkillMEx is a manufacturing execution system that manages production modules through semantic descriptions of their capabilities and skills. It uses ontologies stored in GraphDB to model manufacturing processes.

### Three-Layer Architecture

1. **Frontend (Angular 14)**
   - Single-page application for UI
   - Communicates with backend via REST API and WebSockets
   - Proxies `/api` requests to backend (port 9090) and `/engine-rest` to Camunda (port 8080)

2. **Backend (NestJS 9)**
   - REST API on port 9090 with `/api` prefix
   - WebSocket gateway for real-time updates
   - Integrates with GraphDB for ontology storage
   - Connects to OPC UA servers for industrial automation

3. **Shared Module**
   - TypeScript models and DTOs used by both frontend and backend
   - Ensures type safety across the full stack

### Key Architectural Patterns

**Domain Organization**: Code is organized by business domains:
- **Capabilities**: Abstract process descriptions (what modules can do)
- **Skills**: Executable implementations with state machines
- **Modules**: Physical manufacturing units
- **Process Planning**: BPMN-based workflow modeling

**Communication Flow**:
1. Frontend components use services to call backend APIs
2. Backend controllers handle HTTP requests and delegate to services
3. Services interact with GraphDB via GraphDbConnection service
4. Real-time updates flow through WebSocket gateways
5. Skills execute via OPC UA or REST interfaces

**WebSocket Architecture**: Each domain has its own gateway inheriting from base `Websocket` class:
- CapabilityGateway, ModuleGateway, SkillGateway, SkillStateGateway
- Broadcasts updates when entities change
- Uses native WebSocket (not Socket.io)

**File Upload System**: 
- Stores uploaded files in `/uploaded-files` directory
- Supports MTP and PLCopen XML formats
- Parsing services extract capabilities and skills from industrial formats

## External Dependencies

**Required Services**:
- **GraphDB**: Triple store for ontology data (expects repository "test-repo")
- **Camunda BPMN Engine** (optional): For process execution on port 8080
- **OPC UA Servers** (optional): For skill execution

**Key Technology Integrations**:
- OPC UA client for industrial protocol support
- RDF/SPARQL for semantic queries
- BPMN-js for process modeling
- D3.js for graph visualization

## Testing Approach

- **Frontend**: Karma/Jasmine with `*.spec.ts` files alongside components
- **Backend**: Jest framework configured but limited coverage
- Run frontend tests with `npm run test` in frontend directory
- Test files follow Angular/NestJS conventions

## Git Commit Convention

This project uses **Conventional Commits** with emojis and specific scopes. All commits should follow this format:

```
<type>(<scope>): :<emoji>: <description>

[optional body with bullet points]

Co-Authored-By: Claude
```

### Common Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring without changing functionality
- `build`: Build system or dependency changes
- `chore`: Maintenance, tooling, or minor updates
- `docs`: Documentation changes
- `style`: Code formatting or style changes
- `test`: Adding or updating tests

### Common Scopes
- `ontology`: GraphDB or semantic data changes
- `shared`: Changes to shared entities in the /shared folder
- `backend`: Backend/NestJS changes
- `config`: Configuration, Docker, or environment setup
- `frontend`: Frontend/Angular UI changes
- `front&back`: Changes to both frontend and backend
- `tiny`: A scope for tiny stuff

### Examples
```bash
feat(backend): :sparkles: add skill execution status tracking
fix(frontend): :bug: resolve WebSocket connection timeout
refactor(config): :wrench: update Docker configuration for development
chore(backend): :arrow_up: upgrade NestJS to latest version
```
