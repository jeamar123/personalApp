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

        scope.isExpensesClicked = false;

        scope.toggleMenu = ( opt ) =>{
          if( opt == 'expenses' ){
            if( scope.isExpensesClicked == false ){
              scope.isExpensesClicked = true;
            }else{
              scope.isExpensesClicked = false;
            }
          }
        }

        scope.onLoad = ( ) =>{

        }

        scope.onLoad();

      }
    }


  }
])