var eatSafeModule = angular.module('eatSafeApp');
eatSafeModule.service('eatSafeService', ['config','api','$http', '$q', EatSafeService]);

function EatSafeService(config, api, $http,$q) {
	 var transform = function(data) {
	        return $.param(data);
	    };
	this.saveCsvData = function(csvData, type){
		console.log("Inside Save CSV Data "+ new Date())
		var def = $q.defer();
	    $http.post(api.saveEstablishment, csvData).success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
	    console.log("Exit Save CSV Data "+ new Date())
		return def.promise;
    };
    
    this.getDbColumns = function(type){
		var def = $q.defer();
	    $http.get(api.getDBColumnList).success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
		return def.promise;
    };
    
    this.saveMapData=function(csvDbMap){
    	var def = $q.defer();
    	$http.post(api.saveMapData, csvDbMap).success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
		return def.promise;
    }
    
    this.getRestaurantData=function(dataType, stateCode){
    	var def = $q.defer();
    	$http.get(api.getRestaurantData+"/"+dataType+"/"+stateCode).success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
		return def.promise;
    }
    
    
    this.getInspectionRules=function(){
    	var rules=[{
    		name:"Demonstration of Knowledge",
    		values:[
    				  {
    					  index:1,
    					  row:"Certification by accredited program, compliance with Code,or correct responses"
    				  }  
    		     ]
    		},
    		{
    		 name:"Employee Health",
    		 values:[
    				  {
    					  index:2,
    					  row:"Management awareness; policy present"
    				  },
    				  {
    					  index:3,
    					  row:"Proper use of reporting; restriction & exclusion"
    				  },
    					
    		    ]
    		},   
    		{   
    		name:"Good Hygienic Practices",
    		values:[
    				  {
    					  index:4,
    					  row:"Proper eating, tasting, drinking, or tobacco use"
    				  },
    				  {
    					  index:5,
    					  row:"No discharge from eyes, nose, and mouth"
    				  },
    		]
    		},
    		{
    		name:"Preventing Contamination by Hazards",
    		values:[
    				  {
    					  index:6,
    					  row:"Hands clean & properly washed"
    				  },
    				  {
    					  index:7,
    					  row:"No bare hand contact with RTE foods or approved alternate method properly followed"
    				  },
    				  {
    					  index:8,
    					  row:"Adequate handwashing facilities supplied & accessible"
    				  },
    		    ]
    		},
    		{
    		name:"Approved Source",
    		values:[
    				  {
    					  index:9,
    					  row:"Food obtained from approved source"
    				  },
    				  {
    					  index:10,
    					  row:"Food received at proper temperature"
    				  },
    				  {
    					  index:11,
    					  row:"Food in good condition, safe, & unadulterated"
    				  },
    				  {
    					  index:12,
    					  row:"Required records available: shellstock tags, parasite destruction"
    				  }
    		    ]
    		 },
    		 {   
    		name:"Protection From Contamination",
    		values:[
    				  {
    					  index:13,
    					  row:"Food separated & protected"
    				  },
    				  {
    					  index:14,
    					  row:"Food contact surfaces: cleaned & sanitized"
    				  },
    				  {
    					  index:15,
    					  row:"Proper disposition of returned, previously served,reconditioned, & unsafe food"
    				  }
    		    ]	
    		},{
        		name:"Potentially Hazardous Food Time/Temperature",
        		values:[
        				  {
        					  index:16,
        					  row:"Proper cooking time & temperature"
        				  }  
        		     ]
        		},
        		{
        		 name:"Employee Health",
        		 values:[
        				  {
        					  index:17,
        					  row:"Proper reheating procedures for hot holding"
        				  },
        				  {
        					  index:18,
        					  row:"Proper cooling time & temperature"
        				  },
        				  {
        					  index:19,
        					  row:"Proper hot holding temperature"
        				  },{
        					  index:20,
        					  row:"Proper cold holding temperature"
        				  },{
        					  index:21,
        					  row:"Proper date marking & disposition"
        				  },{
        					  index:22,
        					  row:"Time as a public health control; procedures & record"
        				  },
        		    ]
        		},   
        		{   
        		name:"Consumer Advisory",
        		values:[
        				  {
        					  index:23,
        					  row:"Consumer advisory provided for raw or undercooked foods"
        				  },
        				  
        		]
        		},
        		{
        		name:"Highly Susceptible Population",
        		values:[
        				  {
        					  index:24,
        					  row:"Pasteurized foods used; prohibited foods not offered"
        				  },
        				 
        		    ]
        		},
        		{
        		name:"Chemical",
        		values:[
        				  {
        					  index:25,
        					  row:"Food additives: approved & properly used"
        				  },
        				  {
        					  index:26,
        					  row:"Toxic substances properly identified, stored & used"
        				  }
        		    ]
        		 },
        		 {   
        		name:"Conformance with Approved Procedure",
        		values:[
        				  {
        					  index:27,
        					  row:"Compliance with variance, specialized process, & HACCP plan"
        				  }
        		    ]	
        		},{
            		name:"Safe Food and Water",
            		values:[
            				  {
            					  index:28,
            					  row:"Pasteurized eggs used where required"
            				  },
            				  {
            					  index:29,
            					  row:"Water & ice from approved source"
            				  },
            				  {
            					  index:30,
            					  row:"Variance obtained for specialized processing methods"
            				  }  
            		     ]
            		},
            		{
            		 name:"Food Temperature Control",
            		 values:[
            				  {
            					  index:31,
            					  row:"Proper cooling methods used; adequate equipment for temperature control"
            				  },
            				  {
            					  index:32,
            					  row:"Plant food properly cooked for hot holding"
            				  },
            				  {
            					  index:33,
            					  row:"Approved thawing methods used"
            				  },{
            					  index:34,
            					  row:"Thermometer provided & accurate"
            				  }
            		    ]
            		},   
            		{   
            		name:"Food Identification",
            		values:[
            				  {
            					  index:35,
            					  row:"Food properly labeled; original container"
            				  },
            				  
            		]
            		},
            		{
            		name:"Prevention of Food Contamination",
            		values:[
            				   {
            					  index:36,
            					  row:"Insects, rodents & animals not present; no unauthorized persons"
            				  },
            				  {
            					  index:37,
            					  row:"Contamination prevented during food preparation, storage & display"
            				  },
            				  {
            					  index:38,
            					  row:"Personal cleanliness"
            				  },{
            					  index:39,
            					  row:"Wiping cloths: properly used & stored"
            				  },{
            					  index:40,
            					  row:"Washing fruit & vegetables"
            				  }
            				 
            		    ]
            		},{
                		name:"Proper Use of Utensils",
                		values:[
                				  {
                					  index:41,
                					  row:"Inuse utensils: properly stored"
                				  },{
                					  index:42,
                					  row:"Utensils, equipment & linens: properly stored, dried & handled"
                				  },
                				  {
                					  index:43,
                					  row:"Singleuse & singleservice articles: properly stored & used"
                				  },
                				  {
                					  index:44,
                					  row:"Gloves used properly"
                				  } 
                		     ]
                		},
                		{
                		 name:"Utensils, Equipment and Vending",
                		 values:[
                				  {
                					  index:45,
                					  row:"Food & nonfood contact surfaces cleanable, properly designed, constructed, & used"
                				  },
                				  {
                					  index:46,
                					  row:"Warewashing facilities: installed, maintained, & used; test strips"
                				  },
                				  {
                					  index:47,
                					  row:"Nonfood contact surfaces clean"
                				  }
                		    ]
                		},   
                		{   
                		name:"Physical Facilities",
                		values:[
            						{
            							  index:48,
            							  row:"Hot & cold water available; adequate pressure"
            						},
            						{
            							  index:49,
            							  row:"Plumbing installed; proper backflow devices"
            						},
            						{
            							  index:50,
            							  row:"Sewage & waste water properly disposed"
            						},{
            	    					  index:51,
            	    					  row:"Toilet facilities: properly constructed, supplied, & cleaned"
            	    				  },
            	    				  {
            	    					  index:52,
            	    					  row:"Garbage & refuse properly disposed; facilities maintained"
            	    				  },
            	    				  {
            	    					  index:53,
            	    					  row:"Physical facilities installed, maintained, & clean"
            	    				  },{
            	    					  index:54,
            	    					  row:"Adequate ventilation & lighting; designated areas used"
            	    				  }
                				  
                		   ]
                		},
                		{
                		name:"Philadelphia Ordinances",
                		values:[
                				  {
                					  index:55,
                					  row:"Person in Control of premises has not posted 'No Smoking' signs"
                				  },{
                					  index:56,
                					  row:"Philadelphia Ordinances"
                				  },
                				 
                		    ]
                		}]			  
    	var def = $q.defer();
		def.resolve(rules);
		return def.promise;
    }
}