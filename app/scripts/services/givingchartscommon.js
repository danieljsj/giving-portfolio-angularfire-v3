'use strict';

/**
 * @ngdoc service
 * @name gpApp.givingChartsCommon
 * @description
 * # givingChartsCommon
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('givingChartsCommon', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
    	config: {
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
				// until then, I'll stick to standard (non-html) pointFormat, like this:
	    		pointFormat:
					'<b>{point.name}</b>'+
					'<br/>% of giving: <b>{point.percentage:.1f} %</td></b>'+
					'<br/>% of budget: <b>{point.y:.1f} %</td></b>'+
					'<br/>monthly giving: <b>$ {point.monthly:.2f}</td></b>'+
					'<br/>yearly giving: <b>$ {point.yearly:.2f}</td</b>'
	    	},
	    	plotOptions: {
	    		pie: {
	    			dataLabels: {
	    				style: {
								// color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
								// textAlign: "center" // nope; looks like it only accepts a few different params, and this ain't one. i'll try actual css.
								"textShadow": "0 0 6px #000, 0 0 3px #000"
						}
	    			}
	    		}
	    	}
	    },
	    getOptionsForHighchartsNg: function(){
	    	// console.log('`this` inside gcCommon getOptions:',this);
			return {
				chart: this.chart,
				plotOptions: this.plotOptions,
				tooltip: this.tooltip,
				exporting: this.exporting
			}
		},









	    // I DO NOT BELIEVE THIS IS IN USE ANYWHERE...
		resizeChart: function() {

	    	var chart = $("#giving-chart"); // TODO: THIS IS GOING TO FAIL BADLY
		    
		    var width = chart.parent().width();
		    var height = width;
			var doAnimation = false;
		    
		    chart.highcharts().setSize(height, width, doAnimation);
	    },
	};

  });