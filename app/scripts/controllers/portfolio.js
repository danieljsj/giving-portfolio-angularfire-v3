'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:PortfolioCtrl
 * @description
 * # PortfolioCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('PortfolioCtrl', ['$scope', 'budget', 'recipients',
   					function 	($scope,   budget,   recipients) {
    
   // var b = budget.fbObj

    // if( b.hasOwnProperty('currency') ) { init(); } else { b.$loaded(init); } // will need to set up some double-barrelled async for this, since I'll be waiting for both budget and recipients

    recipients();


    function init(){
      
      // b.$bindTo($scope, 'b'); 
      // $scope.budget = budget;
      
	      // not sure I'll need to bind this to scope; I may be able to just provide it to the portfolio service or something. 
	      // In fact, maybe budget will just be a dependency for the portfolio service.
	      // Also, making budget and orgs a dependency of recipients... no, probably not.
	      // I could make a portfolio service, with budget and recipients as dependencies. yes, that feels nice.


    }

  }]);
