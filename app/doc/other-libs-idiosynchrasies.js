
//////// spectrum-ng


 $scope.palette = $scope.colorPickerOptions.palette; // redundant... and, I don't think it was even working. I had to include the pallate in the actual options/service of the thing; neither putting it in $scope or in < ... pallate=" "></...> did the trick.



//////// console.log

// console lags! look; the result is the same thing... wait... the fbobs,arr's have built in loaded properties!!! well, whatever. I like mine better, as A) i'm not sure that the fbArray has one for loaded=false. maybe they don't get that. oh... they only get it when it's true. so yeah... I don't need to go crate my own parallel system.
portfolio.js:41 taxn.$loaded()... result:  FirebaseObject {$$conf: Object, $id: "simplelogin:1", $priority: null, loaded: true, taxonomies: Object}
portfolio.js:41 loaded taxnThing same as taxnThing?:  true
portfolio.js:49 orgs.loaded? : true
portfolio.js:50 budget.loaded? : false
portfolio.js:51 taxn.loaded? : false