const transactionController = require('../controllers/transaction.controller.js');
const { verifyToken } = require('../controllers/auth.controller.js');

module.exports = function(app) {
    // app.post('/transactions/add', verifyToken, transactionController.addTransaction);
    app.get('/api/plaid/transactions', verifyToken, transactionController.getTransactions);
    app.get('/transactions', verifyToken, transactionController.readTransactions);
}