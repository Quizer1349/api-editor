(function () {
  'use strict';

  angular
    .module('alerts')
    .controller('AlertsListController', AlertsListController);

  AlertsListController.$inject = ['AlertsService','$state', 'AlertStatusService', 'lodash', '$http', 'Alerts'];

  function AlertsListController(AlertsService, $state, AlertStatusService, lodash, $http, Alerts) {
    var vm = this;
    vm.alerts = AlertsService.query();
    vm.alertStatus = AlertStatusService.getStatusList();
    vm.remove = remove;

    vm.alertPeriods = Alerts.periods;

    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'name',
      'sortOrder': 'dsc'

    };

    vm.filterBy = {
      'name': '',
      'typeId':'',
      'adset_id': '',
      'paramLabel': '',
      'rule': '',
      'value': '',
      'period': '',
      'status': ''

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
      var urlApi = '/api/alerts/';
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

    function remove(alert_id) {
      vm.alerts.forEach(function (alert) {
        if(alert._id === alert_id) {
          vm.alert = alert;
          if (confirm('Are you sure you want to delete?')) {
            vm.alert.$remove($state.go($state.current, {}, { reload: true }));
          }
        }
      });
    }
  }
})();
