angular.module('eatSafeApp').service('eatSafeService', ['config','api','$http', '$q', EatSafeService]);

function EatSafeService(config, api, $http,$q) {
		
	this.saveCsvData = function(csvData, type){
		var def = $q.defer();
	    $http.post(api.saveEstablishment, csvData).success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
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
    
    this.generatedMapData=function(csvDbMap){
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