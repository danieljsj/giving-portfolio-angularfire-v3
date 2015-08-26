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

      $scope.$watch('b', function(newVal,oldVal){
      	// was thinking that I'd need to tell it to update orgs giving values when changes are made, but actually I think I can just make the portfolioCtrl do that upon loading the controller.
      })

    }


  }]);