const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();
const User = require('../models/user');


//intialize plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14', // Recommended to include
    },
  },
});
const plaidClient = new PlaidApi(configuration);

// 1. Create Link Token
exports.createLinkToken = async (req, res) => {
  try {
    // Ensure this is a string
    const clientUserId = req.user._id.toString(); 

    const request = {
      user: { client_user_id: clientUserId },
      client_name: 'Cycle',
      products: ['transactions'],
      country_codes: ['US', 'CA'],
      language: 'en',
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(request);
    res.json(createTokenResponse.data);
  } catch (error) {
    // Plaid errors are usually in error.response.data
    console.error('Plaid Link Token Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 2. Exchange Public Token
exports.exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Corrected Database Save Logic
    await User.findByIdAndUpdate(req.user._id, { 
      plaidAccessToken: accessToken, 
      plaidItemId: itemId 
    });

    res.json({ success: true, itemId });
  } catch (error) {
    console.error('Plaid Exchange Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};