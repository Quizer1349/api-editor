//Adsets service used to communicate Adsets REST endpoints
(function () {
  'use strict';

  angular
    .module('adsets')
    .factory('AdsetsService', AdsetsService);

  AdsetsService.$inject = ['$resource'];

  function AdsetsService($resource) {
    return $resource('api/adsets/:adsetId', {
      adsetId: '@_id'
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
