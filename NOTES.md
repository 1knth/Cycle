Plan: Build Financial Tracking App with Plaid & Budget Forecasting

(1) Fix broken authentication and connect routes,

(2) Implement Plaid integration with transaction sync,

(3) Add budget forecasting. Currently, your login is broken, Plaid routes aren't mounted, and frontend isn't fetching real data. You need to work backend-first to establish a stable API before the frontend can consume it.

DONE:

- Fix authentication pipeline - Repair auth.controller.js login() function, add JWT middleware, mount authRoutes.js properly in server.js

TO-DO

- Mount Plaid routes - Import and activate linkToken.js routes in server.js, fix clientUserId to use authenticated user

- Create transaction sync endpoint - Build controller function to fetch transactions from Plaid API and persist to transactionModel.js

- Fix schema mismatches - Align transaction.controller.js expectations with transactionModel.js schema structure

- Connect frontend to real API - Update Overview.js, Transactions.js, and PlaidLinkButton.js to call correct endpoints and fetch real data

- Add budget forecasting - Create budget model and controller with safe financial forecasting (moving averages, trend analysis, category spending)

- Further Considerations
  Authentication approach - Use JWT with refresh tokens? Sessions? Bearer tokens stored in httpOnly cookies? (Recommend JWT with refresh tokens for security)

- Budget forecasting model - Simple rules-based (monthly average × 12 = yearly)? ML-based (regression analysis)? Time-series forecasting (ARIMA)? (Recommend starting with moving averages + category trends, expand to ARIMA if needed)

- Real-time vs batch sync - Poll Plaid for new transactions periodically? Use webhooks? (Recommend daily batch sync initially + webhooks for real-time)
