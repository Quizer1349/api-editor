(function () {
  'use strict';

  angular
    .module('appsettings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('appsettings', {
        abstract: true,
        url: '/appsettings',
        template: '<ui-view/>'
      })
      .state('appsettings.list', {
        url: '',
        templateUrl: 'modules/appsettings/client/views/list-appsettings.client.view.html',
        controller: 'AppsettingsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: 'Appsettings List'
        }
      })
      .state('appsettings.create', {
        url: '/create',
        templateUrl: 'modules/appsettings/client/views/form-appsetting.client.view.html',
        controller: 'AppsettingsController',
        controllerAs: 'vm',
        resolve: {
          appsettingResolve: newAppsetting
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Appsettings Create'
        }
      })
      .state('appsettings.edit', {
        url: '/:appsettingId/edit',
        templateUrl: 'modules/appsettings/client/views/form-appsetting.client.view.html',
        controller: 'AppsettingsController',
        controllerAs: 'vm',
        resolve: {
          appsettingResolve: getAppsetting
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Appsetting {{ appsettingResolve.name }}'
        }
      })
      .state('appsettings.view', {
        url: '/:appsettingId',
        templateUrl: 'modules/appsettings/client/views/view-appsetting.client.view.html',
        controller: 'AppsettingsController',
        controllerAs: 'vm',
        resolve: {
          appsettingResolve: getAppsetting
        },
        data:{
          roles: ['admin'],
          pageTitle: 'Appsetting {{ articleResolve.name }}'
        }
      });
  }

  getAppsetting.$inject = ['$stateParams', 'AppsettingsService'];

  function getAppsetting($stateParams, AppsettingsService) {
    return AppsettingsService.get({
      appsettingId: $stateParams.appsettingId
    }).$promise;
  }

  newAppsetting.$inject = ['AppsettingsService'];

  function newAppsetting(AppsettingsService) {
    return new AppsettingsService();
  }
})();
