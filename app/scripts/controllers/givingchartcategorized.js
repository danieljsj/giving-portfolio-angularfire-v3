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

    var categoriesData = buildOrgsCategoriesSeries();
    var recipientsData = buildRecipientOrgsSeries();

    $scope.donutPie = new DonutPie(categoriesData, recipientsData);

    // $scope.donutPie = new DonutPie(browserData, versionsData);
    // 
    function buildRecipientOrgsSeries(orgs){

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

    function buildOrgsCategoriesSeries(orgs){

        console.log("taxn in buildOrgsCategoriesSeries: ", taxn);
        for (var taxId in taxn.taxTree.taxonomies){
            var currentTaxId = taxId;
            break;
        }

        var currentTax = taxn.taxTree.taxonomies[currentTaxId];

        var termsArray = [];

        for (var termId in currentTax.terms){
            var monthlySum = 0;
            $scope.orgs.forEach(function(org){  /// THIS! This is what's killing me so I can't abstract this anyhere.
                if (org.taxTerms[currentTaxId] == termId){
                    monthlySum += org.monthly;
                }
            });
            currentTax.terms[termId].y = currentTax.terms[termId].totalMonthly = monthlySum;
            currentTax.terms[termId].color = "rgba(255,255,255,.3)";

            termsArray.push(currentTax.terms[termId]);
        }

        console.log('currentTax.terms at end of buildOrgsCategoriesSeries: ', currentTax.terms);
        console.log('termsArray at end of buildOrgsCategoriesSeries: ', termsArray);


        termsArray.sort(function(termA,termB){termA.id - termB.id});


        return termsArray;

    }


  }]);