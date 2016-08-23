(function () {
  'use strict';

  describe('Notificationevents Route Tests', function () {
    // Initialize global variables
    var $scope,
      NotificationeventsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NotificationeventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NotificationeventsService = _NotificationeventsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('notificationevents');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/notificationevents');
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
          NotificationeventsController,
          mockNotificationevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('notificationevents.view');
          $templateCache.put('modules/notificationevents/client/views/view-notificationevent.client.view.html', '');

          // create mock Notificationevent
          mockNotificationevent = new NotificationeventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Notificationevent Name'
          });

          //Initialize Controller
          NotificationeventsController = $controller('NotificationeventsController as vm', {
            $scope: $scope,
            notificationeventResolve: mockNotificationevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:notificationeventId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.notificationeventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            notificationeventId: 1
          })).toEqual('/notificationevents/1');
        }));

        it('should attach an Notificationevent to the controller scope', function () {
          expect($scope.vm.notificationevent._id).toBe(mockNotificationevent._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/notificationevents/client/views/view-notificationevent.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NotificationeventsController,
          mockNotificationevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('notificationevents.create');
          $templateCache.put('modules/notificationevents/client/views/form-notificationevent.client.view.html', '');

          // create mock Notificationevent
          mockNotificationevent = new NotificationeventsService();

          //Initialize Controller
          NotificationeventsController = $controller('NotificationeventsController as vm', {
            $scope: $scope,
            notificationeventResolve: mockNotificationevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.notificationeventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/notificationevents/create');
        }));

        it('should attach an Notificationevent to the controller scope', function () {
          expect($scope.vm.notificationevent._id).toBe(mockNotificationevent._id);
          expect($scope.vm.notificationevent._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/notificationevents/client/views/form-notificationevent.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NotificationeventsController,
          mockNotificationevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('notificationevents.edit');
          $templateCache.put('modules/notificationevents/client/views/form-notificationevent.client.view.html', '');

          // create mock Notificationevent
          mockNotificationevent = new NotificationeventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Notificationevent Name'
          });

          //Initialize Controller
          NotificationeventsController = $controller('NotificationeventsController as vm', {
            $scope: $scope,
            notificationeventResolve: mockNotificationevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:notificationeventId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.notificationeventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            notificationeventId: 1
          })).toEqual('/notificationevents/1/edit');
        }));

        it('should attach an Notificationevent to the controller scope', function () {
          expect($scope.vm.notificationevent._id).toBe(mockNotificationevent._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/notificationevents/client/views/form-notificationevent.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
