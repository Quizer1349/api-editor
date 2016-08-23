'use strict';

/**
 * Module dependencies
 */
var alertsPolicy = require('../policies/alerts.server.policy'),
  alerts = require('../controllers/alerts.server.controller');

module.exports = function(app) {
  // Alerts Routes
  app.route('/api/alerts').all(alertsPolicy.isAllowed)
    .get(alerts.list)
    .post(alerts.create);

  app.route('/api/alerts/:alertId').all(alertsPolicy.isAllowed)
    .get(alerts.read)
    .put(alerts.update)
    .delete(alerts.delete);

  // Finish by binding the Alert middleware
  app.param('alertId', alerts.alertByID);
};
