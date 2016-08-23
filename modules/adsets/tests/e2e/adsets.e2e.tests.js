'use strict';

describe('Adsets E2E Tests:', function () {
  describe('Test Adsets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adsets');
      expect(element.all(by.repeater('adset in adsets')).count()).toEqual(0);
    });
  });
});
