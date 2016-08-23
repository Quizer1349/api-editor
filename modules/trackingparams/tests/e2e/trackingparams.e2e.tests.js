'use strict';

describe('Trackingparams E2E Tests:', function () {
  describe('Test Trackingparams page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trackingparams');
      expect(element.all(by.repeater('trackingparam in trackingparams')).count()).toEqual(0);
    });
  });
});
