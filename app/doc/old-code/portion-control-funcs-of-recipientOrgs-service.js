		// FIXED BUDGET: (based on 'portion')
			// (THESE ONES ARE BEING DELETED FROM THE SERVICE)
		
			// let's be real; this was nice for prelim. chart-building, but nobody is going to want to use 'portion', at least not until distributed giving is automated by the system, because people's real giving context is this: auto-deposits set up at a variety of recipients. they're not going to want to go change all their giving-vals to some crazy new decimal just cuz they added an org. Now. It's fine to keep this around if desired; keep some commented-out stuff at the bottom, or off in another file, because it may be nice to enable switching between modes, as perhaps some people would want to do portion. BUT -- switching between them quickly will be non-compelling, because eithe A) the amounts would jump when reverting back to old portions, or B) the portions will be calculated, and thus will be crazy decimals, losing the niceness of "1 part OrgA, 2 parts OrgB". so yup, for now I'm going to bury the "portion" features. ALSO BECAUSE if desired, we can replicate the "portion" advantage, namely the ability to auto-scale all other giving to make room for new giving, by using a "normalize" button, or a "nomralize > scale all giving" and "normalize > scale only percent-based giving" feature.
		
		incrementOrgPortion: function(org, delta){
			if ( 0 < delta || 0 <= org.portion + delta ) {  
					org.portion += delta;
					this.pushOrgState(org);
			} else {
			 	alert("Giving for an organization cannot be less than 0!")
			}
		},

		getOrgGivingCoefficient: function(org){
			var totalPortions = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				totalPortions += this[i].portion;
			};
			return ( org.portion / totalPortions );
		},



		// MOSTLY FIXED BUDGET: 
			// (!!!THIS ONE IS BEING KEPT AND EDITED IN THE SERVICE !!!!)
		
		pushOrgState: function(org){ // should be: pushOrgPortion()
			if (this.basis = 'portions'){
				console.log(org.portion);
				// org.marker
				// org.marker = { fillColor: org.color } // highcharts
				if ( 
					( ! ( undefined === org.portion ) ) 
					&&
					( ! ( null === org.portion ) ) 
					&& 
					( 0 <= org.portion ) 
				) {
					org.y = org.portion;
					this.$save(org);
				}
			}
			// if ( true || this.givingBasis = 'amountsAndPercentages' ){
			// 	org.y = org.monthly;
			// }
		},
