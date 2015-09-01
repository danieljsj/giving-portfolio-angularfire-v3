'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:SandboxCtrl
 * @description
 * # SandboxCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('SandboxCtrl', function ($scope, Ref, /*taxonomization*/ $firebaseObject, Auth) {

	// taxonomization.taxTree.$bindTo($scope, 'taxTree', true);
	// $scope.taxn = taxonomization;

    var uid = Auth.$getAuth().uid;

    var query = Ref.child('userTaxonomizationTrees/'+uid);

    var taxTreeVar = $firebaseObject(query);

    console.log('taxTreeVar.taxonomies: ',taxTreeVar.taxonomies);

    // if (! taxTreeVar.taxonomies){

	    taxTreeVar.taxonomies = {
	    	tax1: {
	    		name: "Locality",
	    		terms: [
	    			{name: "Local"},
	    			{name: "State"},
	    			{name: "National"},
	    			{name: "International"}
	    		]
	    	},
	    	tax2: {
	    		name: "Modality",
	    		terms: [
	    			{name: "Relief"},
	    			{name: "Advocacy"},
	    			{name: "Development"}
	    		]
	    	}
	    };

    // }

    taxTreeVar.$save(); // DEV... wait... whoah... this was being necessary! probably just for its $apply();




    // $scope.taxTreeVar = taxTreeVar;

    taxTreeVar.$bindTo($scope, 'taxTree' );

    window.taxTreeVar = taxTreeVar;

	taxTreeVar.taxonomies = [{name: "tax1"}];
	console.log('taxTreeVar immediately after `taxTreeVar.taxonomies = [{name: "tax1"}];`',taxTreeVar);
	// wow. it just doesn't even let that new array in there...
	// AHA! it IS letting it in! Just for a teeny weeny second; it's showing up in the instantaneous text-summary of the object, but by the time Chrome can make the dropdown, it's GONE.

	taxTreeVar.taxonomies = "foo";
	console.log('taxTreeVar immediately after `taxTreeVar.taxonomies = "foo";`',taxTreeVar);
	// wait a blooming second here... it's not even accepting "foo"?


    $scope.addTax = function(){
		taxTreeVar.taxonomies.push({name:"New Taxonomy"});
	};

    $scope.addTermTo = function(tax){
		tax.terms.push({name:"New Term"});
	};

  });
