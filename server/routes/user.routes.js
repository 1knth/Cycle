const userController = require('../controllers/user.controller.js');
const { verifyToken } = require('../controllers/auth.controller.js');

module.exports = function(app) {
    app.get('/api/user/', verifyToken, userController.getUser);
};