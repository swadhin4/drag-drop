var testAPP = angular.module("testAPP", ['ui.bootstrap', 'angularUtils.directives.dirPagination']);

testAPP.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});



/*testAPP.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
			.state('files', {
                url: '/jobs',
                templateUrl: 'templates/job-dashboard.html'
            });
           
    }
]);*/