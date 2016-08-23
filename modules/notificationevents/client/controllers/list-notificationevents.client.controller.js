(function () {
  'use strict';

  angular
    .module('notificationevents')
    .controller('NotificationeventsListController', NotificationeventsListController);

  NotificationeventsListController.$inject = ['NotificationeventsService', '$http', 'Alerts'];

  function NotificationeventsListController(NotificationeventsService, $http, Alerts) {
    var vm = this;
    vm.notificationevents = NotificationeventsService.query();
    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'created',
      'sortOrder': 'dsc'

    };


    vm.filterBy = {
      'adset_name': '',
      'adset': '',
      'alert_name':'',
      'period_name': '',
      'param': '',
      'value': '',
      'alert_rule': '',
      'alert_value': '',
      'created': ''
    };

    vm.notSortBy = [
      'adset_name',
      'alert_name',
      'period_name',
      'alert_rule',
      'alert_value'
    ];

    vm.getResource = function (params, paramsObj) {

      var sortVal = '';
      if (paramsObj.sortOrder === 'dsc') {
        sortVal = '-' + paramsObj.sortBy;

      } else if(paramsObj.sortOrder === 'asc') {
        sortVal = paramsObj.sortBy;
      }
      paramsObj.sort=sortVal;
      var urlApi = '/api/notificationevents/';
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

    vm.alertPeriods = Alerts.periods;

  }
})();
