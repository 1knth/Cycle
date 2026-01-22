const transactionController = require('../controllers/transaction.controller.js');

module.exports = function(app) {
    app.post('/api/transaction/add', transactionController.addTransaction);
}