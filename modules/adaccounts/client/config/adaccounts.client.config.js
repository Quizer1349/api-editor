(function () {
  'use strict';

  angular
    .module('adaccounts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Ad Accounts',
      state: 'adaccounts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'adaccounts', {
      title: 'List Ad accounts',
      state: 'adaccounts.list'
    });

    // Add the dropdown create item
/*   Menus.addSubMenuItem('topbar', 'adaccounts', {
      title: 'Create Account',
      state: 'adaccounts.create',
      roles: ['user']
    });
*/
  }

})();
