'use strict';

/**
 * @ngdoc service
 * @name gpApp.GivingChartFlat
 * @description
 * # GivingChartFlat
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('GivingChartFlat', ['givingChartsCommon',
                     function ( gcCommon ) { // using scope in here is cheating...
    // AngularJS will instantiate a singleton by calling "new" on this function


	return function(orgs, selectOrg){

		console.log('orgs at time of givingflatchart new-ing: ',orgs);

		var ___ORGS___ = orgs;
		var ___SELECT_ORG___ = selectOrg;

		return {
			config: {

				// plumbing/shim converting normal highcharts config layout for highcharts-ng:
				get options () {
					return gcCommon.getOptionsForHighchartsNg.bind(this)();
				},


				chart: {
					renderTo: 'giving-chart',
					type: 'pie',
					backgroundColor: null,
					events: {
						// load: ___RESIZE_CHART___ // TODO
					}
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							
							distance: -30,
							color: 'white',
							// 
							// align: 'center', // nope; this is not text-align, it's alignment relative to the point.
							format: '{point.name}',
							style: gcCommon.config.plotOptions.pie.dataLabels.style
						},
						center: ["50%","50%"],
						
						// size: "100%",
						// size: "67%",
						// size: "85%",
						size: "90%",
					}
				},
				exporting: {
					enabled: false
				},
				tooltip: {
					headerFormat: '',
					pointFormat: gcCommon.config.tooltip.pointFormat,
					footerformat: ''
				},
				series: [
					{
						name: "Giving",
						data: ___ORGS___,
						id: "giving-data",
						point: {
							events: {
								// select: function(){     // was causing infinite loop, since the external selector func programmatically selects a piechart item
								click: function(){
									console.log("point on click", this);
									___SELECT_ORG___(this.$id);
									this.selected = true;    // needed, though counterintuitive. this actually BREAKS the normal pie-chart behavior of slicing out the pie chart. (explanation-guess: it probably has a check for "if this is not selected, then select and slice", or something.)
									
								},
								unselect: function(){
									console.log("point on unselect", this);
								}
							}
						}
					}
				],
				title: {
					text: ""
				},
				credits: {
					enabled: false
				},
				loading: false,
				size: {}
			}
		}

	}



  }]);