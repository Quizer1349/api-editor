(function () {
  'use strict';

  angular
    .module('trackingparams')
    .controller('TrackingparamsListController', TrackingparamsListController);

  TrackingparamsListController.$inject = ['TrackingparamsService', '$state', '$http'];

  function TrackingparamsListController(TrackingparamsService, $state, $http) {
    var vm = this;

    vm.trackingparams = TrackingparamsService.query();

    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'name',
      'sortOrder': 'asc'

    };

    vm.filterBy = {
      'name': '',
      'value': '',
      'description': '',

    };

    vm.notSortBy = [
      'action'
    ];

    vm.getResource = function (params, paramsObj) {
      var sortVal = '';
      if (paramsObj.sortOrder === 'dsc') {
        sortVal = '-' + paramsObj.sortBy;

      } else if(paramsObj.sortOrder === 'asc') {
        sortVal = paramsObj.sortBy;
      }
      paramsObj.sort=sortVal;
      var urlApi = '/api/trackingparams/';
      return $http.get(urlApi, { params:paramsObj }).then(function (response) {
        // vm.adaccounts = response.data.rows;
        return {
          'rows': response.data.rows,
          'header': response.data.header,
          'pagination': response.data.pagination,
          'sortBy': response.data['sort-by'],
          'sortOrder': response.data['sort-order']
        };
      });
    };

    vm.remove = function remove(index) {
      if(typeof vm.trackingparams[index] !== 'undefined') {
        vm.param = vm.trackingparams[index];
        if (confirm('Are you sure you want to delete?')) {
          vm.param.$remove($state.go($state.current, {}, { reload: true }));
        }
      }else {
        confirm('Current index doesn\'t exist');
      }
    };
  }
})();
