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

    console.log("orgs, taxn, after getOrgs: ", orgs, taxn);

    function onceStuffIsLoaded(){
        $scope.donutPie = new DonutPie(/* i'm sure something will need to go here */);
    }
    setTimeout(onceStuffIsLoaded,1000);


    // $scope.donutPie = new DonutPie(browserData, versionsData);
    // 
    


  }]);