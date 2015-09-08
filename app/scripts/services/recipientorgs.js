'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipientOrgs
 * @description
 * # recipientOrgs
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipientOrgs', ['Auth', 'Ref', '$firebaseArray',    // when using 'user', Unknown provider: userProvider
                   function ( Auth,   Ref,   $firebaseArray ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var uid = Auth.$getAuth().uid;

	var query = Ref.child('userRecipientOrgSets/'+uid).limitToLast(100);
	
	var orgs = $firebaseArray(query);

	return 

  }]);
