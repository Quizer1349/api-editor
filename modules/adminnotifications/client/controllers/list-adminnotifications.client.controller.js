(function () {
  'use strict';

  angular
    .module('adminnotifications')
    .controller('AdminnotificationsListController', AdminnotificationsListController);

  AdminnotificationsListController.$inject = ['AdminnotificationsService', '$http', '$state'];

  function AdminnotificationsListController(AdminnotificationsService, $http, $state) {
    var vm = this;

    // vm.adminnotifications = AdminnotificationsService.query();
    vm.sending = {};
    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'created',
      'sortOrder': 'dsc'

    };

    vm.filterBy = {
      'text': '',
      'status':'',
      'created': ''

    };

    vm.getResource = function (params, paramsObj) {
      var sortVal = '';
      if (paramsObj.sortOrder === 'dsc') {
        sortVal = '-' + paramsObj.sortBy;

      } else if(paramsObj.sortOrder === 'asc') {
        sortVal = paramsObj.sortBy;
      }
      paramsObj.sort=sortVal;
      var urlApi = '/api/adminnotifications/';
      return $http.get(urlApi, { params:paramsObj }).then(function (response) {
        // vm.adminnotifications = response.data.rows;
        return {
          'rows': response.data.rows,
          'header': response.data.header,
          'pagination': response.data.pagination,
          'sortBy': response.data['sort-by'],
          'sortOrder': response.data['sort-order']
        };
      });
    };
    vm.send = function(notification)
    {
      var promise = AdminnotificationsService.get({
        adminnotificationId: notification._id
      }).$promise;
      promise.then(function(notificationObj){
        notification.status = 'Sending...';

        var urlApi = '/api/adminnotifications/send/' + notification._id;
        $http.get(urlApi, {}).then(function (response) {
          notification.status = 'Sent';
          notificationObj.status = 'Sent';
          notificationObj.$update();
        }, function (response) {
          notification.status = 'Not Sent';
        });
      });

    };

    vm.remove = function (notification, index) {
      if (confirm('Are you sure you want to delete?')) {
        var promise = AdminnotificationsService.delete({
          adminnotificationId: notification._id
        }).$promise;

        promise.then(function(){
          $state.go($state.current, {}, { reload: true });
          // console.log(response);
        });
      }
    };
  }
})();
