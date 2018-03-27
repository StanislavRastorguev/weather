angular.module('weatherApp', ['ui.router'])
  .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'mainPage/mainPage.template.html',
        controller: 'mainCtrl',
        controllerAs: 'vm'
      });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
