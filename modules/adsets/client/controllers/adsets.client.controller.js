(function () {
  'use strict';

  // Adsets controller
  angular
    .module('adsets')
    .controller('AdsetsController', AdsetsController);

  AdsetsController.$inject = ['$scope', '$state', 'Authentication', 'adsetResolve'];

  function AdsetsController ($scope, $state, Authentication, adset) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adset = adset;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adset
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.adset.$remove($state.go('adsets.list'));
      }
    }

    // Save Adset
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adsetForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adset._id) {
        vm.adset.$update(successCallback, errorCallback);
      } else {
        vm.adset.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adsets.view', {
          adsetId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
