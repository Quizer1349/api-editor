(function () {
  'use strict';

  angular
    .module('adaccounts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adaccounts', {
        abstract: true,
        url: '/adaccounts',
        template: '<ui-view/>'
      })
      .state('adaccounts.list', {
        url: '',
        templateUrl: 'modules/adaccounts/client/views/list-adaccounts.client.view.html',
        controller: 'AdaccountsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adaccounts List'
        }
      })
      .state('adaccounts.create', {
        url: '/create',
        templateUrl: 'modules/adaccounts/client/views/form-adaccount.client.view.html',
        controller: 'AdaccountsController',
        controllerAs: 'vm',
        resolve: {
          adaccountResolve: newAdaccount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Adaccounts Create'
        }
      })
      .state('adaccounts.edit', {
        url: '/:adaccountId/edit',
        templateUrl: 'modules/adaccounts/client/views/form-adaccount.client.view.html',
        controller: 'AdaccountsController',
        controllerAs: 'vm',
        resolve: {
          adaccountResolve: getAdaccount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adaccount {{ adaccountResolve.name }}'
        }
      })
      .state('adaccounts.view', {
        url: '/:adaccountId',
        templateUrl: 'modules/adaccounts/client/views/view-adaccount.client.view.html',
        controller: 'AdaccountsController',
        controllerAs: 'vm',
        resolve: {
          adaccountResolve: getAdaccount
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Adaccount {{ articleResolve.name }}'
        }
      });
  }

  getAdaccount.$inject = ['$stateParams', 'AdaccountsService'];

  function getAdaccount($stateParams, AdaccountsService) {
    return AdaccountsService.get({
      adaccountId: $stateParams.adaccountId
    }).$promise;
  }

  newAdaccount.$inject = ['AdaccountsService'];

  function newAdaccount(AdaccountsService) {
    return new AdaccountsService();
  }
})();
