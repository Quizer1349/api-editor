(function () {
  'use strict';

  angular
    .module('adminnotifications')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.adminnotifications', {
        abstract: true,
        url: '/adminnotifications',
        data: {
          roles: ['admin']
        },
        template: '<ui-view/>'
      })
      .state('admin.adminnotifications.list', {
        url: '',
        templateUrl: 'modules/adminnotifications/client/views/list-adminnotifications.client.view.html',
        controller: 'AdminnotificationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bulk Messages List'
        }
      })
      .state('admin.adminnotifications.create', {
        url: '/create',
        templateUrl: 'modules/adminnotifications/client/views/form-adminnotification.client.view.html',
        controller: 'AdminnotificationsController',
        controllerAs: 'vm',
        resolve: {
          adminnotificationResolve: newAdminnotification
        },
        data: {
          roles: ['admin'],
          pageTitle : 'New Bulk Message'
        }
      })
      .state('admin.adminnotifications.edit', {
        url: '/:adminnotificationId/edit',
        templateUrl: 'modules/adminnotifications/client/views/form-adminnotification.client.view.html',
        controller: 'AdminnotificationsController',
        controllerAs: 'vm',
        resolve: {
          adminnotificationResolve: getAdminnotification
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Bulk Message'
        }
      })
      .state('admin.adminnotifications.view', {
        url: '/:adminnotificationId',
        templateUrl: 'modules/adminnotifications/client/views/view-adminnotification.client.view.html',
        controller: 'AdminnotificationsController',
        controllerAs: 'vm',
        resolve: {
          adminnotificationResolve: getAdminnotification
        },
        data:{
          pageTitle: 'Adminnotification {{ articleResolve.name }}'
        }
      });
  }

  getAdminnotification.$inject = ['$stateParams', 'AdminnotificationsService'];

  function getAdminnotification($stateParams, AdminnotificationsService) {
    return AdminnotificationsService.get({
      adminnotificationId: $stateParams.adminnotificationId
    }).$promise;
  }

  newAdminnotification.$inject = ['AdminnotificationsService'];

  function newAdminnotification(AdminnotificationsService) {
    return new AdminnotificationsService();
  }
})();
