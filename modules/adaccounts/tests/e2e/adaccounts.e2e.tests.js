'use strict';

describe('Adaccounts E2E Tests:', function () {
  describe('Test Adaccounts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adaccounts');
      expect(element.all(by.repeater('adaccount in adaccounts')).count()).toEqual(0);
    });
  });
});
