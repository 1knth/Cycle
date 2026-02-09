# Project Overview

This is a full-stack web application for financial forecasting. It uses the Plaid API to securely connect to users' bank accounts and retrieve financial data. The application is built with a React frontend and a Node.js/Express backend, with MongoDB as the database.

## Building and Running

### Frontend

To run the frontend, navigate to the `frontend` directory and run the following commands:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Backend

To run the backend, navigate to the `server` directory and run the following commands:

```bash
# Install dependencies
npm install

# Start the server
npm start
```

**Note:** The backend requires a `.env` file with a `DB_URL` variable for the MongoDB connection.

## Development Conventions

### Frontend

The frontend is a standard React application created with `create-react-app`. It uses `react-router-dom` for routing and `axios` for making API requests. Components are organized by feature in the `src/components` directory.

### Backend

The backend is a standard Node.js/Express application. It uses `mongoose` for interacting with the MongoDB database and the `plaid` library for connecting to the Plaid API. Routes are defined in the `routes` directory and controllers in the `controllers` directory.


### Additional Coding Preference
- Use semicolons for JavaScript.
- Do not stray away from the existing tech stack unless permitted to do so. 
- Always recommend better programming/styling choices when needed.
- Keep project dependencies minimal.
- Use relative imports not path alias.