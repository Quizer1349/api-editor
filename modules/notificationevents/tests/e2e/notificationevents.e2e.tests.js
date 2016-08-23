'use strict';

describe('Notificationevents E2E Tests:', function () {
  describe('Test Notificationevents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/notificationevents');
      expect(element.all(by.repeater('notificationevent in notificationevents')).count()).toEqual(0);
    });
  });
});
