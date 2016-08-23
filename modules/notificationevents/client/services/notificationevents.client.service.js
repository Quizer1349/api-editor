//Notificationevents service used to communicate Notificationevents REST endpoints
(function () {
  'use strict';

  angular
    .module('notificationevents')
    .factory('NotificationeventsService', NotificationeventsService);

  NotificationeventsService.$inject = ['$resource'];

  function NotificationeventsService($resource) {
    return $resource('api/notificationevents/:notificationeventId', {
      notificationeventId: '@_id'
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
