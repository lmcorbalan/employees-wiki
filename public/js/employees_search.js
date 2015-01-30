angular.module('employees_search', ['ui.bootstrap', 'angular.filter']);
angular.module('employees_search').controller('EmployeesSearchCtrl', function($scope, $http) {

  // Any function returning a promise object can be used to load values asynchronously
  $scope.employees_data = [];
  $scope.getEmployees = function(val) {
    return $http.get( '/employees/search/'+ (val || '') ).then( function(response){
      response.data.map(function (item) {
        item.full_name = item.last_name + ', ' + item.name;
        item.label = item.last_name + ', ' + item.name + ' - ' + item.email;
      });
      $scope.employees_data = response.data; // ir modificanto $scope.employees
      return response.data;
    });
  };

  $scope.getEmployees();
});
