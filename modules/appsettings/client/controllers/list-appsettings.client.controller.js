(function () {
  'use strict';

  angular
    .module('appsettings')
    .controller('AppsettingsListController', AppsettingsListController);

  AppsettingsListController.$inject = ['AppsettingsService', '$http'];

  function AppsettingsListController(AppsettingsService, $http) {

    var vm = this;

    vm.appsettings = AppsettingsService.query();

    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'name',
      'sortOrder': 'dsc'

    };

    vm.filterBy = {
      'name': '',
      'value': ''
    };

    vm.getResource = function (params, paramsObj) {

      var sortVal = '';
      if (paramsObj.sortOrder === 'dsc') {
        sortVal = '-' + paramsObj.sortBy;

      } else if(paramsObj.sortOrder === 'asc') {
        sortVal = paramsObj.sortBy;
      }
      paramsObj.sort=sortVal;
      var urlApi = '/api/appsettings/';
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

  }
})();
