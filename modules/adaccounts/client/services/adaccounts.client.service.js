//Adaccounts service used to communicate Adaccounts REST endpoints
(function () {
  'use strict';

  angular
    .module('adaccounts')
    .factory('AdaccountsService', AdaccountsService);

  AdaccountsService.$inject = ['$resource'];

  function AdaccountsService($resource) {
    return $resource('api/adaccounts/:adaccountId', {
      adaccountId: '@_id'
    }, {
      query: {
        method:'GET', isArray: true,
        transformResponse: function(data) {
          var dataObject = JSON.parse(data);
          return angular.fromJson(dataObject.rows);
        }
      },
      update: {
        method: 'PUT'
      }
    });
  }
})();
