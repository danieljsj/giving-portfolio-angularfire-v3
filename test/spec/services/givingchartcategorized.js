'use strict';

describe('Service: GivingChartCategorized', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var GivingChartCategorized;
  beforeEach(inject(function (_GivingChartCategorized_) {
    GivingChartCategorized = _GivingChartCategorized_;
  }));

  it('should do something', function () {
    expect(!!GivingChartCategorized).toBe(true);
  });

});
