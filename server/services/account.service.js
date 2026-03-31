import Account from '../models/account.model.js';

// Gets Balances from PlaidItemId as accountId, and userId
export const getBalances = async (userId, accountId) => {
  if (!accountId) {
    const accounts = await Account.find({ userId });
    return accounts.reduce((acc, a) => ({
      currentBalance: acc.currentBalance + (a.balances.currentBalance || 0),
      availableBalance: acc.availableBalance + (a.balances.availableBalance || 0),
    }), { currentBalance: 0, availableBalance: 0 });
  }
  const account = await Account.findOne({userId, accountId:accountId });
  return {
    currentBalance: account?.balances?.currentBalance || 0,
    availableBalance: account?.balances?.availableBalance || 0,
  };
};
