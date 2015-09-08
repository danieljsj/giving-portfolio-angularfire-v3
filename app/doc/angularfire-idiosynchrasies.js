
/////////
// in fbArr: 
// 
	orgs.$loaded() 	//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
	  .then(function(loadedOrgs) {
		if (loadedOrgs === orgs ){ // TRUE!
				// related? https://github.com/firebase/angularfire/issues/608
	...
// in fbObj: ... same sort of thing was false.





//////// angular.extend not great for adding methods?

for (var methodName in orgsMethods){
	orgs[methodName] = orgsMethods[methodName].bind(orgs);
}				
// angular.extend(orgs,OrgsCollectionFuncs);   // looks like I decided not to go with angular.extend, I guess... // under angular.extend, the resulting `this` for the funcs, I believe, was pointing to the "var OrgsCollectionFuncs = {}" object; so not going to do the extending here.



//// ummmm....... some fbOb, in my case, taxonomization, automatically get a loaded variable attribute placed on them... but not all...
portfolio.js:31 result:  FirebaseObject {$$conf: Object, $id: "simplelogin:1", $priority: null, fixedGivingAmount: 10000, fixedGivingTimeframe: "yearly"…}$$conf: Object$id: "simplelogin:1"$priority: nullfixedGivingAmount: 10000fixedGivingTimeframe: "yearly"givingBasis: "income"incomeAmount: 100000incomeBeforeOrAfterTaxes: "after"incomeGivingPercentage: 10incomeTaxPercentage: 30incomeTimeframe: "yearly"__proto__: Object
portfolio.js:31 result is same as budget.fbObj: true
portfolio.js:37 orgs.loaded? : undefined
portfolio.js:38 budget.fbObj.loaded? : undefined
portfolio.js:39 taxn.taxTree.loaded? : undefined
portfolio.js:30 result:  [Object, Object, Object, Object, Object]0: Object1: Object2: Object3: Object4: Object$$added: bound ()$$error: bound ()$$getKey: bound ()$$moved: bound ()$$notify: bound ()$$process: bound ()$$removed: bound ()$$updated: bound ()$add: bound ()$destroy: bound ()$getRecord: bound ()$indexFor: bound ()$keyAt: bound ()$loaded: bound ()$ref: bound ()$remove: bound ()$save: bound ()$watch: bound ()addOrg: bound ()applyChangedMonthly: bound ()applyChangedPercentage: bound ()applyChangedYearly: bound ()applyOrgPortion: bound ()getOrg: bound ()getOrgId: bound ()length: 5percentBudgetUsed: bound ()pushOrgState: bound ()reapplyBudget: bound ()removeSelectedOrg: bound ()saveOrgs: bound ()saveOrgsChanges: bound ()scopeDigest: ()selectNext: bound ()selectOrg: bound ()selectPrev: bound ()shiftSelection: bound ()__proto__: Array[0]
portfolio.js:30 result is same as orgs        : true
portfolio.js:37 orgs.loaded? : undefined
portfolio.js:38 budget.fbObj.loaded? : undefined
portfolio.js:39 taxn.taxTree.loaded? : undefined
portfolio.js:32 result:  FirebaseObject {$$conf: Object, $id: "simplelogin:1", $priority: null, loaded: true, taxonomies: Object}
portfolio.js:32 result is same as taxn.taxTree: true
portfolio.js:37 orgs.loaded? : undefined
portfolio.js:38 budget.fbObj.loaded? : undefined
portfolio.js:39 taxn.taxTree.loaded? : true




REALLY SLOW LOADING THING

    // if (0 < orgs.length) orgs.selectNext(); // is nice for dev, but as of Sep1'15 this loads too fast and is in before the cats come in. ... and in fact, they STILL haven't come in by the time I'm clicking around... that's REALLY slow. AND they come in piece by piece! WTDEUCE?