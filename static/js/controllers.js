var pizzaApp = angular.module('pizzaparty', ['ui.select']);

pizzaApp.factory("members", function() {
  var members = [];
  var notifies = [];

  return {
    getMembers: function() {return members;},
    subscribe: function(scope, callback) {
      notifies.push(callback); },
    addMember: function(member) {
      members.push(member);
      notifies.forEach(function(notf) {
        notf(member);
      });
    }
  };
});

pizzaApp.filter("propsFilter", function() {
  return function(items, props) {
    var out = [];
    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

pizzaApp.controller('MainCtrl', function ($scope, $http, $sce, members) {
  $scope.toppings = [
    {id: 0, name: "Pepperoni"},
    {id: 1, name: "Mushrooms"},
    ];
  //hiding spinner
  $scope.loading = false ; 

  $scope.newmember = {};

  // making us safe
  $scope.trustAsHtml = function(value) {
        return $sce.trustAsHtml(value);
  };
  members.subscribe($scope, function(member) {
    $scope.members = members.getMembers();
  });

  $scope.prettytoppings = function (toppings) {
    console.log(toppings);
    var toppings_names = [];
    toppings.forEach(function (topping) {
        toppings_names.push(topping.name);
    });
    return toppings_names.join(", ");
  };

  $scope.addMember = function(newmember) {
    console.log(newmember);
    members.addMember(angular.copy(newmember));
  };

  $scope.getPizza = function() {
    // starting spinner
    $scope.loading = true ; 

    $http.post("/pizza", {members: $scope.members}).
      success(function(data, status, headers, config) {
        console.log("Success");
        console.log(data);

        // removing spinner
        $scope.cancel = function(){
            $scope.loading = false ; 
        }
      }).
      error(function(data, status, headers, config) {
        // removing spinner
        $scope.cancel = function(){
            $scope.loading = false ; 

        console.log("Failure");
        console.log(data);
        }
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

pizzaApp.config(function(uiSelectConfig) {
  uiSelectConfig.theme = "bootstrap";
});
