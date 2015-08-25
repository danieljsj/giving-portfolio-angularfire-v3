'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipientOrgs
 * @description
 * # recipientOrgs
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipientOrgs', ['Ref', '$firebaseArray', 
  				function ( Ref,   $firebaseArray) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    

	var orgCounter = 1;

	var orgsFuncs = {

		normalize: function() {
			// TODO: set portions to total 100, rounded by greatest remainder
		},

		addOrg: function(){

			// this.$add({portion:0, name:''}).then(this.selectOrg);

			this.$add({portion:1, name: "Org #" + orgCounter++ }).then(function(ref) {
			  // var id = ref.key();
			  // console.log("added record with id: "); console.log( id );
			  // console.log("org's index in array: "); console.log( this.$indexFor(id) );
			  // // this.selectOrg(id);
			  // console.log("ref: "); console.log(ref);
			  
			  // note: "then" is when FB has saved the record, I believe, NOT when it's present in the fbArr; sometimes it's not, as comments below indicate.
			  this.selectOrg(ref);
			}.bind(this)); // is bind(this) necessary? perhaps then() is a good wrapper, and does the binding, and it won't just be window.

		},
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
		incrementOrgPortion: function(org, delta){
			// TODO: if ( 0 <= org.portion + delta ) {  
			org.portion += delta;
			org.y = org.portion;
			// } else {
			// 	alert("Giving for an organization cannot be less than 0!")
			// }
			// anything else? i don't think so, because our deep-watch will trigger an update for the chart. and yes, we even want the chart to update with each keystroke in the name field, because that allows the highchart slice names to update realtime.
			this.$save(org);
			console.log(this);
			// this.scopeDigest(); // error: $apply already in progress... 
		},
		getOrgGivingCoefficient: function(org){
			var totalPortions = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				totalPortions += this[i].portion;
			};
			return ( org.portion / totalPortions );
		},
		saveOrgsChanges: function(newOrgs, oldOrgs){ // this really needs to be in orgsmanager!
			for (var i = newOrgs.length - 1; i >= 0; i--) {
				// if (! angular.equals( newOrgs[i], oldOrgs.getOrg( newOrgs[i].id ) ) ){
					newOrgs.$save(newOrgs[i]);
				// }
			}
		},
		removeSelectedOrg: function(){
			// var index = this.indexOf(this.selectedOrg);
			this.$remove(this.selectedOrg);
			this.selectOrg(false);
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
