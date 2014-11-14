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
    {id: 1, name: "אנשובי"},
    {id: 2, name: "בשר בקר"},
    {id: 3, name: "זיתים שחורים"},
    {id: 4, name: "זיתים ירוקים"},
    {id: 5, name: "פטריות טריות"},
    {id: 6, name: "טונה"},
    {id: 7, name: "חצילים"},
    {id: 8, name: "פלפל חלפיניו"},
    {id: 10, name: "פסטרמה"},
    {id: 11, name: "אננס"},
    {id: 12, name: "עגבניות"},
    {id: 13, name: "תירס"},
    {id: 14, name: "פלפלים קלויים"},
    {id: 15, name: "אקסטרה גבינה"},
    {id: 16, name: "גבינה בולגרית"},
    {id: 17, name: "פלפל ירוק"},
    {id: 18, name: "בצל"},
    {id: 19, name: "פפרוני"},
    {id: 20, name: "שום"},
    {id: 21, name: "קבנוס"},
    {id: 26, name: "בולגרית קוביות"},
    {id: 27, name: "גבינת עיזים"},
    {id: 28, name: "כתף בקר"},
    {id: 30, name: "זית קלמטה"},
    {id: 31, name: "גורגונזולה"},
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
