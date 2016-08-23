(function () {
  'use strict';

  angular
    .module('appsettings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Settings',
      state: 'appsettings',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'appsettings', {
      title: 'All Settings',
      state: 'appsettings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'appsettings', {
      title: 'Add New',
      state: 'appsettings.create',
      roles: ['admin']
    });
  }
})();
