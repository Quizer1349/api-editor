'use strict';

describe('Appsettings E2E Tests:', function () {
  describe('Test Appsettings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/appsettings');
      expect(element.all(by.repeater('appsetting in appsettings')).count()).toEqual(0);
    });
  });
});
