var appService = angular.module('appService', [])

appService.factory('appModule', function( serverUrl, $http ){
  var appFactory = {};

  // EXPENSES

  appFactory.getExpenses = function( ) {
    return $http.get(serverUrl.url + 'expenses');
  };

  appFactory.getExpensesPerMonth = function( data ) {
    return $http.post(serverUrl.url + 'expenses/month', data);
  };

  appFactory.addExpenses = function( data ) {
    return $http.post(serverUrl.url + 'expenses', data);
  };

  appFactory.updateExpenses = function( data ) {
    return $http.post(serverUrl.url + 'expenses/update', data);
  };

  appFactory.deleteExpenses = function( id ) {
    return $http.get(serverUrl.url + 'expenses/delete/' + id);
  };

  // CATEGORIES

  appFactory.getCategories = function( ) {
    return $http.get(serverUrl.url + 'categories');
  };

  appFactory.addCategories = function( data ) {
    return $http.post(serverUrl.url + 'categories', data);
  };

  appFactory.updateCategories = function( data ) {
    return $http.post(serverUrl.url + 'categories/update', data);
  };

  appFactory.deleteCategories = function( id ) {
    return $http.get(serverUrl.url + 'categories/delete/' + id);
  };

  return appFactory;
});