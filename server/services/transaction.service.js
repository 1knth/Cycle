const {Transactions } = require('../models/transaction.model.js');
const Account = require ('../models/account.model.js');


exports.calculateMetrics = async ( userId, accountId, timeRange) => {
    try {
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

        // .find from mongoose
        // returns: sorted transactions array (newest - oldest)
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
        
        // edge case
        if (transactions.length === 0) {
            return ({
                transactions: false,
                totalTxn: 0,
                balance: balance,
                totalSpend: 0,
                avgTxn: 0,
                monthlySpend: 0,
                delta: {
                    spendingArray: [0,0,0,0,0],
                    portfolioArray: [0,0,0,0,0],
                    income: 0,
                    portfolio: 0,
                    spending: 0
                }
            });
        }

        // total spend
        const spendingArray = [];
        const portfolioArray = [];
        let totalSpend = 0;
        let totalIncome = 0;
        for (const t of transactions) {
            const amount = t.amount;
            let tempSpend = 0;
            let tempIncome = 0;
            // for credits
            if (amount < 0) {
                totalIncome += Math.abs(amount);
                tempIncome = Math.abs(amount);
            } else { // payment out
                totalSpend += amount;
                tempSpend = amount;
                spendingArray.push(amount);
            }
            let delta = balance + tempIncome + tempSpend;
            portfolioArray.push(delta);
        }
        const portfolioDelta = ((totalIncome - totalSpend) / 100).toFixed(2);
        const spendingDelta = ((totalSpend / spendingArray.length) / 100).toFixed(2);


        // average transaction price
        const avgTxn = spendingArray.length > 0 ? totalSpend / spendingArray.length : 0;

        // Monthly spend (current month)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
        const monthlySpend = monthlyTransactions.reduce((sum, t) => {
            return t.amount < 0 ? sum + Math.abs(t.amount) : sum;
        }, 0);
        
        if (spendingArray.length < 2) {
            spendingArray.unshift(0);
        }
        if (portfolioArray.length < 2) {
            portfolioArray.unshift(0);
        }


        return ({
            transactions: true,
            totalTxn: transactions.length,
            balance: balance,
            totalSpend: totalSpend,
            avgTxn: avgTxn,
            monthlySpend: monthlySpend,
            delta: {
                spendingArray: spendingArray,
                portfolioArray: portfolioArray,
                income: totalIncome,
                portfolio: portfolioDelta,
                spending: spendingDelta
            }
        });
    } catch (err) {throw err;}
}