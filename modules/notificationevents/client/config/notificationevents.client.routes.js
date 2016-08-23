(function () {
  'use strict';

  angular
    .module('notificationevents')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('notificationevents', {
        abstract: true,
        url: '/notificationevents',
        template: '<ui-view/>'
      })
      .state('notificationevents.list', {
        url: '',
        templateUrl: 'modules/notificationevents/client/views/list-notificationevents.client.view.html',
        controller: 'NotificationeventsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Notificationevents List'
        }
      })
      .state('notificationevents.create', {
        url: '/create',
        templateUrl: 'modules/notificationevents/client/views/form-notificationevent.client.view.html',
        controller: 'NotificationeventsController',
        controllerAs: 'vm',
        resolve: {
          notificationeventResolve: newNotificationevent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Notificationevents Create'
        }
      })
      .state('notificationevents.edit', {
        url: '/:notificationeventId/edit',
        templateUrl: 'modules/notificationevents/client/views/form-notificationevent.client.view.html',
        controller: 'NotificationeventsController',
        controllerAs: 'vm',
        resolve: {
          notificationeventResolve: getNotificationevent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Notificationevent {{ notificationeventResolve.name }}'
        }
      })
      .state('notificationevents.view', {
        url: '/:notificationeventId',
        templateUrl: 'modules/notificationevents/client/views/view-notificationevent.client.view.html',
        controller: 'NotificationeventsController',
        controllerAs: 'vm',
        resolve: {
          notificationeventResolve: getNotificationevent
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Notificationevent {{ articleResolve.name }}'
        }
      });
  }

  getNotificationevent.$inject = ['$stateParams', 'NotificationeventsService'];

  function getNotificationevent($stateParams, NotificationeventsService) {
    return NotificationeventsService.get({
      notificationeventId: $stateParams.notificationeventId
    }).$promise;
  }

  newNotificationevent.$inject = ['NotificationeventsService'];

  function newNotificationevent(NotificationeventsService) {
    return new NotificationeventsService();
  }
})();
