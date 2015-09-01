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


    var uid = Auth.$getAuth().uid;

    var query = Ref.child('userTaxonomizationTrees/'+uid);

    this.taxTree = $firebaseObject(query); // has browser-known things like User, but doesn't know any fb data yet.

    this.taxTree.$loaded(function(loadedTaxTree){
        init(loadedTaxTree);
    });

    function init(loadedTaxTree){

        console.log('this at init:',this); //undefined
        console.log('loadedTaxTree at init: ',loadedTaxTree.taxonomies);
        console.log('loadedTaxTree.taxonomies at init: ',loadedTaxTree.taxonomies);

        if (! loadedTaxTree.taxonomies){

            loadedTaxTree.taxonomies = {};
            var newTax;

            newTax = {name: "Locality", terms: {} };
            newTax.terms[randId()] = {name: "Local"},
            newTax.terms[randId()] = {name: "State"},
            newTax.terms[randId()] = {name: "National"},
            newTax.terms[randId()] = {name: "International"}
            loadedTaxTree.taxonomies[randId()] = newTax;

            newTax = {name: "Modality", terms: {} };
            newTax.terms[randId()] = {name: "Relief"},
            newTax.terms[randId()] = {name: "Advocacy"},
            newTax.terms[randId()] = {name: "Development"},
            newTax.terms[randId()] = {name: "Education"},
            newTax.terms[randId()] = {name: "Support"},
            loadedTaxTree.taxonomies[randId()] = newTax;

        }

        // lets see if it works from in here...
        loadedTaxTree.$save(); // WHOAH! this was being necessary to load stuff into page... and $scope.$apply() wasn't cutting it!

    }

    this.addNewTax = function(){
        var newTerms = {};
        newTerms[randId()] = {name:""}; 
        this.taxTree.taxonomies[randId()] = {name:"", terms:newTerms };       // WHOAH! you have to use $scope.thing[key] (vs this.thing[key]), or the scope wouldn't see the change! Weird because down below, the addTerm changes are seen by $scope/$digest... heh... I bet i could do a $save on it :)
        // nope: $scope.$digest(); // $apply already in progress, because ng-click triggers it.
        this.taxTree.$save(); // lol. not sure why, as noted above, this is needed for adding the prop to the top-level $scope item (tax), but not needed for adding deeper items (terms)....
        console.log(this.taxTree);
    };
    this.addNewTermTo = function(tax){
        tax.terms[randId()] = {name:""};
                                                                                    // nope: $scope.$digest(); // $apply already in progress, because ng-click triggers it.
    };

  });