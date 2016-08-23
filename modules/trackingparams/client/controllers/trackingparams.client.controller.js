(function () {
  'use strict';

  // Trackingparams controller
  angular
    .module('trackingparams')
    .controller('TrackingparamsController', TrackingparamsController);

  TrackingparamsController.$inject = ['$scope', '$state', 'Authentication', 'trackingparamResolve'];

  function TrackingparamsController ($scope, $state, Authentication, trackingparam) {
    var vm = this;

    vm.authentication = Authentication;
    vm.trackingparam = trackingparam;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Trackingparam
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.trackingparam.$remove($state.go('trackingparams.list'));
      }
    }

    // Save Trackingparam
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trackingparamForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.trackingparam._id) {
        vm.trackingparam.$update(successCallback, errorCallback);
      } else {
        vm.trackingparam.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trackingparams.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
