'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipientOrgs
 * @description
 * # recipientOrgs
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipientOrgs', ['Auth', 'Ref', '$firebaseArray', 'recipientOrgsMethods',    // when using 'user', Unknown provider: userProvider
                   function ( Auth,   Ref,   $firebaseArray,   orgsMethods ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var uid = Auth.$getAuth().uid;

	var query = Ref.child('userRecipientOrgSets/'+uid).limitToLast(100);
	
	var orgs = $firebaseArray(query);
	
	for (var methodName in orgsMethods){
		orgs[methodName] = orgsMethods[methodName].bind(orgs);
	}

	orgs.pushOrgStateActions = [];			

	orgs.loaded = false;
	orgs.$loaded() 	//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
	  .then(function(loadedOrgs) {
		if (loadedOrgs === orgs ){ // weird that this was equal in fbArr but not fbObj
			orgs.loaded = true;
			// angular.extend(orgs,OrgsCollectionFuncs);   // decided not to go with angular.extend, I guess... // under angular.extend, the resulting `this` for the funcs, I believe, was pointing to the "var OrgsCollectionFuncs = {}" object; so not going to do the extending here.

			// ctrlSaveToScopeOrgsThenInit(orgs); // this was for when I was pulling them in weird-wise into the controller"
		}
	  })
	  .catch(function(error) {
		console.log("Error:", error);
	  });

	return orgs;




		// orgsFbArray.$loaded().catch(function(err) { console.error(err); });
		
		// not even sure I need that ..
		// 
		// 
  //   	orgsFbArray.$loaded( // $   // $loaded() 	Returns a promise which resolves after the initial records have been downloaded from our database. This is only called once and should be used with care. See Extending the Services for more ways to hook into server events. 
  //   		asOrgsCollection.bind(orgsFbArray) // if I don't mind letting my controller know about the service, I can just have the controller do the $loaded(asOrgsCollection) thing
  //   	).catch(function(err) {
		//	console.error(err);
		// });
		// 
  }]);