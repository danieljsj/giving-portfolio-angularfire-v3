'use strict';

describe('Service: GivingChartFlat', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var GivingChartFlat;
  beforeEach(inject(function (_GivingChartFlat_) {
    GivingChartFlat = _GivingChartFlat_;
  }));

  it('should do something', function () {
    expect(!!GivingChartFlat).toBe(true);
  });

});
