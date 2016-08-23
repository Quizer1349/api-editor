(function () {
  'use strict';

  // Adminnotifications controller
  angular
    .module('adminnotifications')
    .controller('AdminnotificationsController', AdminnotificationsController);

  AdminnotificationsController.$inject = ['$scope', '$state', 'Authentication', 'adminnotificationResolve'];

  function AdminnotificationsController ($scope, $state, Authentication, adminnotification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adminnotification = adminnotification;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adminnotification
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.adminnotification.$remove($state.go('admin.adminnotifications.list'));
      }
    }

    // Save Adminnotification
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adminnotificationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adminnotification._id) {
        vm.adminnotification.$update(successCallback, errorCallback);
      } else {
        vm.adminnotification.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.adminnotifications.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
