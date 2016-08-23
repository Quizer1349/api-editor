(function () {
  'use strict';

  describe('Trackingparams List Controller Tests', function () {
    // Initialize global variables
    var TrackingparamsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TrackingparamsService,
      mockTrackingparam;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TrackingparamsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TrackingparamsService = _TrackingparamsService_;

      // create mock article
      mockTrackingparam = new TrackingparamsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Trackingparam Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Trackingparams List controller.
      TrackingparamsListController = $controller('TrackingparamsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTrackingparamList;

      beforeEach(function () {
        mockTrackingparamList = { rows: [mockTrackingparam, mockTrackingparam]};
      });

      it('should send a GET request and return all Trackingparams', inject(function (TrackingparamsService) {
        // Set POST response
        $httpBackend.expectGET('api/trackingparams').respond(angular.toJson(mockTrackingparamList));


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.trackingparams.length).toEqual(2);
        expect($scope.vm.trackingparams[0]).toEqual(mockTrackingparam);
        expect($scope.vm.trackingparams[1]).toEqual(mockTrackingparam);

      }));
    });
  });
})();
