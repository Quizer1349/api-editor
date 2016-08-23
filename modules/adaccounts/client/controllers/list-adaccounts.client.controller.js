(function () {
  'use strict';

  angular
    .module('adaccounts')
    .controller('AdaccountsListController', AdaccountsListController);

  AdaccountsListController.$inject = ['AdaccountsService', '$state', '$http'];

  function AdaccountsListController(AdaccountsService, $state, $http) {

    var vm = this;

    vm.adaccounts = AdaccountsService.query();
    vm.remove = remove;
    vm.status = [
      { 'status':1, 'label':'ACTIVE' },
      { 'status':2, 'label':' DISABLED' },
      { 'status':3, 'label':'UNSETTLED' },
      { 'status':7, 'label':'PENDING_RISK_REVIEW' },
      { 'status':9, 'label':'IN_GRACE_PERIOD' },
      { 'status':100, 'label':'PENDING_CLOSURE' },
      { 'status':101, 'label':'CLOSED' },
      { 'status':102, 'label':'PENDING_SETTLEMENT' },
      { 'status':201, 'label':'ANY_ACTIVE' },
      { 'status':202, 'label':'ANY_CLOSED' },
    ];
    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'account_id',
      'sortOrder': 'dsc'

    };

    vm.filterBy = {
      'account_id': '',
      'account_name': '',
      'status':'',
      'user': ''

    };

    vm.getResource = function (params, paramsObj) {
      var sortVal = '';
      if (paramsObj.sortOrder === 'dsc') {
        sortVal = '-' + paramsObj.sortBy;

      } else if(paramsObj.sortOrder === 'asc') {
        sortVal = paramsObj.sortBy;
      }
      paramsObj.sort=sortVal;
      var urlApi = '/api/adaccounts/';
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
    function remove(index) {
      if(typeof vm.adaccounts[index] !== 'undefined') {
        vm.adaccount = vm.adaccounts[index];
        if (confirm('Are you sure you want to delete?')) {
          vm.adaccount.$remove($state.go($state.current, {}, { reload: true }));
        }
      }else {
        confirm('Current index doesn\'t exist');
      }
    }
  }
})();
