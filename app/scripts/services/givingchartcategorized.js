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
  	                        function ( gcCommon,             orgs,            taxn           ) 
  	{
  		return function(){
  			




			this.buildOrgsData = function(){

		        orgs.sort(function(orgA,orgB){
		        	var a = orgA.taxTerms[taxn.selectedTax.id];
		        	var b = orgB.taxTerms[taxn.selectedTax.id];
		        	if (!a) {a = Infinity;}
		        	if (!b) {b = Infinity;}
		        	return a - b;
		    	}); // maybe i need to build rather than sort???

		        console.log('orgs at end of buildOrgsData: ',orgs);

		        return orgs;

		    };





		    this.buildCatsData = function(){

		        console.log("taxn in buildCatsData: ", taxn);
		        console.log("taxn.taxTree in buildCatsData: ", taxn.taxTree);

		        var termsArray = [];

		        var categorizedOrgsMonthlySum = 0;
		        for (var termId in taxn.selectedTax.terms){
		            var monthlySum = 0, yearlySum = 0, percentageCopySum = 0;
		            orgs.forEach(function(org){  /// THIS! This is what's killing me so I can't abstract this anyhere.
		                if ('object' != typeof org.taxTerms){org.taxTerms = {}}
		                if (org.taxTerms[taxn.selectedTax.id] == termId){
		                    
		                    monthlySum += org.monthly;
		                    yearlySum += org.yearly;
		                    percentageCopySum += org.percentageCopy;

		                    categorizedOrgsMonthlySum += org.monthly;
		                }
		            });
		            taxn.selectedTax.terms[termId].monthly = monthlySum;
		            taxn.selectedTax.terms[termId].yearly = yearlySum;
		            taxn.selectedTax.terms[termId].percentageCopy = percentageCopySum;
		            
		            taxn.selectedTax.terms[termId].y = taxn.selectedTax.terms[termId].monthly

		            taxn.selectedTax.terms[termId].color = "rgba(255,255,255,0.3)";
		            // taxn.selectedTax.terms[termId].color = "rgba(0,0,0,0.3)"; // looks better light.

		            termsArray.push(taxn.selectedTax.terms[termId]);
		        }
	        	var uncategorizedPseudoterm = {
		        	name: "", 
		        	color: "rgba(255,255,255,0.0)",
		        	y: orgs.totalMonthly() - categorizedOrgsMonthlySum
	        	};
	        	console.log('uncategorizedPseudoterm in buildCatsData:',uncategorizedPseudoterm);
		        termsArray.push(uncategorizedPseudoterm);

		        console.log('taxn.selectedTax.terms at end of buildCatsData: ', taxn.selectedTax.terms);
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
					headerFormat: '',
					pointFormat: gcCommon.config.tooltip.pointFormat,
					footerformat: ''
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
		                distance: -40
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