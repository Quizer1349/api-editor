(function () {
  'use strict';

  // Notificationevents controller
  angular
    .module('notificationevents')
    .controller('NotificationeventsController', NotificationeventsController);

  NotificationeventsController.$inject = ['$scope', '$state', 'Authentication', 'notificationeventResolve'];

  function NotificationeventsController ($scope, $state, Authentication, notificationevent) {
    var vm = this;

    vm.authentication = Authentication;
    vm.notificationevent = notificationevent;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Notificationevent
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.notificationevent.$remove($state.go('notificationevents.list'));
      }
    }

    // Save Notificationevent
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.notificationeventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.notificationevent._id) {
        vm.notificationevent.$update(successCallback, errorCallback);
      } else {
        vm.notificationevent.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('notificationevents.view', {
          notificationeventId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
