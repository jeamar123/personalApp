app.directive('expensesDirective', [
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
        console.log( "expensesDirective Runinng !" );

        scope.expensesChartLabels = ["Fare", "Food", "Leisure", "Others"];
        scope.expensesChartData = [300, 500, 100, 800];
        scope.expensesChartOptions = {
          legend: {
            display: true,
            position: 'left',
            labels: {
                // fontColor: 'rgb(255, 99, 132)'
                boxWidth: 10,
            },

        }
        }

        scope.onLoad = ( ) =>{

        }

        scope.onLoad();

      }
    }


  }
])