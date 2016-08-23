(function () {
  'use strict';

  // Adaccounts controller
  angular
    .module('adaccounts')
    .controller('AdaccountsController', AdaccountsController);

  AdaccountsController.$inject = ['$scope', '$state', 'Authentication', 'adaccountResolve'];

  function AdaccountsController ($scope, $state, Authentication, adaccount) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adaccount = adaccount;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adaccount
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.adaccount.$remove($state.go('adaccounts.list'));
      }
    }

    // Save Adaccount
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adaccountForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adaccount._id) {
        vm.adaccount.$update(successCallback, errorCallback);
      } else {
        vm.adaccount.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adaccounts.view', {
          adaccountId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
