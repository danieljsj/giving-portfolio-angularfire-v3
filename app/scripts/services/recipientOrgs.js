'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipientOrgs
 * @description
 * # recipientOrgs
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipientOrgs', ['Ref', '$firebaseArray', 'budget', 
                   function ( Ref,   $firebaseArray,   budget) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    

	var orgCounter = 1;

	var orgsFuncs = {

		// CREATION, SAVING, DELETING:
		
		addOrg: function(){

			var orgAtts = {
				portion: 1, 
				percentage: 10, /// WILL NEED SOME FIXES
				yearly: 1000,
				monthly: 100,
				y: 10, // use percentage as y in case of fixed-giving display. Namely because highcharts will create another, built-in value for 'percentage', I believe. And because we want to easily expose percentage for display.
				name: "Org #" + orgCounter++,
				color: '#'+Math.floor(Math.random()*16777215).toString(16)
			}
			this.$add(orgAtts).then(function(ref) {

			  this.selectOrg(ref);

			}.bind(this));

		},

		saveOrgsChanges: function(newOrgs, oldOrgs){ // this really needs to be in orgsmanager!
			for (var i = newOrgs.length - 1; i >= 0; i--) {
				// if (! angular.equals( newOrgs[i], oldOrgs.getOrg( newOrgs[i].id ) ) ){
					newOrgs.$save(newOrgs[i]);
				// }
			}
		},

		removeSelectedOrg: function(){
			// var index = this.indexOf(this.selectedOrg); // in case we wanted to select the next org afterward
			this.$remove(this.selectedOrg);
			this.selectOrg(false);
		},



		// SELECTION:

		selectOrg: function(orgRep){
			
			if (false === orgRep) return this.selectedOrg = false;
			
			var org = this.getOrg(orgRep);
			console.log("time to select this org (if not null): ", org); // todo: debug: sometimes no org selected? oddly, it selected only when I had this console.log up???

			if (org){
				this.selectedOrg = org;
				this.saveOrgsChanges(this); // todo: save only the one org.
			} else {
				setTimeout(function(){this.selectOrg(orgRep);}.bind(this),0);
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






		// FIXED BUDGET: (based on 'portion')
		// 
			// let's be real; this was nice for prelim. chart-building, but nobody is going to want to use 'portion', at least not until distributed giving is automated by the system, because people's real giving context is this: auto-deposits set up at a variety of recipients. they're not going to want to go change all their giving-vals to some crazy new decimal just cuz they added an org. Now. It's fine to keep this around if desired; keep some commented-out stuff at the bottom, or off in another file, because it may be nice to enable switching between modes, as perhaps some people would want to do portion. BUT -- switching between them quickly will be non-compelling, because eithe A) the amounts would jump when reverting back to old portions, or B) the portions will be calculated, and thus will be crazy decimals, losing the niceness of "1 part OrgA, 2 parts OrgB". so yup, for now I'm going to bury the "portion" features. ALSO BECAUSE if desired, we can replicate the "portion" advantage, namely the ability to auto-scale all other giving to make room for new giving, by using a "normalize" button, or a "nomralize > scale all giving" and "normalize > scale only percent-based giving" feature.
		
		incrementOrgPortion: function(org, delta){
			if ( 0 < delta || 0 <= org.portion + delta ) {  
					org.portion += delta;
					this.pushOrgState(org);
			} else {
			 	alert("Giving for an organization cannot be less than 0!")
			}
		},

		getOrgGivingCoefficient: function(org){
			var totalPortions = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				totalPortions += this[i].portion;
			};
			return ( org.portion / totalPortions );
		},


		// MOSTLY FIXED BUDGET:
		
		pushOrgState: function(org){ // should be: pushOrgPortion()
			if (this.basis = 'portions'){
				console.log(org.portion);
				// org.marker
				// org.marker = { fillColor: org.color } // highcharts
				if ( 
					( ! ( undefined === org.portion ) ) 
					&&
					( ! ( null === org.portion ) ) 
					&& 
					( 0 <= org.portion ) 
				) {
					org.y = org.portion;
					this.$save(org);
				}
			}
			// if ( true || this.givingBasis = 'amountsAndPercentages' ){
			// 	org.y = org.monthly;
			// }
		},




		// FIXED GIVING: (based on '.yearly', '.monthly', 'percentage' );

		applyOrgPortion: function(org, portion){
			org.yearly = Math.round( portion * budget.yearly() *100)/100;
			org.monthly = Math.round( portion * budget.monthly() *100)/100;
			org.percentage = Math.round( portion * 100 *10)/10;
			this.pushOrgState(org);
		},
		applyChangedYearly: function(org){
			org.basis = 'amount';
			this.applyOrgPortion( org, org.yearly / budget.yearly() );
		},
		applyChangedMonthly: function(org){
			org.basis = 'amount';
			this.applyOrgPortion( org, org.monthly / budget.monthly() );
		},
		applyChangedPercentage: function(org){
			org.basis = 'percentage';
			this.applyOrgPortion( org, org.percentage / 100 );
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

		/// maybe this should be in givingChart.controls?
		highchartDeselectAllPoints: function(){
			for (var i = this.series.length - 1; i >= 0; i--) {
				for (var j = this.series[i].length - 1; j >= 0; j--) {
					this.series[i].data[j].select(false); // if the this's arent being the givingChart, we can do a .bind(givingChart)
				};
			};
		}
		// , highchartShiftSelection: function(shift){}


		
	}



	
	this.taxonomies = [ // note: if I can use angular.extend or something other than a funcs-only loop-duper, then I can include this.
		{}
	];





	// I really want to do this differently, i.e. have the thing actually return the promise... but I'm not sure if I'll be able to, and I don't want to pick extra fights just yet...

	this.getOrgs = function(saveToScopeOrgsThenInit){
		
		// console.log($firebaseArray); // yup
		var query = Ref.child('organizations').limitToLast(100);

		//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
		var orgs = $firebaseArray(query);
		orgs.$loaded()
		  .then(function(loadedOrgs) {
			if (loadedOrgs === orgs ){
				for (var funcName in orgsFuncs){
					orgs[funcName] = orgsFuncs[funcName].bind(orgs);
				}				
				// angular.extend(orgs,OrgsCollectionFuncs); // "this", I believe, was pointing to the "var OrgsCollectionFuncs = {}" object; so not going to do the extending here.
				saveToScopeOrgsThenInit(orgs);
			}
		  })
		  .catch(function(error) {
			console.log("Error:", error);
		  });
		}

		// orgsFbArray.$loaded().catch(function(err) { console.error(err); });
		
		// not even sure I need that ..
		// 
		// 
  //   	orgsFbArray.$loaded( // $   // $loaded() 	Returns a promise which resolves after the initial records have been downloaded from our database. This is only called once and should be used with care. See Extending the Services for more ways to hook into server events. 
  //   		asOrgsCollection.bind(orgsFbArray) // if I don't mind letting my controller know about the service, I can just have the controller do the $loaded(asOrgsCollection) thing
  //   	).catch(function(err) {
		//	console.error(err);
		// });



  }]);
