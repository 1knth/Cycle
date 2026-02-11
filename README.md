# Cycle - Financial Tracking & Budget Forecasting App

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Plaid Integration Guide](#plaid-integration-guide)
5. [Authentication System](#authentication-system)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Problems Solved](#problems-solved)
9. [Frontend Components](#frontend-components)
10. [Environment Setup](#environment-setup)
11. [Data Flow](#data-flow)
12. [Key Lessons & Best Practices](#key-lessons--best-practices)

---

## Project Overview

**Cycle** is a full-stack financial tracking and budget forecasting application that integrates with the Plaid API to securely connect users' bank accounts and provide:

- Real-time transaction tracking
- Spending analysis and categorization
- Budget forecasting with trend analysis
- Historical financial data visualization
- Secure bank account linking

### Core Features
- **User Authentication**: JWT-based signup/login system
- **Bank Account Linking**: Secure connection via Plaid API
- **Transaction Sync**: Automatic fetching of bank transactions
- **Dashboard Analytics**: Real-time financial metrics and insights
- **Responsive UI**: Mobile and desktop optimized interface

**Note (Feb 2026)**: This is a portfolio project currently running in the Plaid Sandbox environment. It is not intended for production use with real banking credentials yet.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.0 | UI framework |
| React Router DOM | ^7.12.0 | Client-side routing |
| React Plaid Link | ^4.1.1 | Plaid Link integration |
| Axios | ^1.13.2 | HTTP client |
| Create React App | ^5.0.1 | Build tooling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v24+ | Runtime environment |
| Express | ^5.2.1 | Web framework |
| Mongoose | ^9.1.5 | MongoDB ODM |
| Plaid SDK | ^41.1.0 | Financial API integration |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| cors | ^2.8.6 | Cross-origin requests |
| body-parser | ^2.2.2 | Request parsing |

### Database & Infrastructure
- **MongoDB Atlas**: Cloud-hosted NoSQL database
- **Plaid API**: Financial data aggregation (Sandbox environment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Login/     │  │  Dashboard   │  │  Plaid Link Button   │  │
│  │   Signup     │  │   Layout     │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                 │                       │              │
│         ▼                 ▼                       ▼              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     API Layer (Axios)                      │ │
│  │   - JWT token in localStorage                              │ │
│  │   - Authorization: Bearer <token> headers                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Auth        │  │  Plaid       │  │  Transaction         │  │
│  │  Controller  │  │  Controller  │  │  Controller          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                 │                       │              │
│         ▼                 ▼                       ▼              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   verifyToken Middleware                    │ │
│  │     Decodes JWT → Attaches req.user._id → Next()           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                             │
│  ┌──────────────────────┐      ┌────────────────────────────┐  │
│  │   MongoDB Atlas      │      │   Plaid API                │  │
│  │   - Users            │      │   - Create Link Tokens     │  │
│  │   - Transactions     │      │   - Exchange Tokens        │  │
│  │   - Plaid Items      │      │   - Fetch Transactions     │  │
│  └──────────────────────┘      └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Plaid Integration Guide

### The 3-Step Plaid Flow

#### Step 1: Create Link Token (Temporary)
**Purpose**: Generate a temporary token to open the Plaid Link modal

**Backend** (`server/controllers/link.controller.js`):
```javascript
exports.createLinkToken = async (req, res) => {
  try {
    const clientUserId = req.user._id.toString(); // From JWT
    
    const request = {
      user: { client_user_id: clientUserId },
      client_name: 'Cycle',
      products: ['transactions'],
      country_codes: ['US', 'CA'],
      language: 'en',
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(request);
    res.json(createTokenResponse.data); // Returns { link_token: "temp_xxx" }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend** (`frontend/src/components/link-account-page/PlaidLinkButton.js`):
```javascript
useEffect(() => {
  const createLinkToken = async () => {
    const token = localStorage.getItem('token'); // JWT from login
    const response = await fetch('http://localhost:5001/api/plaid/create-link-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Must include JWT!
      },
    });
    const data = await response.json();
    setToken(data.link_token); // Store for Plaid Link
  };
  createLinkToken();
}, []);
```

#### Step 2: User Connects Bank
**Purpose**: User selects bank and enters credentials in Plaid Link modal

**Frontend**:
```javascript
const { open, ready } = usePlaidLink({
  token: token,              // From Step 1
  onSuccess,                 // Callback function
});

// Button to trigger
<button onClick={() => open()} disabled={!ready}>
  Link Account
</button>
```

**What happens**:
1. Plaid Link modal opens
2. User selects their bank (Chase, Wells Fargo, etc.)
3. User enters bank credentials
4. Plaid validates credentials with bank
5. User selects which accounts to share
6. Plaid returns `public_token` (single-use, expires in 30 minutes)

#### Step 3: Exchange Public Token for Access Token
**Purpose**: Convert temporary public token to permanent access token

**Frontend**:
```javascript
const onSuccess = useCallback(async (publicToken, metadata) => {
  const token = localStorage.getItem('token');
  await fetch('http://localhost:5001/api/plaid/exchange-public-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ public_token: publicToken }),
  });
  // Notify parent component
  if (onLinked) onLinked();
}, [onLinked]);
```

**Backend**:
```javascript
exports.exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    
    // Exchange with Plaid API
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = response.data.access_token; // PERMANENT
    const itemId = response.data.item_id;

    // Save to database
    await User.findByIdAndUpdate(req.user._id, { 
      plaidAccessToken: accessToken, 
      plaidItemId: itemId 
    });

    res.json({ success: true, itemId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Token Types Explained

| Token Type | Lifespan | Purpose | Storage |
|------------|----------|---------|---------|
| **Link Token** | 30 minutes | Open Plaid Link modal | React state only |
| **Public Token** | 30 minutes | Single-use exchange | Plaid returns it, immediately sent to backend |
| **Access Token** | Permanent | Fetch transactions anytime | MongoDB (User.plaidAccessToken) |
| **Item ID** | Permanent | Identify bank connection | MongoDB (User.plaidItemId) |

---

## Authentication System

### JWT Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Login     │────▶│   Backend    │────▶│   MongoDB    │
│  (username,  │     │  (validate   │     │  (find user, │
│   password)  │     │   password)  │     │   return)    │
└──────────────┘     └──────────────┘     └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  JWT.sign()  │
                       │  { id: user._id }
                       └──────────────┘
                              │
                              ▼
┌──────────────┐     ┌──────────────┐
│  Frontend    │◀────│   Response   │
│  (stores in  │     │  { accessToken,
│   localStorage)    │    user data }
└──────────────┘     └──────────────┘
```

### Protected Routes

**Middleware** (`server/controllers/auth.controller.js`):
```javascript
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  // Remove "Bearer " prefix if present
  const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.user = { _id: decoded.id }; // Attach user ID
    next(); // Continue to controller
  });
};
```

**Route Usage**:
```javascript
const { verifyToken } = require('../controllers/auth.controller.js');

// Protected route
app.post('/api/plaid/create-link-token', verifyToken, linkController.createLinkToken);
```

### Frontend Storage

```javascript
// After successful login
localStorage.setItem("user", JSON.stringify(data));        // User info
localStorage.setItem("token", data.accessToken);            // JWT
localStorage.setItem("hasBankLinked", "true");             // Bank status

// Making authenticated requests
const token = localStorage.getItem('token');
fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

---

## Database Schema

### User Model
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  plaidAccessToken: {
    type: String,        // Permanent Plaid access token
  },
  plaidItemId: {
    type: String,        // Plaid item identifier
  },
  lastSync: {
    type: Date,          // Last transaction sync timestamp
  }
}, { timestamps: true }
```

### Transaction Model
```javascript
{
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  plaidItemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PlaidItem' 
  },
  amount: Number,
  category: [String],      // Array of categories
  date: Date,
  merchantName: String,
  plaidTransactionId: { 
    type: String, 
    unique: true 
  }
}, { timestamps: true }
```

### PlaidItem Model
```javascript
{
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  plaidAccessToken: { 
    type: String, 
    required: true 
  },
  plaidItemId: { 
    type: String, 
    required: true 
  },
  institutionName: String,  // "Chase", "Bank of America", etc.
  institutionId: String,    // e.g., "ins_3"
  status: { 
    type: String, 
    default: 'good' 
  }
}, { timestamps: true }
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login and get JWT |

### User
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/user` | Yes | Get current user data |

### Plaid Integration
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/plaid/create-link-token` | Yes | Generate temporary link token |
| POST | `/api/plaid/exchange-public-token` | Yes | Exchange public token for access token |
| GET | `/api/plaid/transactions` | Yes | Fetch user's bank transactions |

### Transactions (Manual)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/transactions/add` | Yes | Add manual transaction |

---

## Problems Solved

### Problem 1: Missing verifyToken Middleware
**Issue**: Routes tried to import `verifyToken` but it didn't exist

**Error**: `TypeError: argument handler must be a function`

**Solution**:
```javascript
// Added to auth.controller.js
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token!' });
  
  const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  
  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Unauthorized!' });
    req.user = { _id: decoded.id };
    next();
  });
};
```

### Problem 2: Missing Authorization Headers
**Issue**: Frontend API calls didn't include JWT tokens

**Error**: Server responds with "No token provided!"

**Solution**:
```javascript
// BEFORE (broken)
await fetch('/api/plaid/create-link-token', {
  headers: { 'Content-Type': 'application/json' },  // ❌ Missing auth
});

// AFTER (fixed)
const token = localStorage.getItem('token');
await fetch('http://localhost:5001/api/plaid/create-link-token', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // ✅ JWT attached
  },
});
```

### Problem 3: Wrong API Configuration
**Issue**: Wrong port (5000 vs 5001), wrong endpoints, missing auth

**Solution**: Complete rewrite of `api.js` with:
- Correct port (5001)
- All endpoints defined
- `getAuthHeaders()` helper for JWT

### Problem 4: Dashboard Loading Delay
**Issue**: Dashboard made API call to check bank status, causing loading delay

**Solution - 2-Layer Storage**:
```javascript
// Layer 1: Login response includes bank status
res.status(200).send({
  // ... user data
  hasBankLinked: !!user.plaidAccessToken  // ✅ Included
});

// Layer 2: localStorage persists across reloads
localStorage.setItem("hasBankLinked", "true");

// Dashboard checks immediately
const [plaidLinked] = useState(() => {
  return localStorage.getItem("hasBankLinked") === "true";  // ✅ Instant!
});
```

### Problem 5: Inverted Button Logic
**Issue**: `disabled={ready}` disabled button when Plaid was ready

**Solution**: `disabled={!ready}`

### Problem 6: Page Reload After Linking
**Issue**: Used `window.location.reload()` after bank connection

**Solution**: Callback chain:
```javascript
// PlaidLinkButton calls onLinked prop
if (onLinked) onLinked();

// Dashboard updates state instantly
const handleLinked = () => {
  setPlaidLinked(true);
  localStorage.setItem("hasBankLinked", "true");
};
```

### Problem 7: Inconsistent User ID Field
**Issue**: JWT payload used `id`, but controllers accessed `req.user.id` and `req.user._id` inconsistently

**Solution**: Standardized on `_id`:
```javascript
// verifyToken always attaches _id
req.user = { _id: decoded.id };

// All controllers use req.user._id
const user = await User.findById(req.user._id);
```

---

## Frontend Components

### Component Hierarchy
```
App.js
├── Home.js (Landing page)
├── Auth.js (Login/Signup - toggle between modes)
└── Dashboard.js (Protected layout)
    ├── Dashbar.js (Navigation sidebar)
    └── Conditional Content:
        ├── LinkAccount.js (If no bank linked)
        │   └── PlaidLinkButton.js (Opens Plaid modal)
        └── Outlet (If bank linked)
            ├── Overview.js (Financial metrics)
            ├── Analytics.js (Charts/graphs)
            ├── Transactions.js (Transaction list)
            └── Settings.js (User settings)
```

### Key Components

#### PlaidLinkButton.js
**Purpose**: Handles Plaid Link integration
**Props**: `onLinked` - callback when bank is connected
**State**: `token` - temporary link token from backend

#### Dashboard.js
**Purpose**: Main dashboard layout with conditional rendering
**Logic**: Checks `localStorage.getItem("hasBankLinked")` to determine view
**Callback**: `handleLinked()` updates state when bank connected

#### Overview.js
**Purpose**: Displays financial metrics
**Data**: Fetches from `/api/plaid/transactions`
**Metrics**: Total transactions, monthly spend, total spend, average transaction

#### Transactions.js
**Purpose**: Lists all transactions
**Features**: 
- Sorts by date (newest first)
- Color-coded amounts (red=expense, green=income)
- Shows merchant, amount, date, category

---

## Environment Setup

### Backend .env
```
# Server
PORT=5001

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/cycle

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Plaid API (Sandbox keys from dashboard.plaid.com)
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret-key
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions
PLAID_COUNTRY_CODES=US,CA
```

### Frontend Setup
No .env needed - all URLs are hardcoded in api.js as `http://localhost:5001`

---

## Data Flow

### User Login Flow
```
1. User enters credentials
   ↓
2. Frontend POSTs to /auth/login
   ↓
3. Backend validates, returns:
   {
     id, username, email,
     accessToken,              // JWT
     plaidAccessToken,         // Bank token (if linked)
     plaidItemId,
     hasBankLinked             // Boolean
   }
   ↓
4. Frontend stores in localStorage:
   - token (JWT)
   - user (user object)
   - hasBankLinked (boolean)
   ↓
5. Navigate to /dashboard
   ↓
6. Dashboard reads localStorage, shows appropriate view
```

### Bank Linking Flow
```
1. Dashboard shows LinkAccount component (no bank linked)
   ↓
2. User clicks "Link Account"
   ↓
3. PlaidLinkButton fetches link token from backend
   ↓
4. Plaid Link modal opens
   ↓
5. User selects bank, enters credentials
   ↓
6. Plaid returns public_token
   ↓
7. Frontend exchanges public_token for access_token
   ↓
8. Backend saves access_token to User document
   ↓
9. Frontend calls onLinked() callback
   ↓
10. Dashboard updates state, shows full dashboard
    ↓
11. localStorage updated: hasBankLinked = "true"
```

### Transaction Fetching Flow
```
1. User navigates to Overview or Transactions
   ↓
2. Component mounts, useEffect triggers
   ↓
3. Frontend calls getTransactions()
   ↓
4. Backend verifyToken extracts user ID from JWT
   ↓
5. Backend queries User collection for plaidAccessToken
   ↓
6. Backend calls Plaid API: transactionsSync(access_token)
   ↓
7. Plaid returns transactions
   ↓
8. Backend returns transactions to frontend
   ↓
9. Frontend displays transactions
```

---

## Key Lessons & Best Practices

### 1. Authentication Pattern
- Always verify JWT on protected routes
- Attach `req.user` in middleware for downstream use
- Store JWT in localStorage, include in every protected request
- Use `Bearer <token>` format in Authorization header

### 2. State Management Strategy
- **localStorage**: Persistence across reloads (auth, bank status)
- **React State**: UI reactivity (dashboard view, transaction data)
- **Callback Props**: Child→Parent communication (onLinked)

### 3. Plaid Best Practices
- Never store access tokens in frontend
- Always exchange public_token immediately (30 min expiry)
- Save access_token securely in database
- Use link tokens fresh (30 min expiry)
- Include `client_user_id` for audit trails

### 4. Error Handling
```javascript
// Backend - always return proper error responses
try {
  // ... operation
} catch (error) {
  console.error('Error:', error.response?.data || error.message);
  res.status(500).json({ error: error.message });
}

// Frontend - handle errors gracefully
try {
  const data = await fetchData();
  setData(data);
} catch (err) {
  console.error('Error:', err);
  setError('Failed to load data');
} finally {
  setLoading(false);
}
```

### 5. Responsive Design
- Use flexbox with `flex-wrap: wrap` for card containers
- Define mobile-first breakpoints (768px, 1024px)
- Use relative units (rem, %) instead of fixed pixels
- Test on multiple screen sizes

### 6. Security Considerations
- Never commit .env files
- Always hash passwords (bcrypt)
- Use HTTPS in production
- Implement rate limiting on auth endpoints
- Validate all inputs

---

## Running the Application

### Development
```bash
# Terminal 1 - Backend
cd server
npm install
npm start
# Server runs on http://localhost:5001

# Terminal 2 - Frontend
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### Production Build
```bash
cd frontend
npm run build
# Creates optimized build/ folder
```

---

## Troubleshooting

### "No token provided" Error
**Cause**: Missing Authorization header
**Fix**: Include `'Authorization': 'Bearer ' + token` in fetch/axios calls

### "User Not Found" on Login
**Cause**: User doesn't exist in database
**Fix**: Sign up first, or check database connection

### Plaid Link Won't Open
**Cause**: Link token expired or not generated
**Fix**: Check backend logs for errors creating link token

### Transactions Not Loading
**Cause**: No bank linked, or access token invalid
**Fix**: Re-link bank account, check User.plaidAccessToken in database

### CORS Errors
**Cause**: Frontend and backend on different ports without CORS enabled
**Fix**: CORS is already enabled in server.js with:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

---

## Future Enhancements

### Budget Forecasting
- Moving average calculations
- Trend analysis
- Spending predictions
- Category breakdowns

### Real-time Updates
- Webhook integration for new transactions
- Automatic sync on login
- Push notifications

### Advanced Analytics
- Monthly/Yearly comparisons
- Spending by category
- Savings rate calculations
- Financial health score

### Production Considerations
- Environment-specific configs
- Database indexing
- API rate limiting
- Error monitoring (Sentry)
- Analytics tracking

---

**Last Updated**: February 2026
**Version**: 1.0
