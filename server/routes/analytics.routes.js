const analyticsController = require('../controllers/analytics.controller.js');

module.exports = function(app) {
    app.post('/dashboard/analytics/forecast', analyticsController.calculateAnalytics);
};