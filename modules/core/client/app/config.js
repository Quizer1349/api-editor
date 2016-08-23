'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'angucomplete-alt', 'ngLodash', 'ngTasty', 'ngSanitize', 'ui.select'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
    angular.module(applicationModuleName).constant('Alerts', {
      periods: [{ value:'5', name:'5 Minutes' }, { value:'15', name:'15 Minutes' },{ value:'60', name:'1 hour' },{ value:'120', name:'2 hour' }, { value:'360', name:'6 hour' }, { value:'720', name:'12 hour' }, { value:'1440', name:'24 hour' }]
    });

    angular.module(applicationModuleName).filter('propsFilter', function() {
      return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
          var keys = Object.keys(props);
          items.forEach(function(item) {
            var itemMatches = false;

            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }

            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    });

  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
