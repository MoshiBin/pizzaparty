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

pizzaApp.controller('MainCtrl', function ($scope, $http, members) {
  members.subscribe($scope, function(member) {
    $scope.members = members.getMembers();
  });

  $scope.prettytoppings = function (toppings) {
    return toppings.join(", ");
  };

  $scope.addMember = function(newmember) {
    members.addMember(angular.copy(newmember));
  };

  $scope.getPizza = function() {
    $http.post("/pizza", {members: $scope.members}).
      success(function(data, status, headers, config) {
        console.log("Success");
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        console.log("Failure");
        console.log(data);
      });
    return members.toString();
  };
});

pizzaApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});
