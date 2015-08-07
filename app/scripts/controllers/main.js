'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
