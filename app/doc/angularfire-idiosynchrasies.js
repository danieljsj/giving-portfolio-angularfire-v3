
/////////
// in fbArr: 
// 
	orgs.$loaded() 	//https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-loaded
	  .then(function(loadedOrgs) {
		if (loadedOrgs === orgs ){ // TRUE!
	...
// in fbObj: ... same sort of thing was false.





//////// angular.extend not great for adding methods?

for (var methodName in orgsMethods){
	orgs[methodName] = orgsMethods[methodName].bind(orgs);
}				
// angular.extend(orgs,OrgsCollectionFuncs);   // looks like I decided not to go with angular.extend, I guess... // under angular.extend, the resulting `this` for the funcs, I believe, was pointing to the "var OrgsCollectionFuncs = {}" object; so not going to do the extending here.





REALLY SLOW LOADING THING

    // if (0 < orgs.length) orgs.selectNext(); // is nice for dev, but as of Sep1'15 this loads too fast and is in before the cats come in. ... and in fact, they STILL haven't come in by the time I'm clicking around... that's REALLY slow. AND they come in piece by piece! WTDEUCE?