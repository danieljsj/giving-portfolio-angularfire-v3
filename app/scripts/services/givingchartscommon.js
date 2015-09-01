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
	    		pointFormat: 
					'<b>{point.name}</b>'+
					'<br/>% of giving: <b>{point.percentage:.1f} %</td></b>'+
					'<br/>% of budget: <b>{point.y:.1f} %</td></b>'+
					'<br/>monthly giving: <b>$ {point.monthly:.2f}</td></b>'+
					'<br/>yearly giving: <b>$ {point.yearly:.2f}</td</b>'
	    	}
	    },
	    getOptionsForHighchartsNg: function(){
	    	console.log('`this` inside gcCommon getOptions:',this);
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