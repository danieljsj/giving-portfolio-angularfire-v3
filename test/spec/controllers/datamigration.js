'use strict';

describe('Controller: DatamigrationCtrl', function () {

  // load the controller's module
  beforeEach(module('gpApp'));

  var DatamigrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DatamigrationCtrl = $controller('DatamigrationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
