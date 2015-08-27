'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipientOrgs
 * @description
 * # recipientOrgs
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipientOrgs', ['Auth', 'Ref', '$firebaseArray', 'budget',    // when using 'user', Unknown provider: userProvider
                   function ( Auth,   Ref,   $firebaseArray,   budget) {
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

		saveOrgs: function(){
			alert("calling orgs.saveOrgs, this=",this);
			for (var i = this.length - 1; i >= 0; i--) {
				this.$save(this[i]);
			};
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




		// GIVING: 
																				// ( we are using "FIXED GIVING", based on '.yearly', '.monthly', 'percentage' giving (used to be "FIXED BUDGET", based on budget and org.portions) );		
		pushOrgState: function(org){ // should be: pushOrgPortion()
			org.y = org.percentage;
			this.$save(org);
		},
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

	}



	
	this.taxonomies = [ // note: if I can use angular.extend or something other than a funcs-only loop-duper, then I can include this.
		{}
	];





	// I really want to do this async-initialization stuff differently, i.e. have the thing actually return the promise... but I'm not sure if I'll be able to, and I don't want to pick extra fights just yet...

	this.getOrgs = function(ctrlSaveToScopeOrgsThenInit){
    	
		var uid = Auth.$getAuth().uid;

		var query = Ref.child('userRecipientOrgSets/'+uid).limitToLast(100); // other formats could look like userGallerySets

		
		var orgs = $firebaseArray(query);
		orgs.$loaded() 	//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
		  .then(function(loadedOrgs) {
			if (loadedOrgs === orgs ){
				for (var funcName in orgsFuncs){
					orgs[funcName] = orgsFuncs[funcName].bind(orgs);
				}				
				// angular.extend(orgs,OrgsCollectionFuncs);   // decided not to go with angular.extend, I guess... // under angular.extend, the resulting `this` for the funcs, I believe, was pointing to the "var OrgsCollectionFuncs = {}" object; so not going to do the extending here.
				ctrlSaveToScopeOrgsThenInit(orgs);
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
