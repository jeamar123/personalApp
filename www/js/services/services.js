var appService = angular.module('appService', [])

appService.factory('appModule', function( serverUrl, $http ){
  var appFactory = {};

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