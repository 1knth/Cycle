import {getBalances} from './account.service.js';
import {getTransactions} from './transaction.service.js';


export const calculateMetrics = async (query) => {
  //
  // setup payloud for fetchTransactions
  // controller shouldve passed in null if all accounts
  //
  const {userId, accountId, timeRange} = query;
  // balance calculation
  // returns: {currentBalance, availableBalance}
  const {currentBalance, availableBalance} = await getBalances(userId, accountId);
  const {transactions: data} = await getTransactions(userId,accountId,timeRange);
  if (!data.length) {
    return {
      balances: {
        currentBalance: currentBalance,
        availableBalance: availableBalance,
      },
      totalTxn: 0.00,
      totalSpend: 0.00,
      avgTxn: 0.00,
      debits: [],
      credits: []
    } 
  }
  const transactions = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  //
  // calculations
  //
  let totalSpend = 0;
  const credits = [];
  const debits = [];
  // assign Credit, Debit, and TotalSpend 
  for (const txn of transactions) {
    const amount = txn.amount;
    if (amount < 0) {
      credits.push(amount);
    } else if (amount > 0) {
      debits.push(amount);
      totalSpend += amount;
    }
  }
  const avgTxn = (totalSpend / debits.length) || 0;

  return { 
    balances: {
      currentBalance,
      availableBalance,
    },
    totalTxn: transactions.length,
    totalSpend,
    avgTxn,
    debits,
    credits,
  };
};

