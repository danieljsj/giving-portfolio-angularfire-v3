'use strict';

/**
 * @ngdoc service
 * @name gpApp.GivingChartFlat
 * @description
 * # GivingChartFlat
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('GivingChartFlat', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function


    function ___RESIZE_CHART___() {

    	var chart = $("#giving-chart"); // TODO: THIS IS GOING TO FAIL BADLY
	    
	    var width = chart.parent().width();
	    var height = width;
		var doAnimation = false;
	    
	    chart.highcharts().setSize(height, width, doAnimation);
    }

	// $(window).resize(___RESIZE_CHART___); // TODO



	return function(___ORGS___){

		var setYsToPortions = function(){
			for (var i = 0; i < ___ORGS___.length; i++) {
		   		Object.defineProperty(___ORGS___[i], "y", { get: function () { return this.portion; } });
		   	};
		}
		setInterval(setYsToPortions, 500);

		return {
			config: {

				// plumbing/shim converting normal highcharts config layout for highcharts-ng:
				get options () {
					return {
						chart: this.chart,
						plotOptions: this.plotOptions,
						tooltip: this.tooltip
					}
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
							// align: 'center', // nope; this is not text-align, it's alignment relative to the point.
							format: '<b>{point.name}</b><br/>{point.percentage:.1f} %',
							style: {
								// color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
								// textAlign: "center" // nope; looks like it only accepts a few different params, and this ain't one. i'll try actual css.
							}
						},
						center: ["50%","50%"],
						size: "100%"
					}
				},
				exporting: {
					enabled: false
				},
				tooltip: {
					pointFormat: '<h5 fail>{series.name}:</h5><br/><b>{point.y}</b> parts<br/><b>{point.percentage:.1f}%</percentage></b> of giving.'
				},
				series: [
					{
						name: "Giving",
						data: ___ORGS___,    // used to be: get data () { return $scope.organizations; },
						id: "giving-data",
						point: {
							events: {
								// select: function(){ // was causing infinite loop, since the external selector func programmatically selects a piechart item
								click: function(){
									// EXTERNAL_SELECT_POINT_BY_ID(this.id); // no such thing
									// this.select(true);
								},
								unselect: function(){
									// externalSelectPointById(false); 
									// nope; this is firing AFTER the selection event, unselecting whatever was newly selected!
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



  });