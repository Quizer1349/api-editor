(function () {
  'use strict';

  describe('Trackingparams Route Tests', function () {
    // Initialize global variables
    var $scope,
      TrackingparamsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TrackingparamsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TrackingparamsService = _TrackingparamsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('trackingparams');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/trackingparams');
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
          TrackingparamsController,
          mockTrackingparam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('trackingparams.view');
          $templateCache.put('modules/trackingparams/client/views/view-trackingparam.client.view.html', '');

          // create mock Trackingparam
          mockTrackingparam = new TrackingparamsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trackingparam Name'
          });

          //Initialize Controller
          TrackingparamsController = $controller('TrackingparamsController as vm', {
            $scope: $scope,
            trackingparamResolve: mockTrackingparam
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:trackingparamId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.trackingparamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            trackingparamId: 1
          })).toEqual('/trackingparams/1');
        }));

        it('should attach an Trackingparam to the controller scope', function () {
          expect($scope.vm.trackingparam._id).toBe(mockTrackingparam._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/trackingparams/client/views/view-trackingparam.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TrackingparamsController,
          mockTrackingparam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('trackingparams.create');
          $templateCache.put('modules/trackingparams/client/views/form-trackingparam.client.view.html', '');

          // create mock Trackingparam
          mockTrackingparam = new TrackingparamsService();

          //Initialize Controller
          TrackingparamsController = $controller('TrackingparamsController as vm', {
            $scope: $scope,
            trackingparamResolve: mockTrackingparam
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.trackingparamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/trackingparams/create');
        }));

        it('should attach an Trackingparam to the controller scope', function () {
          expect($scope.vm.trackingparam._id).toBe(mockTrackingparam._id);
          expect($scope.vm.trackingparam._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/trackingparams/client/views/form-trackingparam.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TrackingparamsController,
          mockTrackingparam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('trackingparams.edit');
          $templateCache.put('modules/trackingparams/client/views/form-trackingparam.client.view.html', '');

          // create mock Trackingparam
          mockTrackingparam = new TrackingparamsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trackingparam Name'
          });

          //Initialize Controller
          TrackingparamsController = $controller('TrackingparamsController as vm', {
            $scope: $scope,
            trackingparamResolve: mockTrackingparam
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:trackingparamId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.trackingparamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            trackingparamId: 1
          })).toEqual('/trackingparams/1/edit');
        }));

        it('should attach an Trackingparam to the controller scope', function () {
          expect($scope.vm.trackingparam._id).toBe(mockTrackingparam._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/trackingparams/client/views/form-trackingparam.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
