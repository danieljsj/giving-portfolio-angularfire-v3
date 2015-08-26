'use strict';

/**
 * @ngdoc service
 * @name gpApp.GivingChartFlat
 * @description
 * # GivingChartFlat
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('GivingChartFlat', function () { // using scope in here is cheating...
    // AngularJS will instantiate a singleton by calling "new" on this function


    function ___RESIZE_CHART___() {

    	var chart = $("#giving-chart"); // TODO: THIS IS GOING TO FAIL BADLY
	    
	    var width = chart.parent().width();
	    var height = width;
		var doAnimation = false;
	    
	    chart.highcharts().setSize(height, width, doAnimation);
    }

	// $(window).resize(___RESIZE_CHART___); // TODO



	return function(orgs, selectOrg){

		console.log('orgs at time of givingflatchart new-ing: ',orgs);

		var ___ORGS___ = orgs;
		var ___SELECT_ORG___ = selectOrg;

		return {
			config: {

				// plumbing/shim converting normal highcharts config layout for highcharts-ng:
				get options () {
					return {
						chart: this.chart,
						plotOptions: this.plotOptions,
						tooltip: this.tooltip,
						exporting: this.exporting
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
							format: '{point.name}',
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
					// NOT WORKING IN HIGHCHARTS-NG:
					// code exactly like this is not working: http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/tooltip/footerformat/
					// some related but not identical questions by other: http://stackoverflow.com/questions/22500559/is-it-possible-to-do-a-custom-rendering-with-highchart-ng
					// 
					// useHtml: true,
					// headerFormat: '<small>{point.key}</small><table>',
					// pointFormat: 
					// 	'<tr><th colspan="2">{point.name}</th></tr>'+
					// 	'<tr><td>% of budget:</td><td>{point.y:.1f}%</td></tr>'+
					// 	'<tr><td>% of giving:</td><td>{point.percentage:.1f} %</td></tr>'+
					// 	'<tr><td>monthly giving:</td><td>${point.monthly:.2f}</td></tr>'+
					// 	'<tr><td>yearly giving:</td><td>${point.yearly:.2f}</td></tr>'
					// ,
					// footerFormat: '</table>'
					// 
					// until then, I'll stick to standard pointformat
					headerFormat: '',
					pointFormat: 
						'<b>{point.name}</b>'+
						'<br/>% of giving: <b>{point.percentage:.1f} %</td></b>'+
						'<br/>% of budget: <b>{point.y:.1f} %</td></b>'+
						'<br/>monthly giving: <b>$ {point.monthly:.2f}</td></b>'+
						'<br/>yearly giving: <b>$ {point.yearly:.2f}</td</b>'
					,
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



  });