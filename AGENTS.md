# AGENTS.md - Coding Guidelines for AI Agents

## Project Overview
Full-stack JavaScript application with React frontend and Express/MongoDB backend. Uses Plaid API for banking integration.

## Build & Test Commands

### Frontend (/frontend)
```bash
cd frontend
npm start          # Start dev server (port 3000)
npm run build      # Production build
npm test           # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once
npm test -- --testNamePattern="test name"  # Run single test
npm test -- --testPathPattern="filename"   # Run tests in specific file
```

### Backend (/server)
```bash
cd server
npm start          # Start server (port 5001)
npx nodemon server.js  # Dev mode with auto-restart
```

### Full Stack
```bash
# Terminal 1
cd server && npm start
# Terminal 2
cd frontend && npm start
```

## Code Style Guidelines

### JavaScript/JSX (Frontend)
- **Components**: Functional components with hooks
- **File naming**: PascalCase for components (e.g., `Overview.jsx`), camelCase for utilities
- **Extensions**: Use `.jsx` for React components, `.js` for plain JS
- **Imports order**: React → third-party → local (CSS last)
- **Quotes**: Prefer single quotes, double quotes acceptable in JSX
- **Semicolons**: Use them consistently
- **Indentation**: 2-4 spaces (be consistent within files)
- **Component structure**: `function ComponentName() { ... }` (not arrow functions)

Example:
```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Component.css';
import { apiFunction } from '../../pages/api/api.js';
import SubComponent from '../sub/SubComponent.jsx';

function MyComponent() {
    const [state, setState] = useState(null);
    
    useEffect(() => {
        // effect logic
    }, []);
    
    return (
        <div className="my-component">
            <SubComponent />
        </div>
    );
}

export default MyComponent;
```

### JavaScript (Backend)
- **Modules**: CommonJS (`require`/`module.exports`)
- **File naming**: kebab-case with `.controller.js`, `.routes.js`, `.model.js` suffixes
- **Quotes**: Single quotes preferred
- **Semicolons**: Use consistently
- **Indentation**: 4 spaces
- **Async patterns**: Use async/await with try/catch

Example:
```javascript
const Model = require('../models/model.js');

exports.functionName = async (req, res) => {
    try {
        const data = await Model.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

### Naming Conventions
- **Components**: PascalCase (`Overview.jsx`, `NumberCard.jsx`)
- **Variables/Functions**: camelCase (`fetchTransactions`, `getUser`)
- **Constants**: UPPER_SNAKE_CASE for env vars and config
- **CSS**: kebab-case class names (e.g., `dash-component-container`)
- **Database models**: PascalCase schema names, camelCase fields

### Error Handling
- **Frontend**: Use try/catch with console.error for debugging, set error state for UI
- **Backend**: Always wrap async operations in try/catch, return appropriate HTTP status codes
- **Response format**: `{ message: 'error description' }` for errors

### API Calls
- Centralize in `/frontend/src/pages/api/api.js`
- Use helper function for auth headers
- Return `response.data` from API functions
- Base URL: `http://localhost:5001`

### Environment Variables
- Stored in `/server/.env` (NEVER commit this file)
- Required variables: `DB_URL`, `JWT_SECRET`, `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`
- Access in backend: `process.env.VAR_NAME`

### CSS
- Co-locate CSS files with components (same directory)
- Use kebab-case for class names
- Import CSS last in component files

### Routing
- Frontend: React Router v7 with nested routes
- Backend: Route files in `/server/routes/`, mount in `server.js`

### Testing
- Framework: Jest + React Testing Library
- Test files: `*.test.js` or `*.test.jsx` co-located with components
- No tests currently exist - create new ones following project patterns

## Important Notes
- No TypeScript - use JSDoc comments for complex types if needed
- MongoDB/Mongoose for database
- JWT tokens stored in localStorage
- Plaid integration for bank account linking
- Always check if user is authenticated before protected API calls
- Frontend runs on port 3000, backend on port 5001
