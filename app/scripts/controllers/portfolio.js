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
                    function   ( $scope,   orgs,            budget,   taxn,             Pie,               DonutPie,                    Colorpicker ) {

    window.$scope = $scope; // for debugging
    
    $scope.budget = budget;

    $scope.orgs = orgs;
                                                                                                                 console.log('orgs in top of PortfolioCtrl, after saving to $scope: ', orgs, 'orgs.length: ', orgs.length); // []; 0; (but in the dropdown, shows it with lots of orgs.);
    $scope.taxn = taxn;
    taxn.taxTree.$bindTo($scope, 'taxTree', true );

    orgs.scopeDigest = $scope.$digest;

    var colorpicker = new Colorpicker(orgs.saveOrgs); // we might be able to pull this out into the top; might be able to add the funcs before the stuff loads in, cuz I don't think it's a promise, I think it's a real object.
    $scope.colorPickerOptions = colorpicker.options;


    var funcsRan = maybeRunFuncs();
    if ( !funcsRan ) {
      orgs          .$loaded().then(function(result){  orgs   .loaded = true; maybeRunFuncs();  });
      budget.fbObj  .$loaded().then(function(result){  budget .loaded = true; maybeRunFuncs();  });
      taxn.taxTree  .$loaded().then(function(result){  taxn   .loaded = true; maybeRunFuncs();  });
    }
    function maybeRunFuncs(){
      if (orgs.loaded && budget.loaded && taxn.loaded) {
        runFuncsThatNeedToWaitTillFbStuffIsLoaded();
        return true;
      }
    }

    function runFuncsThatNeedToWaitTillFbStuffIsLoaded(){ 
      orgs.reapplyBudget();
      $scope.pie = new Pie(orgs, orgs.selectOrg);
      $scope.donutPie = new DonutPie(); // might need to inject some stuff

      $scope.orgs.pushOrgStateActions.push(
        $scope.donutPie.updateData.bind($scope.donutPie)  // why the poo am I having to bind this to itself to be a 'this' !?
      );
    }









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