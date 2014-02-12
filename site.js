var secretApp = angular.module('secretApp', ['ngRoute', 'ngCookies'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'intro.html',
    controller: IntroCtrl
  });
  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: LoginCtrl
  });
  $routeProvider.when('/logout', {
    controller: LogoutCtrl
  });
  $routeProvider.when('/secrets', {
    templateUrl: 'secrets.html',
    controller: SecretsCtrl
  });
  //$locationProvider.html5Mode(true);
});

secretApp.factory('Shared', function() {
  return {
    user: null,
    message: ''
  };
});

var apiBase = '/_/'

function MainCtrl($scope, $route, $routeParams, $location, $cookies, Shared) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  
  $scope.Shared = Shared;
  Shared.user = $cookies.user; //@todo fix cookie persistence
}

function IntroCtrl($scope, $location, Shared) {
  if (Shared.user == null) {
    $location.path('/login');
  } else {
    $location.path('/secrets');
  }
}

function LoginCtrl($scope, $http, $cookies, $location, Shared) {
  $scope.Login = '';
  $scope.Password = '';
  
  $scope.login = function() {
    $http.post(apiBase + 'login', {
        Login: $scope.Login,
        Password: $scope.Password
      }).
    success(function(data, status, headers, config) {
      $cookies.user = data.CurrentUser; //@todo fix persistence
      Shared.user = data.CurrentUser;
      Shared.message = data;
      $location.path("/");
    }).
    error(function(data, status, headers, config) {
      $scope.message = data;
      console.log("login failure:", data);
    });
  }

}

function LogoutCtrl($scope, $http, $cookies, $location, Shared) {
  $scope.logout = function() {
    $http.post(apiBase + 'logout', {}).
    success(function(data, status, headers, config) {
      $cookies.user = data.CurrentUser;
      $scope.user = null;
      Shared.user = null;
      Shared.message = data;
      $location.path("/");
    }).
    error(function(data, status, headers, config) {
      Shared.message = data;
      $location.path("/");
    });
  }
  $scope.logout();
}


function SecretsCtrl($scope, $http) {
  $scope.secrets = [];
  
  $scope.refresh = function() {
    $http.post(apiBase + 'stream', {}).
    success(function(data, status, headers, config) {
      $scope.secrets = data.Secrets
    }).
    error(function(data, status, headers, config) {
      Shared.message = data;
      console.log("fetch secrets failure:", data)
    });
  }
  $scope.refresh();
}