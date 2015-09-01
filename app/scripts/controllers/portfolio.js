'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:PortfolioCtrl
 * @description
 * # PortfolioCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('PortfolioCtrl', ['$scope', 'recipientOrgs', 'budget', 'taxonomization', 'GivingChartFlat', 'GivingChartCategorized', 'Colorpicker',
                    function   ( $scope ,  recipientOrgs ,  budget ,  taxn,             Pie,               Donut,                    Colorpicker ) {

    window.$scope = $scope; //debug
    
    $scope.budget = budget;

    $scope.orgs = [];

    $scope.taxn = taxn;
    taxn.taxTree.$bindTo($scope, 'taxTree', true ); // why do I have taxonomies within taxTree again?

    console.log(recipientOrgs);
    recipientOrgs.getOrgs(function(orgs){

      orgs.reapplyBudget();

      $scope.orgs = orgs;
      
      var colorpicker = new Colorpicker(orgs.saveOrgs);

      $scope.colorPickerOptions = colorpicker.options; // $scope.palette = $scope.colorPickerOptions.palette; // redundant

   		orgs.scopeDigest = $scope.$digest;

   		console.log('orgs inside getOrgs, after saving to $scope: ', orgs);
		  
      $scope.pie = new Pie(orgs, orgs.selectOrg);

      if (0 < orgs.length) orgs.selectNext();


      // arrow keys to shift selection
      $scope.foci = {};
      var arrowKeysShiftSelection = function(e){
        var focus = false;
        for ( var key in $scope.foci ) { // 'delete' keyword (e.g. `delete foci.monthly`) doesn't work in angular parser, so we've got and ob full of all or mostly falses, need to see if any are true.
          if ( $scope.foci[key] ) {
            focus = true;
            break;  
          }
        }
        if (!focus){
          if(e.keyCode === 39) {
            console.log('right arrow');
            orgs.selectNext();
          }    
          if(e.keyCode === 37) {
            console.log('left arrow');
            orgs.selectPrev();
          }
        }
      };
      var $doc = angular.element(document);
      $doc.on('keydown', arrowKeysShiftSelection);
      $scope.$on('$destroy',function(){
        $doc.off('keydown', arrowKeysShiftSelection);
      })


   	});

  }]);