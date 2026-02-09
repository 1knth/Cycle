const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

// 1. Configure Plaid Client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Change to .development later
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

// 2. Wrap everything in the export function so 'app' works
module.exports = function(app) {

    // PART 1: Create Link Token
    app.post('/link/create_link_token', async function (request, response) {
        
        // FIX: You need a user ID. For now, we use a static string for testing.
        // Later, you will get this from your logged-in user session.
        const clientUserId = "user_" + crypto.randomUUID();

        const linkTokenRequest = {
            user: {
                client_user_id: clientUserId,
            },
            client_name: 'Cycle Finance',
            products: ['auth', 'transactions'], // Added 'transactions' for your finance app
            language: 'en',
            country_codes: ['US', 'CA'], // US and Canada
            
            // NOTE: Only include redirect_uri if you registered 'http://localhost:3000/' 
            // in your Plaid Dashboard > API > Allowed Redirect URIs.
            // If not, keep this commented out or it will fail.
            // redirect_uri: 'http://localhost:3000/', 
        };

        try {
            const createTokenResponse = await client.linkTokenCreate(linkTokenRequest);
            response.json(createTokenResponse.data);
        } catch (error) {
            console.error("Plaid Error:", error.response ? error.response.data : error.message);
            response.status(500).json({ error: error.message });
        }
    });

    // PART 2: Exchange Public Token
    app.post('/api/exchange_public_token', async function (request, response) {
        const publicToken = request.body.public_token;
        
        try {
            const tokenResponse = await client.itemPublicTokenExchange({
                public_token: publicToken,
            });

            const accessToken = tokenResponse.data.access_token;
            const itemID = tokenResponse.data.item_id;

            console.log("Access Token:", accessToken);
            console.log("Item ID:", itemID);

            // TODO: Save 'accessToken' to your MongoDB user document here!

            response.json({ public_token_exchange: 'complete' });
        } catch (error) {
            console.error("Plaid Exchange Error:", error.response ? error.response.data : error.message);
            response.status(500).json({ error: error.message });
        }
    });
};