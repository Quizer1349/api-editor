'use strict';

/**
 * Module dependencies
 */
var adminnotificationsPolicy = require('../policies/adminnotifications.server.policy'),
  adminnotifications = require('../controllers/adminnotifications.server.controller');

module.exports = function(app) {
  // Adminnotifications Routes
  app.route('/api/adminnotifications').all(adminnotificationsPolicy.isAllowed)
    .get(adminnotifications.list)
    .post(adminnotifications.create);

  app.route('/api/adminnotifications/send/:adminnotificationId').all(adminnotificationsPolicy.isAllowed)
      .get(adminnotifications.send);

  app.route('/api/adminnotifications/:adminnotificationId').all(adminnotificationsPolicy.isAllowed)
    .get(adminnotifications.read)
    .put(adminnotifications.update)
    .delete(adminnotifications.delete);

  // Finish by binding the Adminnotification middleware
  app.param('adminnotificationId', adminnotifications.adminnotificationByID);
};
