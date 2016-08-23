'use strict';

/**
 * Module dependencies
 */
var notificationeventsPolicy = require('../policies/notificationevents.server.policy'),
  notificationevents = require('../controllers/notificationevents.server.controller');

module.exports = function(app) {
  // Notificationevents Routes
  app.route('/api/notificationevents').all(notificationeventsPolicy.isAllowed)
    .get(notificationevents.list)
    .post(notificationevents.create);

  app.route('/api/notificationevents/:notificationeventId').all(notificationeventsPolicy.isAllowed)
    .get(notificationevents.read)
    .put(notificationevents.update)
    .delete(notificationevents.delete);

  // Finish by binding the Notificationevent middleware
  app.param('notificationeventId', notificationevents.notificationeventByID);
};
