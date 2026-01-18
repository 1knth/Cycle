What to build (core features)
If Cycle is spend-plan-first, the budget model and UI usually center on:
​

Income recognition: regular income streams + pay cycle.
​

Bills/recurring engine: detect, confirm, and schedule recurring items; distinguish bills vs subscriptions.
​

Planned spending bucket: optional category targets (not strict caps), plus one-time planned expenses.
​

“Available / safe-to-spend” number: what remains after bills + goals + planned items.
​

How this differs from envelopes (so you don’t accidentally build both)
Envelope/zero-based systems push you to assign every dollar to categories (“every dollar has a job”), and overspending in one category forces tradeoffs between categories.
​
Spend plans can still show categories, but the “truth” is your overall plan (bills, goals, runway), with categories acting as guidance and diagnostics


READ:

Best order for Cycle (MVP)
Auth + user model (skeleton app)

Sign up / login / logout, session handling, protected routes, basic “user” table/collection.

This unlocks “per-user” data storage (Plaid tokens, accounts, transactions).
​

Dashboard UI with fake data

Build the Overview/Analysis pages and components using static JSON so layout + UX stabilizes early.

This prevents you from overfitting UI to whatever Plaid returns on day one.
​

Plaid linking + data ingestion

Implement Link flow, store tokens, then sync transactions incrementally (Plaid Transactions supports sync patterns).
​

Real aggregates + spend plan logic

Compute safe-to-spend, forecasts, and analysis modules once transaction ingestion is reliable.



NEXT STEPS: 

Project skeleton
 Create /server Express app with express.json() + centralized error handler.
​

 Add a router-per-domain structure: /api/auth, /api/plaid, /api/accounts, /api/transactions, /api/insights.
​

 Connect MongoDB Atlas with env vars and a single shared DB client/connection module.

Auth (cookie-based)
 Implement POST /api/auth/register (hash password, create user).

 Implement POST /api/auth/login (verify password, issue session cookie).

 Implement POST /api/auth/logout (clear cookie / invalidate session).

 Implement GET /api/auth/me (returns current user).

 Store auth token in an HttpOnly cookie (not localStorage) to reduce JavaScript access to the token.
​

 Set cookie attributes that OWASP highlights for session cookies: HttpOnly, Secure, SameSite, and an explicit lifetime.
​

 Add requireAuth middleware that blocks protected endpoints when the cookie/session is missing or invalid.
​

Plaid integration (server-only)
 POST /api/plaid/link-token → create link token for the logged-in user.

 POST /api/plaid/exchange-public-token → exchange public_token for access_token + item_id, store encrypted per user.

 DB collection: plaid_items { userId, itemId, accessTokenEncrypted, institution, createdAt }.

Transactions & accounts data layer
 POST /api/sync/transactions (per user): pull incremental updates, upsert into transactions, update sync_state cursor.

 GET /api/accounts and GET /api/transactions?start=&end=&accountId= for your UI.

 Add user overrides tables/collections: category_overrides, merchant_overrides, excluded_transactions (so analysis becomes consistent).

Spend plan computations (what your UI will call)
 GET /api/overview returns: safe-to-spend, MTD spend, income MTD, bills remaining this period, daily spend series, recent transactions.

 GET /api/analysis returns: cash-flow series, category breakdown, top movers vs last month, forecast-to-period-end.

Frontend hookup (CRA)
 In CRA package.json, set "proxy": "http://localhost:<serverPort>" so fetch('/api/...') works without CORS during dev.
​

 Create an API client wrapper that always calls /api/* and handles 401 → redirect to /login.