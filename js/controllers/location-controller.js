/**
 * Master Controller
 */

eatSafeModule.controller('LocationController', ['$scope', '$state','$rootScope','eatSafeService', LocationController]);

function LocationController($scope,$state,$rootScope,eatSafeService) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    console.log('LocationController');
    var mobileView = 992;
    $scope.navBarEnabled =true;
   $scope.mylocation="";

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {

    });

    $scope.getLocation=function() {
    	  if (navigator.geolocation) {
    	    navigator.geolocation.getCurrentPosition($scope.showPosition);
    	  } else { 
    	    console.log("Geolocation is not supported by this browser.");
    	  }
    	}
    
    $scope.showPosition=function(position) {
    	eatSafeService.getMyLocation(position.coords.latitude,position.coords.longitude).then(function(response){
    		console.log(response);
    		  if(response.status.code==200 && response.results.length>0) 
    		  $scope.mylocation =response.results[0].formatted;
    	},function(response){
    		console.log(response);
    	});
    }
    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

   
}