'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:PortfolioCtrl
 * @description
 * # PortfolioCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('PortfolioCtrl', ['$scope', 'recipientOrgs', 'budget', 'GivingChartFlat', 'GivingChartCategorized',
   					function   ( $scope ,  recipientOrgs ,  budget ,  Pie,               Donut                  ) {
    
    $scope.org = [];

   	console.log(recipientOrgs);
   	recipientOrgs.getOrgs(function(orgs){

   		$scope.orgs = orgs;
   		console.log('orgs inside getOrgs, after saving to $scope: ', orgs);
		$scope.pie = new Pie($scope.orgs);
   	});



   	// old analog from budget shows we're basically waiting for firebase stuff to come in, and once it's in, we launch.

   		// one remaining question would be: do we allow recipientOrgs as a dependency for the giving charts, or will we inject it here? 
   			// I think it's better to inject it here, so we're not counting on behind-the-scenes singleton magic *within* a view/route.

	// var b = budget.fbObj
    // if( b.hasOwnProperty('currency') ) { init(); } else { b.$loaded(init); } // will need to set up some double-barrelled async for this, since I'll be waiting for both budget and recipientOrgs

    function init(){
      
      // b.$bindTo($scope, 'b'); 
      // $scope.budget = budget;
      
	      // not sure I'll need to bind this to scope; I may be able to just provide it to the portfolio service or something. 
	      // In fact, maybe budget will just be a dependency for the portfolio service.
	      // Also, making budget and orgs a dependency of recipientOrgs... no, probably not.
	      // I could make a portfolio service, with budget and recipientOrgs as dependencies. yes, that feels nice.


    }


    // $scope.~stuff = stuff~from~services


    // as the current portfolio.html will show, we'll want lots of things bound to the $scope. so it makes sense to me that portfolio will be a big (but still service-oriented/thin) controller, pulling in lots of services.

    // 	PortfolioCtrl
    // 		budget
    // 		recipientOrgs
    // 		GivingChartFlat
    // 		GivingChartCategorized // these will be newed up, with the orgs list, and possibly with some funcs from recipientOrgs, as args. what will get dicey is when orgs are moved between categories. I think we might just make new donutcharts to make it simple. new Donut(
    // 			Donut.hierarchicalize(recipientOrgs, ~taxonomy)
    // 		)

    // 

    // 	so the question would be: 
    // 		would I want the portfolio without the highchart?
    // 		would I want the highchart without the portfolio?

    // 		the highchart is a wrapper for the recipientOrgs... 
    // 		it will have settings for donut vs. flat, and the donut will need to show a category.
    // 			or more likely, it will be "categorize by", and "none"/null will be a value, if null, we switch




  }]);
