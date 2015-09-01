'use strict';

describe('Service: givingChartsCommon', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var givingChartsCommon;
  beforeEach(inject(function (_givingChartsCommon_) {
    givingChartsCommon = _givingChartsCommon_;
  }));

  it('should do something', function () {
    expect(!!givingChartsCommon).toBe(true);
  });

});
