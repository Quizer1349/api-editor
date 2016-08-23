'use strict';

/**
 * Module dependencies
 */
var trackingparamsPolicy = require('../policies/trackingparams.server.policy'),
  trackingparams = require('../controllers/trackingparams.server.controller');

module.exports = function(app) {
  // Trackingparams Routes
  app.route('/api/trackingparams').all(trackingparamsPolicy.isAllowed)
    .get(trackingparams.list)
    .post(trackingparams.create);

  app.route('/api/trackingparams/:trackingparamId').all(trackingparamsPolicy.isAllowed)
    .get(trackingparams.read)
    .put(trackingparams.update)
    .delete(trackingparams.delete);

  // Finish by binding the Trackingparam middleware
  app.param('trackingparamId', trackingparams.trackingparamByID);
};
