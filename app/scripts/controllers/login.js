'use strict';
/**
 * @ngdoc function
 * @name gpApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('gpApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      Auth.$authWithOAuthPopup(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      Auth.$authAnonymously({rememberMe: true}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUser({email: email, password: pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
          })
          .then(createProfile)
          .then(redirect, showError);
      }

      function createProfile(user) {
        var ref = Ref.child('users/'+user.uid), def = $q.defer(); //angularfire issue: Ref.child expects one param.
        ref.set({email: email, name: firstPartOfEmail(email)}, function(err) {
          $timeout(function() {
            console.log("err: ",err);
            if( err && Object.keys(err).length ) { // PROBLEM: This is firing even on an error of {}. Okay, interesting. So, the error only happened when I tried to pull the ref of /users , userId... rather than /users/userId... expects 1 param, not 2... but why was that error showing up here? AND why was it coming back as empty? {}
              def.reject(err);
            }
            }
            else {
              def.resolve(ref);
            }
          });
        });
        return def.promise;
      }
    };

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

  

    function redirect() {
      $location.path('/portfolio');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
