var appService = angular.module('appService', [])

appService.factory('appModule', function( serverUrl, $http ){
  var appFactory = {};

  appFactory.categoryList = function( ) {
    return $http.get(serverUrl.url + 'clinic/clinic_type');
  };

  return appFactory;
});