(function () {
  'use strict';

  angular
    .module('notificationevents')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Events',
      state: 'notificationevents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'notificationevents', {
      title: 'List Events',
      state: 'notificationevents.list'
    });

  
  }
})();
