(function () {
  'use strict';

  angular
    .module('messages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Notifications',
      state: 'messages',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'messages', {
      title: 'List Notifications',
      state: 'messages.list'
    });

    // Add the dropdown create item
/*    Menus.addSubMenuItem('topbar', 'messages', {
      title: 'Create Message',
      state: 'messages.create',
      roles: ['user']
    }); */
  }

})();
