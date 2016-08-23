(function () {
  'use strict';

  angular
    .module('adsets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adsets', {
        abstract: true,
        url: '/adsets',
        template: '<ui-view/>'
      })
      .state('adsets.list', {
        url: '',
        templateUrl: 'modules/adsets/client/views/list-adsets.client.view.html',
        controller: 'AdsetsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adsets List'
        }
      })
      .state('adsets.create', {
        url: '/create',
        templateUrl: 'modules/adsets/client/views/form-adset.client.view.html',
        controller: 'AdsetsController',
        controllerAs: 'vm',
        resolve: {
          adsetResolve: newAdset,
         // TODO see in services: paramsResolve:getParams,
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Adsets Create'
        }
      })
      .state('adsets.edit', {
        url: '/:adsetId/edit',
        templateUrl: 'modules/adsets/client/views/form-adset.client.view.html',
        controller: 'AdsetsController',
        controllerAs: 'vm',
        resolve: {
          adsetResolve: getAdset
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adset {{ adsetResolve.name }}'
        }
      })
      .state('adsets.view', {
        url: '/:adsetId',
        templateUrl: 'modules/adsets/client/views/view-adset.client.view.html',
        controller: 'AdsetsController',
        controllerAs: 'vm',
        resolve: {
          adsetResolve: getAdset
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Adset {{ articleResolve.name }}'
        }
      });
  }

  getAdset.$inject = ['$stateParams', 'AdsetsService'];

  function getAdset($stateParams, AdsetsService) {
    return AdsetsService.get({
      adsetId: $stateParams.adsetId
    }).$promise;
  }

 

  newAdset.$inject = ['AdsetsService'];

  function newAdset(AdsetsService) {
    return new AdsetsService();
  }
})();
