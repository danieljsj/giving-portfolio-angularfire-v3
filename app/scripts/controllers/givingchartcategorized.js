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
  	function ( $scope,  DonutPie,                  recipientOrgs,   taxn          ) 
  {

    recipientOrgs.getOrgs(function(orgs){

        $scope.orgs = orgs;

        $scope.taxn = taxn;
        taxn.taxTree.$bindTo($scope, 'taxTree', true ); // why do I have taxonomies within taxTree again?


        console.log("orgs, taxn, after getOrgs: ", orgs, taxn);
 
        var categoriesData = buildCategoriesSeries();
        var recipientsData = buildRecipientsSeries();

        $scope.donutPie = new DonutPie(categoriesData, recipientsData);

    });


    // $scope.donutPie = new DonutPie(browserData, versionsData);
    // 
    function buildRecipientsSeries(){

        // NOTE: THIS IS REDUNDANT. will fix in portfolio.js by allowing an activeTaxonomy var.
        for (var taxId in taxn.taxTree.taxonomies){
            var currentTaxId = taxId;
            break;
        }

        return $scope.orgs.sort(function(orgA,orgB){
            return orgA.taxTerms[currentTaxId]
            -
            orgB.taxTerms[currentTaxId]
        });
    }

    function buildCategoriesSeries(){

        console.log("taxn in buildCategoriesSeries: ", taxn);
        for (var taxId in taxn.taxTree.taxonomies){
            var currentTaxId = taxId;
            break;
        }

        var currentTax = taxn.taxTree.taxonomies[currentTaxId];

        var termsArray = [];

        for (var termId in currentTax.terms){
            var monthlySum = 0;
            $scope.orgs.forEach(function(org){
                if (org.taxTerms[currentTaxId] == termId){
                    monthlySum += org.monthly;
                }
            });
            currentTax.terms[termId].y = currentTax.terms[termId].totalMonthly = monthlySum;

            termsArray.push(currentTax.terms[termId]);
        }

        console.log('currentTax.terms at end of buildCategoriesSeries: ', currentTax.terms);
        console.log('termsArray at end of buildCategoriesSeries: ', termsArray);


        termsArray.sort(function(termA,termB){termA.id - termB.id});


        return termsArray;

    }


  }]);