'use strict';

/**
 * Module dependencies
 */
var appsettingsPolicy = require('../policies/appsettings.server.policy'),
  appsettings = require('../controllers/appsettings.server.controller');

module.exports = function(app) {
  // Appsettings Routes
  app.route('/api/appsettings').all(appsettingsPolicy.isAllowed)
    .get(appsettings.list)
    .post(appsettings.create);

  app.route('/api/appsettings/:appsettingId').all(appsettingsPolicy.isAllowed)
    .get(appsettings.read)
    .put(appsettings.update)
    .delete(appsettings.delete);

  // Finish by binding the Appsetting middleware
  app.param('appsettingId', appsettings.appsettingByID);
};
