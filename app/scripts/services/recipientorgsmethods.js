'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipientOrgsMethods
 * @description
 * # recipientOrgsMethods
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipientOrgsMethods', ['budget', function (budget) {
    // AngularJS will instantiate a singleton by calling "new" on this function



	// PRIVATE(S) FOR OUR FUNCS

	var orgCounter = 1;



	return {

		// ░█▀▀█         ░█─░█   ░█▀▀▄   
		// ░█───         ░█─░█   ░█─░█  
		// ░█▄▄█ █ █ █ █ ─▀▄▄▀ █ ░█▄▄▀ █ 
		// CREATING, ... UPDATING,DELETING:

		pushOrgState: function(org){
			if (undefined === org.percentage) org.percentage = null; // THIS SEEMS FUNNY. WHY/WHERE WOULD IT BE GOING FROM NULL TO UNDEFINED?
			org.percentageCopy = org.percentage;
			org.y = org.monthly;
			console.log('org in pushOrgState:',org);
			if (org.hasOwnProperty("$id")){
				this.$save(org);
			}
			this.pushOrgStateActions.forEach(function(action){
				action(org);
			});

		},
		addOrg: function(){

			var orgAtts = {
				portion: 1, 
				monthly: 100,
				name: "Org #" + orgCounter++,
				color: '#'+Math.floor(Math.random()*16777215).toString(16)
			}

			console.log('orgAtts in addOrg before applyChangedMonthly:',orgAtts);
			this.applyChangedMonthly(orgAtts);
			console.log('orgAtts in addOrg before $add:',orgAtts);
			
			this.$add(orgAtts).then(function(ref) {

			  this.selectOrg(ref);

			}.bind(this));

		},

		saveOrgs: function(){
			alert("calling orgs.saveOrgs, this=",this);
			for (var i = this.length - 1; i >= 0; i--) {
				this.$save(this[i]);
			};
		},

		saveOrgsChanges: function(newOrgs, oldOrgs){ // this really needs to be in orgsmanager!
			for (var i = newOrgs.length - 1; i >= 0; i--) {
				// if (! angular.equals( newOrgs[i], oldOrgs.getOrg( newOrgs[i].id ) ) ){
					this.pushOrgState(newOrgs[i]);
				// }
			}
		},
		removeSelectedOrg: function(){
			// var index = this.indexOf(this.selectedOrg); // in case we wanted to select the next org afterward
			this.$remove(this.selectedOrg);
			this.selectOrg(false);
		},



		// ░█▀▀▀█ █▀▀ █── █▀▀ █▀▀ ▀▀█▀▀ ─▀─ █▀▀█ █▀▀▄ 
		// ─▀▀▀▄▄ █▀▀ █── █▀▀ █── ──█── ▀█▀ █──█ █──█ 
		// ░█▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀ ──▀── ▀▀▀ ▀▀▀▀ ▀──▀ 
		// SELECTION:

		selectOrg: function(orgRep){
			
			if (false === orgRep) return this.selectedOrg = false;
			
			var org = this.getOrg(orgRep);
			console.log("time to select this org (if not null): ", org); // todo: debug: sometimes no org selected? oddly, it selected only when I had this console.log up???

			if (org){
				this.selectedOrg = org;
				this.saveOrgsChanges(this); // todo: save only the one org.
				setTimeout(function(){this.applyOrgTermsToTermSelects(org);}.bind(this),250); // I think it needs this because when the first org (or two???) is clicked, the <option>s aren't ready/in yet, so when angular puts the form into the html, the terms aren't there, so in the HTML, the val doesn't think it's an option.
			} else {
				setTimeout(function(){this.selectOrg(orgRep);}.bind(this),0);
			}

		},
		applyOrgTermsToTermSelects: function(org){
			for (var taxId in org.taxTerms ){
				var termId = org.taxTerms[taxId];
				var taxTermSelectsQuery = '.tax-'+taxId+' select';
				var taxTermSelects = $(taxTermSelectsQuery);
				// console.log('applyOrgTermsToTermSelects... taxId: '+taxId+', taxTermSelectsQuery: '+taxTermSelectsQuery+'termId: '+termId+'taxTerm')
				taxTermSelects.val(termId);
			}
		},
		selectNext: function(){
			if ( ! this.selectedOrg ){
				this.selectOrg(this[0]);
			}
			else {
				this.shiftSelection(1);
			}
		},
		selectPrev: function(){
			if ( ! this.selectedOrg ){
				this.selectOrg(this[this.length-1]);
			}
			else {
				this.shiftSelection(-1);
			}
		},
		shiftSelection: function(shift){
			var newIndex = ( this.indexOf(this.selectedOrg) + shift + this.length ) % this.length;
			
			this.selectOrg( this[newIndex] ); // TODO!!!!!!!: MAKE IT MAKE THE JUMP ACROSS ZERO! MOD ACROSS ZERO IS FAILING!
		},
		// not in use yet:
		// getSelectedOrgIndex: function(){
		// 	return this.$indexFor(this.selectedOrg.$id);
		// }
		getOrg: function(orgRep, callback){
			var orgId = this.getOrgId(orgRep)

			console.log("orgId returned to getOrg: ", orgId);
			console.log("orgs fbArr ids after getOrgId: ", this.map(function(org){return org.$id;}) );  // learning: sometimes by this point the orgs array contains the new org, sometimes it doesn't. In addOrg, where this race happens, we will need to use a callback for this func so it can keep trying until it works, then call the callback.

			// method 1: loop the orgs:
			// for (var i = this.length - 1; i >= 0; i--) { // POSSIBLE PROBLEM: IT'S POSSIBLE THAT THE
			// 	if(orgRep == this[i].$id){
			// 		return this[i];
			// 	}
			// };
			
			// method 2: fbArr$getRecord (having some issues here...)
			var org = this.$getRecord(orgId);
			console.log("this org record was returned by the orgs firebaseArray: ", org);   // holy crappers; when I add this separation (via var assigns), it fixes the bug! I've had that happen before, too!
			return org;
		},
		getOrgId: function(orgRep){

			console.log('getting id for org with the following representation: ',orgRep);

			if ('number' === typeof orgRep)
				return this[orgRep].$id; // for performance, this could go up a level, into selectOrg, since this requires coverting index to id, which then will be used to get an index...

			if ('string' === typeof orgRep)
				return orgRep;

			if (orgRep.$id)
				return orgRep.$id;

			// TODO/QN/FAIL-LESSON: obs' prototypes aren't always visible if the ob is passed into another func??? compare to this.addOrg, and doc: https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-addnewdata ... WAIT, IT'S TOTALLY WORKING... I must have just typed something funny?
			if (orgRep.key) {
				console.log("found orgRep.key");
				return orgRep.key(); 
			}
			// if (orgRep.prototype.key){ // TypeError: Cannot read property 'key' of undefined
			// 	console.log("found orgRep.prototype.key");
			// 	return orgRep.key();
			// } 
			
			console.log(orgRep); throw Error("gpError: getOrgId does not support the layout of the incoming variable");
		},



		// ░█▀▀█ ─▀─ ▀█─█▀ ─▀─ █▀▀▄ █▀▀▀ 
		// ░█─▄▄ ▀█▀ ─█▄█─ ▀█▀ █──█ █─▀█ 
		// ░█▄▄█ ▀▀▀ ──▀── ▀▀▀ ▀──▀ ▀▀▀▀ 
		// GIVING: 
																				// ( we are using "FIXED GIVING", based on '.yearly', '.monthly', 'percentage' giving (used to be "FIXED BUDGET", based on budget and org.portions) );		
		applyOrgMonthly: function(org, monthly){
			var PENNIES_IN_DOLLAR = 100;
			var PERCENTAGE_POINTS_IN_UNITY = 100;
			var percentageIncrementInverse = 10;
			org.yearly = Math.round( monthly*12 * PENNIES_IN_DOLLAR ) / PENNIES_IN_DOLLAR;
			org.monthly = Math.round( monthly * PENNIES_IN_DOLLAR ) / PENNIES_IN_DOLLAR;
			var budgetMonthly = budget.monthly();
			console.log('budgetMonthly in applyOrgMonthly:',budgetMonthly);
			if ( budgetMonthly || 0 === budgetMonthly ){
				org.percentage = Math.round( monthly / budgetMonthly * PERCENTAGE_POINTS_IN_UNITY * percentageIncrementInverse ) / percentageIncrementInverse;
			} else {
				org.percentage = null;
			}
			console.log('org.percentage at end of applyOrgMonthly:',budgetMonthly);

			this.pushOrgState(org);
		},
		applyChangedYearly: function(org){
			org.basis = 'amount';
			this.applyOrgMonthly( org, org.yearly/12 );
		},
		applyChangedMonthly: function(org){
			org.basis = 'amount';
			this.applyOrgMonthly( org, org.monthly );
		},
		applyChangedPercentage: function(org){
			org.basis = 'percentage';
			this.applyOrgMonthly( org, org.percentage/100 * budget.monthly() );
		},
		reapplyBudget: function(){
			for (var i = this.length - 1; i >= 0; i--) {
				var org = this[i];
				if ('amount' == org.basis){
					this.applyChangedYearly(org);
				}
				if ('percentage' == org.basis){
					this.applyChangedPercentage(org);
				}
			};
		},

		percentBudgetUsed: function(){
			return this.totalMonthly() / budget.monthly() * 100;
		},
		totalMonthly: function(){
			var totalMonthlySum = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				totalMonthlySum += this[i].monthly;
			}
			return totalMonthlySum;
		}


	};

  }]);
