(function () {
  'use strict';

  angular
    .module('adminnotifications')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    //Menus.addMenuItem('topbar', {
    //  title: 'Bulk Messages',
    //  state: 'adminnotifications',
    //  type: 'dropdown',
    //  roles: ['admin'],
    //  position: 9
    //});
    //
    //// Add the dropdown list item
    //Menus.addSubMenuItem('topbar', 'adminnotifications', {
    //  title: 'List Bulk Messages',
    //  state: 'adminnotifications.list'
    //});
    //
    //// Add the dropdown create item
    //Menus.addSubMenuItem('topbar', 'adminnotifications', {
    //  title: 'Create Bulk Messages',
    //  state: 'adminnotifications.create',
    //  roles: ['admin']
    //});
  }
})();
