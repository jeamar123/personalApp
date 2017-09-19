app.directive('wallDirective', [
  '$http',
  '$state',
  '$stateParams',
  '$rootScope',
  function directive($http,$state,$stateParams,$rootScope) {
    return {
      restrict: "A",
      scope: true,
      link: function link( scope, element, attributeSet )
      {
        console.log( "wallDirective Runinng !" );

        scope.onLoad = ( ) =>{

        }

        scope.onLoad();

      }
    }


  }
])