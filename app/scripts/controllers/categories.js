'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:CategoriesCtrl
 * @description
 * # CategoriesCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('CategoriesCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
