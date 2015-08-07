'use strict';

/**
 * @ngdoc service
 * @name gpApp.budget
 * @description
 * # budget
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('budget', ['Ref', '$firebaseObject', function (Ref, $firebaseObject) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	this.fbObj = new $firebaseObject(Ref.child('budget'));

	var o = this.fbObj;

	angular.extend(o,{
		currency: 'usd'
	});

  	this.yearly = function(){ // not sure whether storing things with funcs in firebase will break things.

  		switch ( o.givingBasis ) { // note: angular template is trying to read stuff before it even comes in... how do we prevent this?
			
			case 'fixed':
				switch ( o.fixedGivingTimeframe ) {
					case 'yearly':
						return o.fixedGivingAmount;
					case 'monthly':
						return o.fixedGivingAmount * 12;
				}
  			
  			case 'income':
				switch ( o.incomeTimeframe ) {
					case 'yearly':
						var yearlyIncome = o.incomeAmount;
						break;
					case 'monthly':
						var yearlyIncome = o.incomeAmount * 12;
						break;
					throw 'error: income timeframe not specified';
				}
				switch ( o.incomeBeforeOrAfterTaxes ) {
					case 'before':
						var yearlyGiveableIncome = yearlyIncome;
						break;
					case 'after':
						var yearlyGiveableIncome = yearlyIncome * (1-o.incomeTaxPercentage/100);
						break;
					throw 'error: before or after taxes must be specified';
				}
				return yearlyGiveableIncome * o.incomeGivingPercentage/100;
			
			throw 'error: giving basis not specified';
  		}
  	};


  	this.monthly = function(){
  		return this.yearly() / 12;
  	};


}]);