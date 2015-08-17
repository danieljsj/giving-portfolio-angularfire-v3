'use strict';

describe('Service: recipientOrgs', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var recipientOrgs;
  beforeEach(inject(function (_recipientOrgs_) {
    recipientOrgs = _recipientOrgs_;
  }));

  it('should do something', function () {
    expect(!!recipientOrgs).toBe(true);
  });

});
