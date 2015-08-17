'use strict';

/**
 * @ngdoc service
 * @name gpApp.recipients
 * @description
 * # recipients
 * Service in the gpApp.
 */
angular.module('gpApp')
  .service('recipients', ['Ref', '$firebaseArray', function (Ref, $firebaseArray) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    return function(){
    	console.log('STUFF IN recipients:', Ref, $firebaseArray );
    }
  }]);
