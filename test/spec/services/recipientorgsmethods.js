'use strict';

describe('Service: recipientOrgsMethods', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var recipientOrgsMethods;
  beforeEach(inject(function (_recipientOrgsMethods_) {
    recipientOrgsMethods = _recipientOrgsMethods_;
  }));

  it('should do something', function () {
    expect(!!recipientOrgsMethods).toBe(true);
  });

});
