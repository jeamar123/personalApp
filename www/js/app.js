// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','appService','chart.js','ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.filter('cmdate', [
    '$filter', function($filter) {
        return function(input, format) {
          var t = input.split(/[- :]/);
            input = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
            return $filter('date')(new Date(input), format);
        };
    }
])

.factory('serverUrl',[
    function factory(){
      return {
        url: 'http://localhost:8000/',
      }
    }
])


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,  $httpProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');

  $ionicConfigProvider.views.transition('ios');

  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl',
    cache : false
  })

  .state('register', {
    url: "/register",
    templateUrl: "templates/register.html",
    // controller: 'AppCtrl',
    cache : false
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    // controller: 'AppCtrl',
    cache : false
  })

  .state('app.wall', {
    url: "/wall",
    views: {
      'main-view': {
        templateUrl: "templates/wall.html"
      }
    }  ,
    cache : false
  })

  .state('app.chat', {
    url: "/chat",
    views: {
      'main-view': {
        templateUrl: "templates/chat.html"
      }
    }  ,
    cache : false
  })

  .state('app.chat-user', {
    url: "/chat-user",
    views: {
      'main-view': {
        templateUrl: "templates/chat-user.html"
      }
    }  ,
    cache : false
  })

  .state('app.expenses', {
    url: "/expenses",
    views: {
      'main-view': {
        templateUrl: "templates/expenses.html"
      }
    }  ,
    // cache : false
  })

  .state('app.expenses-overview', {
    url: "/expenses-overview",
    views: {
      'main-view': {
        templateUrl: "templates/expenses-overview.html"
      }
    }  ,
    // cache : false
  })


  $urlRouterProvider.otherwise('/app/wall');
});
