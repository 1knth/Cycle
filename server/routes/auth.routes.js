const authController = require('../controllers/auth.controller.js');

module.exports = function(app) {
    app.post('/auth/signup', authController.signup);
    app.post('/auth/login', authController.login);
};
