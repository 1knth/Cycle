const transactionController = require('../controllers/transaction.controller.js');

module.exports = function(app) {
    app.post('/transactions/add', transactionController.addTransaction);
}