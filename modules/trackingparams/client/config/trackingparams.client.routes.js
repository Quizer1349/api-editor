(function () {
  'use strict';

  angular
    .module('trackingparams')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trackingparams', {
        abstract: true,
        url: '/trackingparams',
        template: '<ui-view/>'
      })
      .state('trackingparams.list', {
        url: '',
        templateUrl: 'modules/trackingparams/client/views/list-trackingparams.client.view.html',
        controller: 'TrackingparamsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Trackingparams List'
        }
      })
      .state('trackingparams.create', {
        url: '/create',
        templateUrl: 'modules/trackingparams/client/views/form-trackingparam.client.view.html',
        controller: 'TrackingparamsController',
        controllerAs: 'vm',
        resolve: {
          trackingparamResolve: newTrackingparam
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Trackingparams Create'
        }
      })
      .state('trackingparams.edit', {
        url: '/:trackingparamId/edit',
        templateUrl: 'modules/trackingparams/client/views/form-trackingparam.client.view.html',
        controller: 'TrackingparamsController',
        controllerAs: 'vm',
        resolve: {
          trackingparamResolve: getTrackingparam
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Trackingparam {{ trackingparamResolve.name }}'
        }
      })
      .state('trackingparams.view', {
        url: '/:trackingparamId',
        templateUrl: 'modules/trackingparams/client/views/view-trackingparam.client.view.html',
        controller: 'TrackingparamsController',
        controllerAs: 'vm',
        resolve: {
          trackingparamResolve: getTrackingparam
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Trackingparam {{ articleResolve.name }}'
        }
      });
  }

  getTrackingparam.$inject = ['$stateParams', 'TrackingparamsService'];

  function getTrackingparam($stateParams, TrackingparamsService) {
    return TrackingparamsService.get({
      trackingparamId: $stateParams.trackingparamId
    }).$promise;
  }

  newTrackingparam.$inject = ['TrackingparamsService'];

  function newTrackingparam(TrackingparamsService) {
    return new TrackingparamsService();
  }
})();
