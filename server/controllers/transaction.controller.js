const Transaction = require('../models/transaction.model.js');
const User = require('../models/user');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});
const plaidClient = new PlaidApi(configuration);

exports.addTransaction = async (req, res) => {
    const { plaidTransactionId, amount, date, merchantName, category } = req.body;
    const userId = req.user._id;

    try {
        const transaction = new Transaction({
            userId,
            plaidTransactionId,
            amount,
            date,
            merchantName,
            category,
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error saving transaction', error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const accessToken = user.plaidAccessToken;

    const request = {
      access_token: accessToken,
    };

    const response = await plaidClient.transactionsSync(request);
    res.json(response.data);
  } catch (error) {
    console.error('Plaid Transactions Error:', error);
    res.status(500).json({ error: error.message });
  }
};