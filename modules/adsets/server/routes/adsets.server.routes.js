'use strict';

/**
 * Module dependencies
 */
var adsetsPolicy = require('../policies/adsets.server.policy'),
  adsets = require('../controllers/adsets.server.controller');

module.exports = function(app) {
  // Adsets Routes
  app.route('/api/adsets').all(adsetsPolicy.isAllowed)
    .get(adsets.list);
    //.post(adsets.create);

  app.route('/api/adsets-search').all(adsetsPolicy.isAllowed)
      .get(adsets.search);

  app.route('/api/adsets/:adsetId').all(adsetsPolicy.isAllowed)
    .get(adsets.read);
    //.put(adsets.update)
    //.delete(adsets.delete);

  // Finish by binding the Adset middleware
  app.param('adsetId', adsets.adsetByID);
};
