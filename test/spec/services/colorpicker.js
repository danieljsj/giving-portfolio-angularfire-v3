'use strict';

describe('Service: colorpicker', function () {

  // load the service's module
  beforeEach(module('gpApp'));

  // instantiate service
  var colorpicker;
  beforeEach(inject(function (_colorpicker_) {
    colorpicker = _colorpicker_;
  }));

  it('should do something', function () {
    expect(!!colorpicker).toBe(true);
  });

});
