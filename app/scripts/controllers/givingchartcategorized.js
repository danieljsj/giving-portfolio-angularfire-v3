'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:GivingchartcategorizedCtrl
 * @description
 * # GivingchartcategorizedCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('GivingchartcategorizedCtrl', 
  	         ['$scope', 'GivingChartCategorized', 'recipientOrgs', 'taxonomization',
  	function ( $scope,   DonutPie,                 orgs,            taxn          ) 
  {

    $scope.orgs = orgs;

    $scope.taxn = taxn;
    taxn.taxTree.$bindTo($scope, 'taxTree', true ); // why do I have taxonomies within taxTree again?

    console.log("orgs after bare-bones initialization: ", orgs);
    console.log("taxn after bare-bones initialization: ", taxn);


    function onceStuffIsLoaded(){
        $scope.donutPie = new DonutPie();

        console.log($scope.donutPie);
        $scope.$digest();
    }
    setTimeout(onceStuffIsLoaded,1000);


    // $scope.donutPie = new DonutPie(browserData, versionsData);
    // 
    


  }]);