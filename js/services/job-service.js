angular.module('testAPP').service('jobService', ['$http', '$q', JobService]);

function JobService($http,$q) {
		
	this.getFiles = function(){
		var def = $q.defer();
		var url = "";
       $http.get(url)
		.success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
		return def.promise;
    };
	
	this.processJobFile = function(fileName){
		var def = $q.defer();
		var url = "";
        $http.get(url)
		.success(function(data) {
			def.resolve(data);
		})
		.error(function(data) {
			console.log(data)
			def.reject(data);
		});
		return def.promise;
    };
	
}