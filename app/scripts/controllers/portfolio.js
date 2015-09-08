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
                    function   ( $scope,   orgs,            budget,   taxn,             Pie,               Donut,                    colorpicker ) {

    window.$scope = $scope; //debug
    
    $scope.budget = budget;

    $scope.orgs = orgs;
    console.log('orgs in top of PortfolioCtrl, after saving to $scope: ', orgs, 'orgs.length: ', orgs.length); // []; 0; (but in the dropdown, shows it with lots of orgs.);

    $scope.taxn = taxn;
    taxn.taxTree.$bindTo($scope, 'taxTree', true ); // why do I have taxonomies within taxTree again?

    $scope.colorPickerOptions = colorpicker.options;
    
    orgs.scopeDigest = $scope.$digest;
    

    // things that are troublesome when orgs hasn't $loaded yet.
    orgs.reapplyBudget(); // THIS may cause trouble.
    var colorpicker = new Colorpicker(orgs.saveOrgs); // THIS may cause trouble.
    $scope.pie = new Pie(orgs, orgs.selectOrg); // THIS may cause trouble.


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

  }]);