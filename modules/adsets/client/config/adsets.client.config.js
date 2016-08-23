(function () {
  'use strict';

  angular
    .module('adsets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Adsets',
      state: 'adsets',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'adsets', {
      title: 'List Adsets',
      state: 'adsets.list'
    });
    // Add the dropdown create item
/*    Menus.addSubMenuItem('topbar', 'adsets', {
      title: 'Create Adset',
      state: 'adsets.create',
      roles: ['*']
    });
    */
  }

})();
