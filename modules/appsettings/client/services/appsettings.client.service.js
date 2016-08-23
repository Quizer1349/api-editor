//Appsettings service used to communicate Appsettings REST endpoints
(function () {
  'use strict';

  angular
    .module('appsettings')
    .factory('AppsettingsService', AppsettingsService);

  AppsettingsService.$inject = ['$resource'];

  function AppsettingsService($resource) {
    return $resource('api/appsettings/:appsettingId', {
      appsettingId: '@_id'
    }, {
      query: {
        method: 'GET', isArray: true,
        transformResponse: function (data) {
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
