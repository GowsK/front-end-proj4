angular 
  .module('space_shooter', ['angular-jwt', 'ngResource', 'ui.router'])
  .constant('API', 'http://obscure-sierra-8448.herokuapp.com/api')
  .config(MainRouter)
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor')
  });

  function MainRouter($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "home.html"
      })
      .state('profile', {
        url: "/profile",
        templateUrl: "profile.html"
      })
      .state('leaderboard', {
        url: "/leaderboard",
        templateUrl: "leaderboard.html"
      });



      $urlRouterProvider.otherwise("/");

  }

