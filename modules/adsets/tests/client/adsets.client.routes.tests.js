(function () {
  'use strict';

  describe('Adsets Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdsetsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdsetsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdsetsService = _AdsetsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adsets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adsets');
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
          AdsetsController,
          mockAdset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adsets.view');
          $templateCache.put('modules/adsets/client/views/view-adset.client.view.html', '');

          // create mock Adset
          mockAdset = new AdsetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adset Name'
          });

          //Initialize Controller
          AdsetsController = $controller('AdsetsController as vm', {
            $scope: $scope,
            adsetResolve: mockAdset
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adsetId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adsetId: 1
          })).toEqual('/adsets/1');
        }));

        it('should attach an Adset to the controller scope', function () {
          expect($scope.vm.adset._id).toBe(mockAdset._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adsets/client/views/view-adset.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdsetsController,
          mockAdset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adsets.create');
          $templateCache.put('modules/adsets/client/views/form-adset.client.view.html', '');

          // create mock Adset
          mockAdset = new AdsetsService();

          //Initialize Controller
          AdsetsController = $controller('AdsetsController as vm', {
            $scope: $scope,
            adsetResolve: mockAdset
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adsets/create');
        }));

        it('should attach an Adset to the controller scope', function () {
          expect($scope.vm.adset._id).toBe(mockAdset._id);
          expect($scope.vm.adset._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adsets/client/views/form-adset.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdsetsController,
          mockAdset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adsets.edit');
          $templateCache.put('modules/adsets/client/views/form-adset.client.view.html', '');

          // create mock Adset
          mockAdset = new AdsetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adset Name'
          });

          //Initialize Controller
          AdsetsController = $controller('AdsetsController as vm', {
            $scope: $scope,
            adsetResolve: mockAdset
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adsetId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adsetId: 1
          })).toEqual('/adsets/1/edit');
        }));

        it('should attach an Adset to the controller scope', function () {
          expect($scope.vm.adset._id).toBe(mockAdset._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adsets/client/views/form-adset.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
