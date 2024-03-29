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
    {id: 1, name: "Anchovi"},
    {id: 2, name: "Beaf"},
    {id: 3, name: "Black Olives"},
    {id: 4, name: "Green Olives"},
    {id: 5, name: "Fresh Mushrooms"},
    {id: 6, name: "Tuna"},
    {id: 7, name: "Eggplants"},
    {id: 8, name: "Jalapeno"},
    {id: 10, name: "Ham"},
    {id: 11, name: "Pineapple"},
    {id: 12, name: "Tomatos"},
    {id: 13, name: "Corn"},
    {id: 14, name: "Roasted Peppers"},
    {id: 15, name: "Extra Cheese"},
    {id: 16, name: "Bulgarian cheese"},
    {id: 17, name: "Green Pepper"},
    {id: 18, name: "Onion"},
    {id: 19, name: "Pepperoni"},
    {id: 20, name: "Garlic"},
    {id: 21, name: "Kabanos"},
    {id: 26, name: "Bulgarian Cheese (Cubes)"},
    {id: 27, name: "Goat Cheese"},
    {id: 28, name: "Beef Shoulder"},
    {id: 30, name: "Kalamata Olives"},
    {id: 31, name: "Gorgonzola"},
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
    var toppings_names = [];
    toppings.forEach(function (topping) {
        toppings_names.push(topping.name);
    });
    return toppings_names.join(", ");
  };

  $scope.pizzas = {};

  $scope.addMember = function(newmember) {
    members.addMember(angular.copy(newmember));
  };

  $scope.getPizza = function() {
    // starting spinner
    $scope.loading = true ; 

    $http.post("/pizza", {members: $scope.members}).
      success(function(data, status, headers, config) {
        $scope.pizzas = data;

        // removing spinner
        $scope.loading = false ; 
      }).
      error(function(data, status, headers, config) {
        // removing spinner
        $scope.loading = false ; 
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
