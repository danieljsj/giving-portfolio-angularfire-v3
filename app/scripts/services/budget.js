'use strict';

/**
 * @ngdoc service
 * @name gpApp.budget
 * @description
 * # budget
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('budget', ['Ref', '$firebaseObject', 'Auth',
  	         function (Ref,   $firebaseObject,   Auth ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var uid = Auth.$getAuth().uid;


	this.fbObj = new $firebaseObject(Ref.child('userBudgets/'+uid));

	this.loaded = false;
	this.fbObj.$loaded().then(function(thisLoadedBudget){
		thisLoadedBudget.loaded = true; // not sure why, but `this` is undefined. so we use thisLoadedBudget instead.
	});

	var o = this.fbObj;

	angular.extend(o,{
		currency: 'usd'
	});

  	this.yearly = function(){  // i'm keeping the funcs separate from the fbObj rather than "extending firebase" because it was giving me all kinds of issues with binding/sync. (unlike with fbArrays, where you're only saving individual elements, vs. syncing whole object.) with fbObjects, I've decided it's easier to store the fbObject as a separate property

  		switch ( o.givingBasis ) {
			
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