'use strict';

/**
 * @ngdoc service
 * @name gpApp.taxonomization
 * @description
 * # taxonomization
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('taxonomization', function (Auth, Ref, $firebaseArray) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    // "taxs" is short of "taxonomies"

	var taxTermsTree = [];

    var uid = Auth.$getAuth().uid;

    var taxsQuery = Ref.child('userTaxonomySets/'+uid);

    var taxs = new $firebaseArray(taxsQuery)
    	.$loaded()
    	.then(function(loadedTaxs){
    		if ( loadedTaxs == taxs ){
    			console.log(taxs);
    			// for (var i = 0; i < taxs.length; i++) {
    				
    			// 	var termsQuery = Ref.child('userTaxTermsTrees/'+uid+'/'+taxs[i].$id); // api-url structure here is feeling a bit weird... would prefer user/:uid/taxonomies/:taxId/terms .  however, because in firebase, you always get all children of a query, it makes sense to flatten out the data, i.e. being a bit more relational than you would in mongo.


    			// };
    		}
    	});


    	// SOMEWHERE:
    	var addTaxonomy = function(taxName){
    		taxs.$add({name: taxName});

    	};


  });