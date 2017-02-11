var app = angular.module('mission2', [ 'ngRoute' ]);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/m21', {
        templateUrl: 'views/mission21.html',
        controller: 'm21Controller'
      })
      .when('/m22', {
        templateUrl: 'views/mission22.html',
        controller: 'm22Controller'
      })
      .when('/m23', {
        templateUrl: 'views/mission23.html',
        controller: 'm23Controller'
      })
      .otherwise({
        redirectTo: '/m21'
      });
}]);