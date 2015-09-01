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

  	function randId(){return Math.round((Math.random()*.9+0.1) * 10000000000000000)}

	// taxonomization.taxTree.$bindTo($scope, 'taxTree', true);
	// $scope.taxn = taxonomization;

    var uid = Auth.$getAuth().uid;

    var query = Ref.child('userTaxonomizationTrees/'+uid);

    var taxTreeInitial = $firebaseObject(query); // has browser-known things like User, but doesn't know any fb data yet.
    var taxTree = {};

    taxTreeInitial.$loaded(function(loadedTaxTree){
    	taxTree = loadedTaxTree;
    	console.log("TAX TREE LOADED");
    	init();
    });

    function init(){

	    console.log('taxTree at init: ',taxTree.taxonomies);
	    console.log('taxTree.taxonomies at init: ',taxTree.taxonomies);

	    if (! taxTree.taxonomies){

		    taxTree.taxonomies = {};
		    var newTax;
		    
		    newTax = {name: "Locality", terms: {} };
			newTax.terms[randId()] = {name: "Local"},
			newTax.terms[randId()] = {name: "State"},
			newTax.terms[randId()] = {name: "National"},
			newTax.terms[randId()] = {name: "International"}
			taxTree.taxonomies[randId()] = newTax;

			newTax = {name: "Modality", terms: {} };
			newTax.terms[randId()] = {name: "Relief"},
			newTax.terms[randId()] = {name: "Advocacy"},
			newTax.terms[randId()] = {name: "Development"},
			newTax.terms[randId()] = {name: "Education"},
			newTax.terms[randId()] = {name: "Support"},
			taxTree.taxonomies[randId()] = newTax;

	    }

	    taxTree.$save(); // WHOAH! this was being necessary to load stuff into page... and $scope.$apply() wasn't cutting it!


	    // $scope.taxTree = taxTree;

	    taxTree.$bindTo($scope, 'taxTree', true );

	    window.taxTree = taxTree;

		// taxTree.taxonomies = [{name: "tax1"}];
		// console.log('taxTree immediately after `taxTree.taxonomies = [{name: "tax1"}];`',taxTree);
		// // wow. it just doesn't even let that new array in there...
		// // AHA! it IS letting it in! Just for a teeny weeny second; it's showing up in the instantaneous text-summary of the object, but by the time Chrome can make the dropdown, it's GONE.

		// taxTree.taxonomies = "foo";
		// console.log('taxTree immediately after `taxTree.taxonomies = "foo";`',taxTree);
		// // wait a blooming second here... it's not even accepting "foo"?
    }


    $scope.addTax = function(){
		taxTree.taxonomies[randId()] = {name:"New Taxonomy"};
		$scope.$digest();
	};

    $scope.addTermTo = function(tax){
		tax.terms[randId()] = {name:"New Term"};
		$scope.$digest();
	};

  });
