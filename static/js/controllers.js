var pizzaApp = angular.module('pizzaparty', []);

pizzaApp.factory("members", function() {
  var members = [];
  var notifies = [];

  return {
    getMembers: function() {return members;},
    subscribe: function(scope, callback) {
      notifies.push(callback);
    },
    addMember: function(member) {
      members.push(member);
      notifies.forEach(function(notf) {
        notf(member);
      });
    }
  };
});

pizzaApp.controller('MainCtrl', function ($scope, members) {
  members.subscribe($scope, function(member) {
    $scope.members = members.getMembers();
  });

  $scope.prettytoppings = function (toppings) {
    return toppings.join(", ");
  };

  $scope.addMember = function(newmember) {
    members.addMember(angular.copy(newmember));
  };
});
