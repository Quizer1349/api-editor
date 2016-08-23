(function () {
  'use strict';

  angular
    .module('alerts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('alerts', {
        abstract: true,
        url: '/alerts',
        template: '<ui-view/>'
      })
      .state('alerts.list', {
        url: '',
        templateUrl: 'modules/alerts/client/views/list-alerts.client.view.html',
        controller: 'AlertsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Alerts List'
        }
      })
      .state('alerts.create', {
        url: '/create',
        templateUrl: 'modules/alerts/client/views/form-alert.client.view.html',
        controller: 'AlertsController',
        controllerAs: 'vm',
        resolve: {
          alertResolve: newAlert
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Alerts Create'
        }
      })
      .state('alerts.edit', {
        url: '/:alertId/edit',
        templateUrl: 'modules/alerts/client/views/form-alert.client.view.html',
        controller: 'AlertsController',
        controllerAs: 'vm',
        resolve: {
          alertResolve: getAlert
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Alert {{ alertResolve.name }}'
        }
      })
      .state('alerts.view', {
        url: '/:alertId',
        templateUrl: 'modules/alerts/client/views/view-alert.client.view.html',
        controller: 'AlertsController',
        controllerAs: 'vm',
        resolve: {
          alertResolve: getAlert
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Alert {{ articleResolve.name }}'
        }
      });
  }

  getAlert.$inject = ['$stateParams', 'AlertsService'];

  function getAlert($stateParams, AlertsService) {
    return AlertsService.get({
      alertId: $stateParams.alertId
    }).$promise;
  }

  newAlert.$inject = ['AlertsService'];

  function newAlert(AlertsService) {
    return new AlertsService();
  }
})();
