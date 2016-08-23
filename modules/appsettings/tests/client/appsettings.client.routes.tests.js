(function () {
  'use strict';

  describe('Appsettings Route Tests', function () {
    // Initialize global variables
    var $scope,
      AppsettingsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AppsettingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AppsettingsService = _AppsettingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('appsettings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/appsettings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AppsettingsController,
          mockAppsetting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('appsettings.view');
          $templateCache.put('modules/appsettings/client/views/view-appsetting.client.view.html', '');

          // create mock Appsetting
          mockAppsetting = new AppsettingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Appsetting Name'
          });

          //Initialize Controller
          AppsettingsController = $controller('AppsettingsController as vm', {
            $scope: $scope,
            appsettingResolve: mockAppsetting
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:appsettingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.appsettingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            appsettingId: 1
          })).toEqual('/appsettings/1');
        }));

        it('should attach an Appsetting to the controller scope', function () {
          expect($scope.vm.appsetting._id).toBe(mockAppsetting._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/appsettings/client/views/view-appsetting.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AppsettingsController,
          mockAppsetting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('appsettings.create');
          $templateCache.put('modules/appsettings/client/views/form-appsetting.client.view.html', '');

          // create mock Appsetting
          mockAppsetting = new AppsettingsService();

          //Initialize Controller
          AppsettingsController = $controller('AppsettingsController as vm', {
            $scope: $scope,
            appsettingResolve: mockAppsetting
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.appsettingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/appsettings/create');
        }));

        it('should attach an Appsetting to the controller scope', function () {
          expect($scope.vm.appsetting._id).toBe(mockAppsetting._id);
          expect($scope.vm.appsetting._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/appsettings/client/views/form-appsetting.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AppsettingsController,
          mockAppsetting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('appsettings.edit');
          $templateCache.put('modules/appsettings/client/views/form-appsetting.client.view.html', '');

          // create mock Appsetting
          mockAppsetting = new AppsettingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Appsetting Name'
          });

          //Initialize Controller
          AppsettingsController = $controller('AppsettingsController as vm', {
            $scope: $scope,
            appsettingResolve: mockAppsetting
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:appsettingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.appsettingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            appsettingId: 1
          })).toEqual('/appsettings/1/edit');
        }));

        it('should attach an Appsetting to the controller scope', function () {
          expect($scope.vm.appsetting._id).toBe(mockAppsetting._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/appsettings/client/views/form-appsetting.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
