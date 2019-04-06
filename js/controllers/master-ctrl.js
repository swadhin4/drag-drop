/**
 * Master Controller
 */

eatSafeModule.controller('MasterCtrl', ['$scope', '$state','$rootScope', MasterCtrl]);

function MasterCtrl($scope,$state,$rootScope) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    console.log('MasterCtrl');
    var mobileView = 992;
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