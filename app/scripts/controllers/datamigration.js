'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:DatamigrationCtrl
 * @description
 * # DatamigrationCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('DatamigrationCtrl', function ($scope, Ref, $firebaseArray, $firebaseObject, Auth) {

	var uid = Auth.$getAuth().uid;


	var newArrQuery = Ref.child('userRecipientOrgSets/'+uid).limitToLast(100); // other formats could look like userGallerySets
	var oldArrQuery = Ref.child(uid+'/organizations').limitToLast(100); // other formats could look like userGallerySets

	
	var oldArr = $firebaseArray(oldArrQuery);
	oldArr.$loaded() 	//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
	  .then(function(loadedOldArr) {
		if ( loadedOldArr === oldArr ){



			var newArr = $firebaseArray(newArrQuery);
			newArr.$loaded() 	//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
			  .then(function(loadedNewArr) {
				if ( loadedNewArr === newArr ){

					if ( ('array' == typeof newArr ) && ( 0 == newArr.length ) ) {

						for (var i = oldArr.length - 1; i >= 0; i--) {
							newArr.$add(oldArr[i]);
						};

						alert('array copied');
						
					} else {
						alert('new array already has elements; copying cancelled');
					}
					
				}
			  })
			  .catch(function(error) {
				console.log("Error:", error);
			  });
							





			
		}
	  })
	  .catch(function(error) {
		console.log("Error:", error);
	  });


  });
