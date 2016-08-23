(function () {
  'use strict';

  // Appsettings controller
  angular
    .module('appsettings')
    .controller('AppsettingsController', AppsettingsController);

  AppsettingsController.$inject = ['$scope', '$state', 'Authentication', 'appsettingResolve'];

  function AppsettingsController ($scope, $state, Authentication, appsetting) {
    var vm = this;

    vm.authentication = Authentication;
    vm.appsetting = appsetting;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Appsetting
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.appsetting.$remove($state.go('appsettings.list'));
      }
    }

    // Save Appsetting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.appsettingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.appsetting._id) {
        vm.appsetting.$update(successCallback, errorCallback);
      } else {
        vm.appsetting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('appsettings.view', {
          appsettingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
