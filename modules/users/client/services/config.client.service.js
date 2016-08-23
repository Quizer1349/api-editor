'use strict';

/**
 * Created by eugen on 22/08/16.
 */
angular.module('users').factory('Config', ['$resource',
    function ($resource) {
      return $resource('api/users/config', {}, {
        get: {
          method: 'GET'
        }
      });
    }
]);
