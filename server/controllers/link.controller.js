import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import 'dotenv/config';
import PlaidItem from '../models/plaid-item.model.js';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async (req, res) => {
  try {
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
    console.error('Plaid Link Token Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    let institutionName = 'Unknown Bank';
    let institutionId = null;
    try {
      const itemResponse = await plaidClient.itemGet({
        access_token: accessToken
      });
      institutionId = itemResponse.data.item.institution_id;
      
      if (institutionId) {
        const instResponse = await plaidClient.institutionsGetById({
          institution_id: institutionId,
          country_codes: ['US', 'CA']
        });
        institutionName = instResponse.data.institution.name;
      }
    } catch (e) {
      console.log('Could not fetch institution name:', e.message);
    }

    const plaidItem = new PlaidItem({
      user: req.user._id,
      plaidAccessToken: accessToken,
      plaidItemId: itemId,
      institutionName: institutionName,
      institutionId: institutionId,
      plaidCursor: null,
      lastSync: null,
      status: 'good'
    });
    await plaidItem.save();

    res.json({ 
      success: true, 
      plaidItem: {
        _id: plaidItem._id,
        plaidItemId: plaidItem.plaidItemId,
        institutionName: plaidItem.institutionName
      }
    });
  } catch (error) {
    console.error('Plaid Exchange Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};