const transactionController = require('../controllers/transaction.controller.js');
const { verifyToken } = require('../controllers/auth.controller.js');

module.exports = function(app) {
    app.get('/api/plaid/transactions', verifyToken, transactionController.getTransactions);
    app.get('/transactions', verifyToken, transactionController.readTransactions);
    app.get('/transactions/overview', verifyToken, transactionController.calculateMetrics);
    app.get('/api/accounts', verifyToken, transactionController.getAccounts);
    app.post('/api/accounts/sync', verifyToken, transactionController.syncAccounts);
};
