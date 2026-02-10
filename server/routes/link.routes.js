const linkController = require('../controllers/link.controller.js');
const { verifyToken } = require('../controllers/auth.controller.js');


module.exports = function(app) {
    // Link Token Route
    app.post('/api/plaid/create-link-token', verifyToken, linkController.createLinkToken);

    // Exchange Token Route
    app.post('/api/plaid/exchange-public-token', verifyToken, linkController.exchangePublicToken);
};