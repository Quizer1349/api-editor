'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Adsets Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/adsets',
      permissions: ['get']
    },
    {
      resources: '/api/adsets-search',
      permissions: ['get']
    },
    {
      resources: '/api/adsets/:adsetId',
      permissions: ['get']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/adsets',
      permissions: ['get']
    },
    {
      resources: '/api/adsets-search',
      permissions: ['get']
    },
    {
      resources: '/api/adsets/:adsetId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Adsets Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Adset is being processed and the current user created it then allow any manipulation
  if (req.adset && req.user && req.adset.user && req.adset.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
