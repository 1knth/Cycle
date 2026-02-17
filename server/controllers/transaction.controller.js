const { Transactions } = require('../models/transaction.model.js');
const Account = require('../models/account.model.js');
const User = require('../models/user');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { calculateMetrics } = require('../services/transaction.service.js')
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

// Helper function to sync accounts from Plaid
const syncAccountsFromPlaid = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user || !user.plaidAccessToken) {
    throw new Error('No bank account linked');
  }

  try {
    const response = await plaidClient.accountsGet({
      access_token: user.plaidAccessToken
    });

    const accounts = response.data.accounts;
    const item = response.data.item;

    // Get institution info
    let institutionName = 'Unknown Bank';
    let institutionId = item.institution_id;

    if (institutionId) {
      try {
        const instResponse = await plaidClient.institutionsGetById({
          institution_id: institutionId,
          country_codes: ['US', 'CA']
        });
        institutionName = instResponse.data.institution.name;
      } catch (e) {
        console.log('Could not fetch institution name');
      }
    }

    // Save/update each account 
    // not using bulkwrite because a user rarely has more than 10 bank accounts

    for (const account of accounts) {
      await Account.findOneAndUpdate(
        { plaidAccountId: account.account_id },
        {
          $set: {
            userId: userId,
            plaidItemId: item.item_id,
            plaidAccountId: account.account_id,
            name: account.name,
            officialName: account.official_name,
            mask: account.mask,
            type: account.type,
            subtype: account.subtype,
            currentBalance: account.balances.current || 0,
            availableBalance: account.balances.available || 0,
            currency: account.balances.iso_currency_code || 'USD',
            institutionName: institutionName,
            institutionId: institutionId
          }
        },
        { upsert: true, new: true }
      );
    }

    return accounts;
  } catch (error) {
    console.error('Error syncing accounts:', error.message);
    throw error;
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.plaidAccessToken) {
      return res.status(400).json({ error: 'No bank account linked' });
    }

    // 1. Fetch "Sync" Data from Plaid
    // We pass the 'cursor' so Plaid only gives us what changed since last time.
    const response = await plaidClient.transactionsSync({
      access_token: user.plaidAccessToken,
      cursor: user.plaidCursor || null, // <--- CRITICAL: Send the last cursor
      count: 500 // Max items per page
    });

    const { added, modified, removed, next_cursor } = response.data;

    // 2. Prepare Database Operations (BulkWrite)
    const operations = [];

    // HANDLE ADDED + MODIFIED (They act the same: Upsert)
    const transactionsToUpdate = [...added, ...modified];
    
    transactionsToUpdate.forEach(t => {
      operations.push(
      {
        updateOne: {
          filter: { plaidTransactionId: t.transaction_id }, // Find by Plaid ID
          update: {
            $set: {
              amount: t.amount,
              date: t.date,
              merchantName: t.merchant_name || t.merchantName || 'Unknown',
              category: t.personal_finance_category || 'Uncategorized',
              accountId: t.account_id,
              pending: t.pending, // Important for updates!
              // Any other fields you want to update...
            },
            $setOnInsert: {
              userId: user._id,
              plaidItemId: t.item_id, // Usually matches user.plaidItemId
              plaidTransactionId: t.transaction_id
            }
          }, upsert: true 
        }
      });
    });

    // HANDLE REMOVED (Delete from DB)
    removed.forEach(t => {
      operations.push({
        deleteOne: {
          filter: { plaidTransactionId: t.transaction_id }
        }
      });
    });

    // 3. Execute Bulk Write (One big fast request)
    if (operations.length > 0) {
      await Transactions.bulkWrite(operations);
    }

    // 4. SAVE THE CURSOR (Crucial!)
    // Next time, we start from here.
    user.plaidCursor = next_cursor;
    await user.save();

    res.json({ 
      success: true, 
      added: added.length, 
      modified: modified.length, 
      removed: removed.length 
    });

  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ error: error.message });
  }
};

// exports.getTransactions = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
    
//     if (!user || !user.plaidAccessToken) {
//       return res.status(400).json({ error: 'No bank account linked' });
//     }

//     // Sync accounts first
//     await syncAccountsFromPlaid(req.user._id);

//     const response = await plaidClient.transactionsSync({
//       access_token: user.plaidAccessToken,
//     });
    
//     const newTransactions = response.data.added;

//     for (const t of newTransactions) {
//       await Transactions.findOneAndUpdate(
//         { plaidTransactionId: t.transaction_id },
//         {
//           $set: {
//             amount: t.amount,
//             date: t.date,
//             merchantName: t.merchant_name || 'Unknown',
//             category: t.personal_finance_category?.primary || 'Uncategorized',
//             accountId: t.account_id
//           },
//           $setOnInsert: {
//             userId: user._id,
//             plaidItemId: user.plaidItemId,
//             plaidTransactionId: t.transaction_id
//           }
//         },
//         { upsert: true, new: true, setDefaultOnInsert: true }
//       );
//     }

//     res.json({ success: true, count: newTransactions.length });
//   } catch (error) {
//     console.error('Error in getTransactions:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.readTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(req.query.limit || 100));
    
    res.json(transactions);
  } catch (err) {
    console.error('Error in readTransactions:', err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    // First, try to sync accounts from Plaid to ensure we have latest data
    try {
      await syncAccountsFromPlaid(req.user._id);
    } catch (syncErr) {
      console.log('Could not sync accounts from Plaid:', syncErr.message);
      // Continue with cached accounts if sync fails
    }

    const accounts = await Account.find({ userId: req.user._id })
      .sort({ institutionName: 1, type: 1, name: 1 });

    // Group by institution
    const grouped = accounts.reduce((groups, account) => {
      const inst = account.institutionName || 'Other';
      if (!groups[inst]) groups[inst] = [];
      groups[inst].push({
        id: account.plaidAccountId,
        name: account.name,
        mask: account.mask,
        type: account.subtype || account.type,
        currentBalance: account.currentBalance,
        currency: account.currency
      });
      return groups;
    }, {});

    res.json({
      accounts: accounts.map(acc => ({
        id: acc.plaidAccountId,
        name: acc.name,
        mask: acc.mask,
        type: acc.subtype || acc.type,
        institution: acc.institutionName,
        currentBalance: acc.currentBalance,
        currency: acc.currency
      })),
      groupedByInstitution: grouped
    });
  } catch (err) {
    console.error('Error in getAccounts:', err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

exports.syncAccounts = async (req, res) => {
  try {
    await syncAccountsFromPlaid(req.user._id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error in syncAccounts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.calculateMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    const accountId = req.query.accountId;
    const timeRange = req.query.timeRange || '1M';
    const result = await calculateMetrics(userId, accountId, timeRange)
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Calculation error: " + err.message });
  }
};
