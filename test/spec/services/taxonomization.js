'use strict';

describe('Service: taxonomization', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var taxonomization;
  beforeEach(inject(function (_taxonomization_) {
    taxonomization = _taxonomization_;
  }));

  it('should do something', function () {
    expect(!!taxonomization).toBe(true);
  });

});
