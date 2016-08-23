(function () {
  'use strict';

  angular
    .module('trackingparams')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Ad Attributes',
      state: 'trackingparams',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'trackingparams', {
      title: 'Ad Attributes',
      state: 'trackingparams.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'trackingparams', {
      title: 'Add New Attribute',
      state: 'trackingparams.create',
      roles: ['user', 'admin']
    });
  }
})();
