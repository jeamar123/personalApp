app.directive('menuDirective', [
  '$http',
  '$state',
  '$stateParams',
  '$rootScope',
  '$ionicSideMenuDelegate',
  function directive($http,$state,$stateParams,$rootScope,$ionicSideMenuDelegate) {
    return {
      restrict: "A",
      scope: true,
      link: function link( scope, element, attributeSet )
      {
        console.log( "menuDirective Runinng !" );

        scope.openSideMenu = ( ) =>{
          $ionicSideMenuDelegate.toggleRight();
        }

        scope.onLoad = ( ) =>{

        }

        scope.onLoad();

      }
    }


  }
])