angular.module('eatSafeApp').service('eatSafeService', ['config','api','$http', '$q', EatSafeService]);

function EatSafeService(config, api, $http,$q) {
		
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
	
}