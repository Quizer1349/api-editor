//Messages service used to communicate Messages REST endpoints
(function () {
  'use strict';

  angular
    .module('messages')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource'];

  function MessagesService($resource) {
    return $resource('api/messages/:messageId', {
      messageId: '@_id'
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
