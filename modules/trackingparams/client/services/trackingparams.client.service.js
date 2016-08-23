//Trackingparams service used to communicate Trackingparams REST endpoints
(function () {
  'use strict';

  angular
    .module('trackingparams')
    .factory('TrackingparamsService', TrackingparamsService);

  TrackingparamsService.$inject = ['$resource'];

  function TrackingparamsService($resource) {
    return $resource('api/trackingparams/:trackingparamId', {
      trackingparamId: '@_id'
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
