const linkController = require('../controllers/link.controller.js');

module.exports = function(app) {
    app.get('/link/add', linkController.addLink);
}