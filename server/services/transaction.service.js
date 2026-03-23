import Transaction from '../models/transaction.model.js';
import Account from '../models/account.model.js';

export const getTransactions = async (userId, accountId, timeRange) => {
  const query = {
    userId: userId,
  };
  if (accountId) {
    query.accountId = accountId;
  }

  if (timeRange) {
    query.date = {
      $gte: timeRange,
    }
  }
  const transactions = await Transaction.find(query);
  return {
      transactions: transactions || [], 
  };
};


