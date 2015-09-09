'use strict';

/**
 * @ngdoc service
 * @name gpApp.GivingChartCategorized
 * @description
 * # GivingChartCategorized
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('GivingChartCategorized', ['givingChartsCommon', 'recipientOrgs', 'taxonomization',
  	                        function ( gcCommon,             orgs,            taxn          ) 
  	{
  		return function(__CATEGORIES_DATA__, __RECIPIENTS_DATA__){
  			return {

				buildRecipientOrgsSeriesData: function buildOrgsData(){

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
			    },

			    buildOrgsCategoriesSeriesData: function buildCatsData(){

			        console.log("taxn in buildOrgsCategoriesSeries: ", taxn);
			        for (var taxId in taxn.taxTree.taxonomies){
			            var currentTaxId = taxId;
			            break;
			        }

			        var currentTax = taxn.taxTree.taxonomies[currentTaxId];

			        var termsArray = [];

			        for (var termId in currentTax.terms){
			            var monthlySum = 0;
			            orgs.forEach(function(org){  /// THIS! This is what's killing me so I can't abstract this anyhere.
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

			    },

  				config: {
  					get options () {
						return gcCommon.getOptionsForHighchartsNg.bind(this)();
					},
			        chart: {
			        	// renderTo: 'demo-categorized-chart', // if New-ing.
			            type: 'pie',
						// backgroundColor: null,
						backgroundColor: "rgba(255,255,255,0.0)",
			        },
			        title: {
			            // text: 'Browser market share, January, 2015 to May, 2015'
			            text: ''
			        },
			        subtitle: {
			            // text: 'Source: <a href="http://netmarketshare.com/">netmarketshare.com</a>'
			            text: ''
			        },
			        yAxis: {
			            title: {
			                text: 'Total percent market share'
			            }
			        },
			        plotOptions: {
			            pie: {
			                shadow: false,
			                center: ['50%', '50%'],
							dataLabels: {
								style: gcCommon.config.plotOptions.pie.dataLabels.style
							}
			            }
			        },
			        tooltip: {
			            valueSuffix: '%'
			        },
					exporting: {
						enabled: false
					},
					credits: {
						enabled: false
					},
			        series: [{
			            name: 'Categories',
			            get data () { return buildCatsData(); },
			            size: '55%',
			            dataLabels: {
			                formatter: function () {
			                    return this.y > 5 ? 
			                    	'<b style="font-size:15px;">'+this.point.name+'</b>' 
			                    	: 
			                    	null;
			                },
			                color: 'white',
			                fontSize: '16px',
			                distance: -60
			            }
			        }, {
			            name: 'Recipient Organizations',
			            get data () { return buildOrgsData(); },
			            size: '90%',
			            innerSize: '55%',
			            dataLabels: {
			                formatter: function () {
			                    // display only if larger than 1
			                    // return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
			                    return this.y > 2 ?
			                    	'<b style="font-size:10px">'+this.point.name+'</b>' 
			                    	:
			                    	null;
			                },
			                color: 'white',
			                fontSize: '14px',
			                distance: -10
			            }
			            // whoah! I get it! It's 2 totally independent series!! a donut wrapping a pie!!
			        }]
			    },
  			};
  		};

    // AngularJS will instantiate a singleton by calling "new" on this function

    // THE GOODS HERE WILL BE PULLED IN FROM GIVINGCHARTCATEGORIZED.JS(CONTROLLERS)!!!

	// return function(orgs, selectOrg){

	// 	console.log('orgs at time of givingflatchart new-ing: ',orgs);

	// 	var ___ORGS___ = orgs;
	// 	var ___SELECT_ORG___ = selectOrg;

	// 	return {
	// 		config: {

	// 			// plumbing/shim converting normal highcharts config layout for highcharts-ng:
	// 			get options () {
	// 				return gcCommon.getOptionsForHighchartsNg.bind(this)();
	// 			},


	// 			chart: {
	// 				renderTo: 'giving-chart',
	// 				type: 'pie',
	// 				backgroundColor: null,
	// 				events: {
	// 					// load: ___RESIZE_CHART___ // TODO
	// 				}
	// 			},
	// 			plotOptions: {
	// 				pie: {
	// 					allowPointSelect: true,
	// 					cursor: 'pointer',
	// 					dataLabels: {
	// 						enabled: true,
							
	// 						distance: -30,
	// 						color: 'white',
	// 						// 
	// 						// align: 'center', // nope; this is not text-align, it's alignment relative to the point.
	// 						format: '{point.name}',
	// 						style: {
	// 							// color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	// 							// textAlign: "center" // nope; looks like it only accepts a few different params, and this ain't one. i'll try actual css.
	// 						}
	// 					},
	// 					center: ["50%","50%"],
						
	// 					size: "100%",
	// 					// size: "67%",
	// 				}
	// 			},
	// 			exporting: {
	// 				enabled: false
	// 			},
	// 			tooltip: {

	// 				headerFormat: '',
	// 				pointFormat: gcCommon.config.tooltip.pointFormat,
	// 				footerformat: ''
	// 			},
	// 			series: [
	// 				{
	// 					name: "Giving",
	// 					data: ___ORGS___,
	// 					id: "giving-data",
	// 					point: {
	// 						events: {
	// 							// select: function(){     // was causing infinite loop, since the external selector func programmatically selects a piechart item
	// 							click: function(){
	// 								console.log("point on click", this);
	// 								___SELECT_ORG___(this.$id);
	// 								this.selected = true;    // needed, though counterintuitive. this actually BREAKS the normal pie-chart behavior of slicing out the pie chart. (explanation-guess: it probably has a check for "if this is not selected, then select and slice", or something.)
									
	// 							},
	// 							unselect: function(){
	// 								console.log("point on unselect", this);
	// 							}
	// 						}
	// 					}
	// 				}
	// 			],
	// 			title: {
	// 				text: ""
	// 			},
	// 			credits: {
	// 				enabled: false
	// 			},
	// 			loading: false,
	// 			size: {}
	// 		}
	// 	}

	// }

  }]);
