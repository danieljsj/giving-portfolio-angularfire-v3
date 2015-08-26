'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:PortfolioCtrl
 * @description
 * # PortfolioCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('PortfolioCtrl', ['$scope', 'recipientOrgs', 'budget', 'GivingChartFlat', 'GivingChartCategorized', 'Colorpicker',
                    function   ( $scope ,  recipientOrgs ,  budget ,  Pie,               Donut,                    Colorpicker ) {

    window.$scope = $scope; //debug
    
    $scope.budget = budget;

    $scope.orgs = [];


    $scope.isSelectedFilterObj = {
      isSelected: true
    }

    console.log(recipientOrgs);
    recipientOrgs.getOrgs(function(orgs){

      orgs.reapplyBudget();

      $scope.orgs = orgs;
      
      var colorpicker = new Colorpicker(orgs.saveOrgs);

      $scope.colorPickerOptions = colorpicker.options; // $scope.palette = $scope.colorPickerOptions.palette; // redundant

   		orgs.scopeDigest = $scope.$digest;

   		console.log('orgs inside getOrgs, after saving to $scope: ', orgs);
		  
      $scope.pie = new Pie(orgs, orgs.selectOrg);

   	});

  }]);