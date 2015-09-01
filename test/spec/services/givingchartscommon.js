'use strict';

describe('Service: givingchartscommon', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var givingchartscommon;
  beforeEach(inject(function (_givingchartscommon_) {
    givingchartscommon = _givingchartscommon_;
  }));

  it('should do something', function () {
    expect(!!givingchartscommon).toBe(true);
  });

});
