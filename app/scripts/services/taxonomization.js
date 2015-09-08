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

    this.taxTree = $firebaseObject(query); 
        // taxTree is the fbOb, taxn has methods and taxTree.
        // at this time, taxTree has browser/fb-knownthings like User, but doesn't know any fb data yet.

    this.loaded = false;
    this.taxTree.$loaded(function(loadedTaxTree){
        loadedTaxTree.loaded = true;
        initialUpdate(loadedTaxTree);
    });

    function initialUpdate(loadedTaxTree){

        // console.log('this at initialUpdate:',this);                                              // undefined
        // console.log('loadedTaxTree at initialUpdate: ',loadedTaxTree);                           // FirebaseObject {$$conf: Object, $id: "simplelogin:1", $priority: null, taxonomies: Object}
        // console.log('loadedTaxTree.taxonomies at initialUpdate: ',loadedTaxTree.taxonomies);     // Object {1206930495565757: Object, 5446529400534929: Object, 8019094473915175: Object, 9726771261310206: Object}

        var taxs = loadedTaxTree.taxonomies;

        if (! taxs){

            taxs = {};
            var newTax;

            newTax = {name: "Locality", terms: {} };
            newTax.terms[randId()] = {id:lastId(), name: "Local"},
            newTax.terms[randId()] = {id:lastId(), name: "State"},
            newTax.terms[randId()] = {id:lastId(), name: "National"},
            newTax.terms[randId()] = {id:lastId(), name: "International"}
            taxs[randId()] = newTax;
            taxs[lastId()].id = lastId();

            newTax = {name: "Modality", terms: {} };
            newTax.terms[randId()] = {id:lastId(), name: "Relief"},
            newTax.terms[randId()] = {id:lastId(), name: "Advocacy"},
            newTax.terms[randId()] = {id:lastId(), name: "Development"},
            newTax.terms[randId()] = {id:lastId(), name: "Education"},
            newTax.terms[randId()] = {id:lastId(), name: "Support"},
            taxs[randId()] = newTax;
            taxs[lastId()].id = lastId();

            loadedTaxTree.taxonomies = taxs;
        }

        // assuring that all taxs and terms in dictionaries have id properties that match their dictionary index.
        for (var taxId in taxs){
            taxs[taxId].id = taxId;
            for (var termId in taxs.terms){
                taxs.terms[termId].id = termId;
            }
        }

        // lets see if it works from in here...
        loadedTaxTree.$save(); // WHOAH! this was being necessary to load stuff into page... and $scope.$apply() wasn't cutting it!

    }

    this.addNewTax = function(){
        var newTerms = {};
        newTerms[randId()] = {id:lastId(), name:""}; 
        this.taxTree.taxonomies[randId()] = {id:lastId(), name:"", terms:newTerms };       // WHOAH! you have to use $scope.thing[key] (vs this.thing[key]), or the scope wouldn't see the change! Weird because down below, the addTerm changes are seen by $scope/$digest... heh... I bet i could do a $save on it :)
        // nope: $scope.$digest(); // $apply already in progress, because ng-click triggers it.
        this.taxTree.$save(); // lol. not sure why, as noted above, this is needed for adding the prop to the top-level $scope item (tax), but not needed for adding deeper items (terms)....
        console.log(this.taxTree);
    };
    this.addNewTermTo = function(tax){
        tax.terms[randId()] = {name:""};
                                                                                    // nope: $scope.$digest(); // $apply already in progress, because ng-click triggers it.
    };

  });