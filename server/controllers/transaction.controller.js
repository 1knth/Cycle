const { Transactions } = require('../models/transaction.model.js');
const Account = require('../models/account.model.js');
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

    // Sync accounts first
    await syncAccountsFromPlaid(req.user._id);

    const response = await plaidClient.transactionsSync({
      access_token: user.plaidAccessToken,
    });
    
    const newTransactions = response.data.added;

    for (const t of newTransactions) {
      await Transactions.findOneAndUpdate(
        { plaidTransactionId: t.transaction_id },
        {
          $set: {
            amount: t.amount,
            date: t.date,
            merchantName: t.merchant_name || 'Unknown',
            category: t.personal_finance_category?.primary || 'Uncategorized',
            accountId: t.account_id
          },
          $setOnInsert: {
            userId: user._id,
            plaidItemId: user.plaidItemId,
            plaidTransactionId: t.transaction_id
          }
        },
        { upsert: true, new: true, setDefaultOnInsert: true }
      );
    }

    res.json({ success: true, count: newTransactions.length });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ error: error.message });
  }
};

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

    // Build query
    const queryFilter = { userId: userId };
    
    if (accountId && accountId !== 'all') {
      queryFilter.accountId = accountId;
    }

    // Time range filter
    const now = new Date();
    let startDate = null;

    switch(timeRange) {
      case '1W':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '1Y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      queryFilter.date = { $gte: startDate };
    }

    const transactions = await Transactions.find(queryFilter).sort({ date: -1 });

    // Get balance
    let balance = 0;
    if (accountId && accountId !== 'all') {
      const account = await Account.findOne({ 
        userId: userId, 
        plaidAccountId: accountId 
      });
      balance = account?.currentBalance || 0;
    } else {
      // Sum all account balances
      const allAccounts = await Account.find({ userId: userId });
      balance = allAccounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
    }

    if (transactions.length === 0) {
      return res.json({
        transactions: false,
        totalTxn: 0,
        balance: balance,
        totalSpend: 0,
        avgTxn: 0,
        monthlySpend: 0
      });
    }

    let totalSpend = 0;
    
    for (const t of transactions) {
      if (t.amount < 0) {
        totalSpend += Math.abs(t.amount);
      }
    }
    const avgTxn = totalSpend / transactions.length;

    // Monthly spend (current month)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
    const monthlySpend = monthlyTransactions.reduce((sum, t) => {
      return t.amount < 0 ? sum + Math.abs(t.amount) : sum;
    }, 0);

    res.json({
      transactions: true,
      totalTxn: transactions.length,
      balance: balance,
      totalSpend: totalSpend,
      avgTxn: avgTxn,
      monthlySpend: monthlySpend,
    });
  } catch (err) {
    console.error('Error in calculateMetrics:', err);
    res.status(500).json({ error: "Calculation error: " + err.message });
  }
};
