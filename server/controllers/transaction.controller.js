const Transactions = require('../models/transaction.model.js');
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

exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const accessToken = user.plaidAccessToken;

    // 1. response is an object containing a list
    // 2. transactions sync takes the accessToken created after exchanging link token on
    // bank connection
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
    });
    const newTransactions = response.data.added;

    for (const t of newTransactions) {
      // findOneAndUpdate returns an updated document
      // it takes in {filter}{update}{options}
      const transaction = await Transactions.findOneAndUpdate(
        // filter by
        {plaidTransactionId: t.transaction_id},
        // update
        {
          $set: {
            amount: t.amount,
            date: t.date,
            merchantName: t.merchant_name || "Unknown",
            category: {
              primary: t.personal_finance_category.primary,
              detailed: t.personal_finance_category.detailed
            },
          },

          $setOnInsert: {
            userId: user._id,
            plaidItemId: user.plaidItemId,
            plaidTransactionId: t.transaction_id
          }
        },
        //options
        { 
          // create document if doesnt exist
          upsert: true,
          //update state
          new: true,
          setDefaultOnInsert: true
        }
      )
    }
    res.json({success: true, count: newTransactions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.readTransactions = async (req, res) => {
  try {
    // args: filter -> takes in the user id 
    const transactions = await Transactions.find({ userId: req.user._id })
      .sort({date: -1})
      .limit(parseInt(req.query.limit || 10)); 

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

