var pizzaApp = angular.module('pizzaparty', []);

pizzaApp.controller('MainCtrl', function ($scope, $http) {
  $http.get('/pizza').success(function(data) {
    $scope.members = data.members;
  });
  $scope.prettytoppings = function (toppings) {
      return toppings.join(", ");
  }
});
