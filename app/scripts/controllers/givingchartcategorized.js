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

        $scope.donutPie = new DonutPie(browserData, versionsData);

    });













    var colors = Highcharts.getOptions().colors,
        categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
        data = [{
            y: 56.33,
            color: colors[0],
            drilldown: {
                name: 'MSIE versions',
                categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0', 'MSIE 10.0', 'MSIE 11.0'],
                data: [1.06, 0.5, 17.2, 8.11, 5.33, 24.13],
                color: colors[0]
            }
        }, {
            y: 10.38,
            color: colors[1],
            drilldown: {
                name: 'Firefox versions',
                categories: ['Firefox v31', 'Firefox v32', 'Firefox v33', 'Firefox v35', 'Firefox v36', 'Firefox v37', 'Firefox v38'],
                data: [0.33, 0.15, 0.22, 1.27, 2.76, 2.32, 2.31, 1.02],
                color: colors[1]
            }
        }, {
            y: 24.03,
            color: colors[2],
            drilldown: {
                name: 'Chrome versions',
                categories: ['Chrome v30.0', 'Chrome v31.0', 'Chrome v32.0', 'Chrome v33.0', 'Chrome v34.0',
                    'Chrome v35.0', 'Chrome v36.0', 'Chrome v37.0', 'Chrome v38.0', 'Chrome v39.0', 'Chrome v40.0', 'Chrome v41.0', 'Chrome v42.0', 'Chrome v43.0'
                    ],
                data: [0.14, 1.24, 0.55, 0.19, 0.14, 0.85, 2.53, 0.38, 0.6, 2.96, 5, 4.32, 3.68, 1.45],
                color: colors[2]
            }
        }, {
            y: 4.77,
            color: colors[3],
            drilldown: {
                name: 'Safari versions',
                categories: ['Safari v5.0', 'Safari v5.1', 'Safari v6.1', 'Safari v6.2', 'Safari v7.0', 'Safari v7.1', 'Safari v8.0'],
                data: [0.3, 0.42, 0.29, 0.17, 0.26, 0.77, 2.56],
                color: colors[3]
            }
        }, {
            y: 0.91,
            color: colors[4],
            drilldown: {
                name: 'Opera versions',
                categories: ['Opera v12.x', 'Opera v27', 'Opera v28', 'Opera v29'],
                data: [0.34, 0.17, 0.24, 0.16],
                color: colors[4]
            }
        }, {
            y: 0.2,
            color: colors[5],
            drilldown: {
                name: 'Proprietary or Undetectable',
                categories: [],
                data: [],
                color: colors[5]
            }
        }],
        browserData = [],
        versionsData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;


    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }
    // NOTE: this should be pretty easy. Just need to make the categories have a 'y' which is the sum of all the elements with their category. And splice in an 'uncategorized' category for the blanks. can even highcharts-ng it without much trouble. I suppose just making sure it's all always sorted. but I think... I think I should be able to use a getter, or something, or just somethign that is always remaking the categorized array.




    // $scope.donutPie = new DonutPie(browserData, versionsData);
    // 
    function buildRecipientsSeries(){
        return browserData;
    }
    function buildCategoriesSeries(){
        tan.taxonomies[0].terms.forEach(function(term){
            var monthlySum = 0;
            for (var i = $scope.orgs.length - 1; i >= 0; i--) {
                // if ( $scope.orgs[i].
            };
        });
    }




  }]);