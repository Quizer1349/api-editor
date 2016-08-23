'use strict';

/**
 * Module dependencies
 */
var adaccountsPolicy = require('../policies/adaccounts.server.policy'),
  adaccounts = require('../controllers/adaccounts.server.controller');

module.exports = function(app) {
  // Adaccounts Routes
  app.route('/api/adaccounts').all(adaccountsPolicy.isAllowed)
    .get(adaccounts.list)
    .post(adaccounts.create);

  app.route('/api/adaccounts/:adaccountId').all(adaccountsPolicy.isAllowed)
    .get(adaccounts.read)
    .put(adaccounts.update)
    .delete(adaccounts.delete);

  // Finish by binding the Adaccount middleware
  app.param('adaccountId', adaccounts.adaccountByID);
};
