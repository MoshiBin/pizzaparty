var pizzaApp = angular.module('pizzaparty', []);

pizzaApp.controller('MainCtrl', function ($scope, $http) {
  $http.get('members/members.json').success(function(data) {
    $scope.members = data;
  });

});
