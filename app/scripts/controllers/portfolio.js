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
                    function   ( $scope,   orgs,            budget,   taxn,             Pie,               Donut,                    Colorpicker ) {

    window.$scope = $scope; //debug
    
    $scope.budget = budget;

    $scope.orgs = orgs;
    console.log('orgs in top of PortfolioCtrl, after saving to $scope: ', orgs, 'orgs.length: ', orgs.length); // []; 0; (but in the dropdown, shows it with lots of orgs.);

    $scope.taxn = taxn;
    taxn.taxTree.$bindTo($scope, 'taxTree', true ); // why do I have taxonomies within taxTree again?

    
    orgs.scopeDigest = $scope.$digest;
    
    function runFuncsThatNeedToWaitTillFbStuffIsLoaded(){
      orgs.reapplyBudget();
      $scope.pie = new Pie(orgs, orgs.selectOrg);

      var colorpicker = new Colorpicker(orgs.saveOrgs); // we might be able to pull this out into the top; might be able to add the funcs before the stuff loads in, cuz I don't think it's a promise, I think it's a real object.
      $scope.colorPickerOptions = colorpicker.options;
    }
    setTimeout(runFuncsThatNeedToWaitTillFbStuffIsLoaded,1000);



    // arrow keys to shift selection
    $scope.foci = {};
    function arrowKeysShiftSelection(e){
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