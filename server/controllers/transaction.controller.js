import {Transactions} from '../models/transaction.model.js';
import Account from '../models/account.model.js';
import PlaidItem from '../models/plaid-item.model.js';
import {Configuration, PlaidApi, PlaidEnvironments} from 'plaid';
import { calculateMetrics as calculateMetricsService } from '../services/transaction.service.js';
import 'dotenv/config';

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

const syncAccountsForPlaidItem = async (plaidItem) => {
  if (!plaidItem || !plaidItem.plaidAccessToken) {
    throw new Error('No plaid item provided');
  }

  try {
    const response = await plaidClient.accountsGet({
      access_token: plaidItem.plaidAccessToken
    });

    const accounts = response.data.accounts;
    const item = response.data.item;

    for (const account of accounts) {
      await Account.findOneAndUpdate(
        { plaidAccountId: account.account_id },
        {
          $set: {
            userId: plaidItem.user,
            plaidItemId: plaidItem._id,
            plaidAccountId: account.account_id,
            name: account.name,
            officialName: account.official_name,
            mask: account.mask,
            type: account.type,
            subtype: account.subtype,
            currentBalance: account.balances.current || 0,
            availableBalance: account.balances.available || 0,
            currency: account.balances.iso_currency_code || 'USD',
            institutionName: plaidItem.institutionName,
            institutionId: plaidItem.institutionId
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

export const syncTransactions = async (req, res) => {
  try {
    const { plaidItemId } = req.params;
    
    const plaidItem = await PlaidItem.findOne({ 
      _id: plaidItemId, 
      user: req.user._id 
    });
    
    if (!plaidItem) {
      return res.status(403).json({ error: 'Not authorized to access this bank' });
    }
    
    try {
      await syncAccountsForPlaidItem(plaidItem);
    } catch (err) {
      console.log('Account sync warning:', err.message);
    }

    const response = await plaidClient.transactionsSync({
      access_token: plaidItem.plaidAccessToken,
      cursor: plaidItem.plaidCursor || null,
      count: 500
    });

    const { added, modified, removed, next_cursor } = response.data;

    const operations = [];

    [...added, ...modified].forEach(t => {
      operations.push({
        updateOne: {
          filter: { plaidTransactionId: t.transaction_id },
          update: {
            $set: {
              amount: t.amount,
              date: t.date,
              merchantName: t.merchant_name || 'Unknown',
              category: t.personal_finance_category || 'Uncategorized',
              accountId: t.account_id,
              pending: t.pending,
            },
            $setOnInsert: {
              userId: req.user._id,
              plaidItemId: plaidItem._id,
              plaidTransactionId: t.transaction_id
            }
          },
          upsert: true
        }
      });
    });

    removed.forEach(t => {
      operations.push({
        deleteOne: {
          filter: { plaidTransactionId: t.transaction_id }
        }
      });
    });

    if (operations.length > 0) {
      await Transactions.bulkWrite(operations);
    }

    plaidItem.plaidCursor = next_cursor;
    plaidItem.lastSync = new Date();
    plaidItem.status = 'good';
    plaidItem.lastSyncError = null;
    await plaidItem.save();

    res.json({ 
      success: true, 
      stats: {
        added: added.length, 
        modified: modified.length, 
        removed: removed.length 
      }
    });

  } catch (error) {
    console.error('Error in syncTransactions:', error);
    
    try {
      const plaidItem = await PlaidItem.findById(req.params.plaidItemId);
      if (plaidItem) {
        plaidItem.status = 'error';
        plaidItem.lastSyncError = error.message;
        await plaidItem.save();
      }
    } catch (e) {
      console.error('Failed to update error state:', e);
    }

    res.json({ 
      success: false, 
      stats: { added: 0, modified: 0, removed: 0 },
      error: 'Sync failed, will retry later'
    });
  }
};

export const syncAllTransactions = async (req, res) => {
  try {
    const plaidItems = await PlaidItem.find({ user: req.user._id });
    
    let totalAdded = 0;
    let totalModified = 0;
    let totalRemoved = 0;

    for (const item of plaidItems) {
      try {
        const mockReq = {
          user: req.user,
          params: { plaidItemId: item._id.toString() }
        };
        
        let syncResult;
        const mockRes = {
          json: (data) => { syncResult = data; },
          status: () => ({ json: (data) => { syncResult = data; } })
        };

        await syncTransactions(mockReq, mockRes);
        
        if (syncResult && syncResult.stats) {
          totalAdded += syncResult.stats.added;
          totalModified += syncResult.stats.modified;
          totalRemoved += syncResult.stats.removed;
        }
      } catch (err) {
        console.error(`Failed to sync ${item.institutionName}:`, err);
      }
    }

    res.json({
      success: true,
      stats: {
        added: totalAdded,
        modified: totalModified,
        removed: totalRemoved
      }
    });
  } catch (error) {
    console.error('Error in syncAllTransactions:', error);
    res.json({ 
      success: false, 
      stats: { added: 0, modified: 0, removed: 0 }
    });
  }
};

export const getPlaidItems = async (req, res) => {
  try {
    const items = await PlaidItem.find({ user: req.user._id })
      .select('_id institutionName status lastSync lastSyncError createdAt');

    const itemsWithCounts = await Promise.all(
      items.map(async (item) => {
        const accountCount = await Account.countDocuments({ plaidItemId: item._id });
        return {
          ...item.toObject(),
          accountCount
        };
      })
    );

    res.json({ items: itemsWithCounts });
  } catch (error) {
    console.error('Error in getPlaidItems:', error);
    res.status(500).json({ error: error.message });
  }
};

export const readTransactions = async (req, res) => {
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

export const getAccounts = async (req, res) => {
  try {
    const plaidItems = await PlaidItem.find({ user: req.user._id });
    
    for (const item of plaidItems) {
      try {
        await syncAccountsForPlaidItem(item);
      } catch (syncErr) {
        console.log(`Could not sync accounts for ${item.institutionName}:`, syncErr.message);
      }
    }

    const accounts = await Account.find({ userId: req.user._id })
      .sort({ institutionName: 1, type: 1, name: 1 });

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

export const syncAccounts = async (req, res) => {
  try {
    const plaidItems = await PlaidItem.find({ user: req.user._id });
    
    for (const item of plaidItems) {
      try {
        await syncAccountsForPlaidItem(item);
      } catch (err) {
        console.error(`Failed to sync accounts for ${item.institutionName}:`, err);
      }
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error in syncAccounts:', err);
    res.status(500).json({ error: err.message });
  }
};

export const calculateMetricsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const accountId = req.query.accountId;
    const timeRange = req.query.timeRange || '1M';
    const result = await calculateMetricsService(userId, accountId, timeRange)
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Calculation error: " + err.message });
  }
};
