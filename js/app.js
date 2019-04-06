var eatSafeModule = angular.module("eatSafeApp", ['ui.bootstrap','ui.router', 'angularUtils.directives.dirPagination']);

eatSafeModule.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});


eatSafeModule.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/login.html'
            })
            /*.state('sidemenu',{
			  url:'/sidemenu',
			  //abstract: true,
			  templateUrl:'templates/sidemenu.html',
			  controller:'SidemenuController'
			})
			 .state('sidemenu.establishment', {
			  url: '/establishment',
			  views: {
			    'menuContent': {
			      templateUrl: 'templates/establishment.html',
			      controller: 'EstablishmentController'
			    }
			  }
			 })*/
            .state('est', {
                url: '/est',
                templateUrl: 'templates/establishment.html'
            })
            .state('inspection', {
                url: '/inspection',
                templateUrl: 'templates/inspection-form.html'
            });
    }
]);