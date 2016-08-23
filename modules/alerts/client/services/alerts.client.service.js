//Alerts service used to communicate Alerts REST endpoints
(function () {
  'use strict';

  angular
    .module('alerts')
    .factory('AlertsService', AlertsService);

  AlertsService.$inject = ['$resource'];

  function AlertsService($resource) {
    return $resource('api/alerts/:alertId', {
      alertId: '@_id'
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
