'use strict';

describe('Controller: GivingchartcategorizedCtrl', function () {

  // load the controller's module
  beforeEach(module('gpApp'));

  var GivingchartcategorizedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GivingchartcategorizedCtrl = $controller('GivingchartcategorizedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
