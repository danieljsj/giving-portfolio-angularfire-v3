'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:BudgetCtrl
 * @description
 * # BudgetCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('BudgetCtrl', ['$scope', 'budget', function ($scope, budget) {
 

    var b = budget.fbObj

    if( b.hasOwnProperty('currency') ) { init(); } else { b.$loaded(init); }


    function init(){
      
      b.$bindTo($scope, 'b');

      $scope.budget = budget;

    }


  }]);