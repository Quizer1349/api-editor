//Adminnotifications service used to communicate Adminnotifications REST endpoints
(function () {
  'use strict';

  angular
    .module('adminnotifications')
    .factory('AdminnotificationsService', AdminnotificationsService);

  AdminnotificationsService.$inject = ['$resource'];

  function AdminnotificationsService($resource) {
    return $resource('api/adminnotifications/:adminnotificationId', {
      adminnotificationId: '@_id'
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
