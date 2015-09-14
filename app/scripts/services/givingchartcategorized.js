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
  		return function(){
  			
			this.buildOrgsData = function(){

		        // NOTE - THIS IS REDUNDANT. will fix in portfolio.js by allowing an activeTaxonomy var.
		        for (var taxId in taxn.taxTree.taxonomies){
		            var currentTaxId = taxId; // FIX THIS! NEED TO USE ACTUAL CURRENT TAXn
		            break;
		        }

		        orgs.sort(function(orgA,orgB){ return orgA.taxTerms[currentTaxId] - orgB.taxTerms[currentTaxId]; }); // maybe i need to build rather than sort???

		        console.log('orgs at end of buildOrgsData: ',orgs);

		        return orgs;

		    };

		    this.buildCatsData = function(){

		        console.log("taxn in buildCatsData: ", taxn);
		        console.log("taxn.taxTree in buildCatsData: ", taxn.taxTree);
		        for (var taxId in taxn.taxTree.taxonomies){
		            var currentTaxId = taxId;
		            break;
		        }
		        if ( (!taxn.taxTree) || (!taxn.taxTree.taxonomies) ) return []; 
		        var currentTax = 
		        	taxn
		        		.taxTree
		        		.taxonomies[
		        			currentTaxId
		        		];

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

		        console.log('currentTax.terms at end of buildCatsData: ', currentTax.terms);
		        console.log('termsArray at end of buildCatsData: ', termsArray);


		        termsArray.sort(function(termA,termB){termA.id - termB.id});

		        return termsArray;

		    };

		    this.updateData = function(){
		    	console.log('this in updateData (looking for this.config.series[...])', this); // undefined!!
		    	this.config.series[0].data = this.buildCatsData();
		    	this.config.series[1].data = this.buildOrgsData();
		    }

			this.config = {
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
		        // 2 totally independent series; a donut wrapping a pie:
		        series: [{
		            name: 'Categories',
		            data: this.buildCatsData(),
		            // data: [{name:"foo",y:1},{name:"foo",y:1},{name:"foo",y:1}],
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
		            data: this.buildOrgsData(),
		            // data: [{name:"foo",y:1},{name:"foo",y:1},{name:"foo",y:1}],
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
		            },
	            	point: {
						events: {
							// select: function(){     // was causing infinite loop, since the external selector func programmatically selects a piechart item
							click: function(){
								console.log("point on click", this);
								orgs.selectOrg(this.$id);
								this.selected = true;    // needed, though counterintuitive. this actually BREAKS the normal pie-chart behavior of slicing out the pie chart. (explanation-guess: it probably has a check for "if this is not selected, then select and slice", or something.)
								
							},
							unselect: function(){
								console.log("point on unselect", this);
							}
						}
					}
		        }]
  			};

  			// nothing to return; we used 'this'.

  		};

  }]);