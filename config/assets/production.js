'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/components-font-awesome/css/font-awesome.min.css',
        'public/lib/angular-ui-select/dist/select.min.css',
        'public/css/ui-select/select2.css',
        'public/css/ui-select/selectize.default.css',
        'public/lib/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angucomplete-alt/angucomplete-alt.js',
        'public/lib/ng-lodash/build/ng-lodash.min.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/ng-tasty/ng-tasty-tpls.min.js',
        'public/lib/angular-ui-select/dist/select.min.js'

      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
