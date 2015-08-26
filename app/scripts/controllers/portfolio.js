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
    
    $scope.budget = budget;

    $scope.orgs = [];

    $scope.colorPickerOptions = {
        showPalette: true,
        palette: [
            ["#000000","#ffffff","#ff0000","#ffc0cb","#0000ff","#008080"],
            // ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
        ]
    };
    $scope.colorPickerOptions = {
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        palette: [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ]
    };
    // $scope.palette = $scope.colorPickerOptions.palette; // redundant

    $scope.isSelectedFilterObj = {
    	isSelected: true
    }

   	console.log(recipientOrgs);
   	recipientOrgs.getOrgs(function(orgs){

   		$scope.orgs = orgs;

   		orgs.scopeDigest = $scope.$digest;
   		for (var i = 0; i < orgs.length; i++) {
	   		// Object.defineProperty(orgs[i], "y", { get: function () { return this.portion; } }); // nope; using a getter
	   		orgs[i].y = orgs[i].portion; // getter didn't work, needs to be literal.
	   	};

   		console.log('orgs inside getOrgs, after saving to $scope: ', orgs);
		  $scope.pie = new Pie(orgs, orgs.selectOrg);

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
