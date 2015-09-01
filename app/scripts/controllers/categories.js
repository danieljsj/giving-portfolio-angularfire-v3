'use strict';

/**
 * @ngdoc function
 * @name gpApp.controller:CategoriesCtrl
 * @description
 * # CategoriesCtrl
 * Controller of the gpApp
 */
angular.module('gpApp')
  .controller('CategoriesCtrl', ['$scope', 'Ref', 'taxonomization', 
  	                    function ($scope,   Ref,   taxn) {

	// taxonomization.taxTree.$bindTo($scope, 'taxTree', true);
	// $scope.taxn = taxonomization;

	$scope.taxn = taxn;
    window.taxn = taxn;
    taxn.taxTree.$bindTo($scope, 'taxTree', true );

	// taxTree.taxonomies = [{name: "tax1"}];
	// console.log('taxTree immediately after `taxTree.taxonomies = [{name: "tax1"}];`',taxTree);
	// // wow. it just doesn't even let that new array in there...
	// // AHA! it IS letting it in! Just for a teeny weeny second; it's showing up in the instantaneous text-summary of the object, but by the time Chrome can make the dropdown, it's GONE.

	// taxTree.taxonomies = "foo";
	// console.log('taxTree immediately after `taxTree.taxonomies = "foo";`',taxTree);
	// // wait a blooming second here... it's not even accepting "foo"?

  }]);