(function () {
  'use strict';

  angular
    .module('adsets')
    .controller('AdsetsListController', AdsetsListController);

  AdsetsListController.$inject = ['AdsetsService', '$http'];

  function AdsetsListController(AdsetsService, $http) {
    var vm = this;

    vm.adsets = AdsetsService.query();

    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'camp_name',
      'sortOrder': 'dsc'

    };

    vm.filterBy = {
      'camp_name': '',
      'adset_name':'',
      'adset_id': '',
      'status': '',
      'reach': '',
      'daily_budget': '',
      'amount_spent': '',
      'schedule': '',
      'type': '',
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
      var urlApi = '/api/adsets/';
      return $http.get(urlApi, { params:paramsObj }).then(function (response) {

        return {
          'rows': response.data.rows,
          'header': response.data.header,
          'pagination': response.data.pagination,
          'sortBy': response.data['sort-by'],
          'sortOrder': response.data['sort-order']
        };
      });
    };
  }})();
