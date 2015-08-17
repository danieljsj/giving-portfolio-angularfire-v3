'use strict';

describe('Service: recipients', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var recipients;
  beforeEach(inject(function (_recipients_) {
    recipients = _recipients_;
  }));

  it('should do something', function () {
    expect(!!recipients).toBe(true);
  });

});
