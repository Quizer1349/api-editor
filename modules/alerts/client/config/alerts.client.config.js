(function () {
  'use strict';

  angular
    .module('alerts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Alerts',
      state: 'alerts',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'alerts', {
      title: 'List Alerts',
      state: 'alerts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'alerts', {
      title: 'Create Alert',
      state: 'alerts.create',
      roles: ['user', 'admin']
    });
  }
})();
