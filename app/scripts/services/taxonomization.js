'use strict';

/**
 * @ngdoc service
 * @name gpApp.taxonomization
 * @description
 * # taxonomization
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('taxonomization', function (Auth, Ref, $firebaseObject) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    // "taxs" is short of "taxonomies"

    var uid = Auth.$getAuth().uid;

    var query = Ref.child('userTaxonomizationTrees/'+uid);

    return { 
    	taxTree: new $firebaseObject(query),
    	addTax: function(){
    		if ( ! this.taxTree ) { this.taxTree = []; }
    		if ( ! this.taxTree.taxonomies ) { this.taxTree.taxonomies = []; }
    		this.taxTree.taxonomies.push({name:"New Taxonomy"});
    	},
       	addTermTo: function(tax){
    		tax.terms.push({name:"New Term"});
    	}
    };
  });