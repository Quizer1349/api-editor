'use strict';

var messages = require('../controllers/messenger.server.controller');

module.exports = function(app) {
  app.route('/webhook')
        .get(messages.validateToken)
        .post(messages.handleCallback);
};
