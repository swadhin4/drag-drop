//angular.module('starter.controllers', [])

eatSafeModule.controller('LoginController', 
['$scope', '$state','$rootScope', LoginController]);
function LoginController($scope,$state,$rootScope) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    console.log('LoginController');
    var mobileView = 992;
    $scope.user={};
	var loggedInuser =null;
	$scope.validateUser=function(form){
		if(form.$valid){
			console.log("logged in");
			var user =  $scope.user;
			console.log(user);
			$scope.displayRestuarantFeatures(user);
		}
	};
    
	$scope.displayRestuarantFeatures=function(user){
		$.jStorage.set('loggedInUser', user);
		$state.go('est', $state.current, {}, {reload: true});
	}	
    
    //-- Settings Codes---
    $scope.navBarEnabled =true;


    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {

    });

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