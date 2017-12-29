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

        scope.show_main = true;
        scope.show_settings = false;
        scope.show_list = false;

        scope.isStatsShown = false;
        scope.isEditIncomeShown = false;

        scope.expenses_list = [];

        scope.statistics = {
          income : "1000.00",
          expenses : "700.00",
          savings : "300.00"
        }

        scope.categories = [
          {
            category : "Fare",
            value : 300,
            show : true
          }, 
          {
            category : "Food",
            value : 500,
            show : true
          },
          {
            category : "Personal",
            value : 100,
            show : true
          },
          {
            category : "Others",
            value : 800,
            show : true
          }
        ];

        scope.expenses_dates = [
          {
            date : '12-01-17',
            category : 'Fare',
            desc : 'fare to office',
            value : 19
          },
          {
            date : '12-01-17',
            category : 'Fare',
            desc : 'fare to home',
            value : 36
          },
          {
            date : '12-08-17',
            category : 'Food',
            desc : 'Dinner',
            value : 200
          },
          {
            date : '12-22-17',
            category : 'Fare',
            desc : 'fare to gaisano',
            value : 6
          },
          {
            date : '12-22-17',
            category : 'Personal',
            desc : 't-shirt',
            value : 149
          },
        ];

        scope.toggleEditIncome = ( ) =>{
          if( scope.isEditIncomeShown == true ){
            scope.isEditIncomeShown = false;
          }else{
            scope.isEditIncomeShown = true;
          }
        }

        scope.toggleCategory = ( cat ) =>{
          if( cat.show == true ){
            cat.show = false;
          }else{
            cat.show = true;
          }
        }

        scope.toggleStatistics = ( ) =>{
          if( scope.isStatsShown == true ){
            scope.isStatsShown = false;
          }else{
            scope.isStatsShown = true;
          }
        }

        scope.toggleListView = ( ) =>{
          if( scope.show_list == true ){
            scope.show_list = false;
            scope.show_main = true;
          }else{
            scope.show_list = true;
            scope.show_main = false;
          }
        }

        scope.toggleListItems = ( list ) =>{
          console.log(list);
          if( list.showList == true ){
            list.showList = false;
          }else{
            list.showList = true;
          }
        }

        scope.toggleSettings = ( ) =>{
          if( scope.show_settings == true ){
            scope.show_settings = false;
            scope.show_main = true;

            scope.initializePieChart( );
          }else{
            scope.show_settings = true;
            scope.show_main = false;
          }
        }

        scope.filterExpensesByDate = ( ) =>{
          scope.expenses_list = [];
          var temp_date = null;
          var ctr = 0;

          angular.forEach( scope.expenses_dates, function( value, key ){
            // console.log(value);
            if( temp_date == null ){
              temp_date = value.date;
              scope.expenses_list.push({
                date : moment(temp_date).format( 'MMMM DD, YYYY' ),
                showList : false,
                expenses : [value]
              });
            }else{
              if( temp_date == value.date ){
                scope.expenses_list[ctr].expenses.push(value);
                
              }else{
                temp_date = value.date;
                scope.expenses_list.push({
                  date : moment(temp_date).format( 'MMMM DD, YYYY' ),
                  showList : false,
                  expenses : [value]
                });

                ctr++;
              }
            }

          });
        }

        scope.initializePieChart = ( ) =>{
          scope.expensesChartLabels = [];
          scope.expensesChartData = [];

          angular.forEach( scope.categories, function( value, key ){
            // console.log(value);
            if( value.show == true ){
              scope.expensesChartLabels.push( value.category );
              scope.expensesChartData.push( value.value );
            }
          });

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
        }

        scope.onLoad = ( ) =>{
          scope.initializePieChart( );
          scope.filterExpensesByDate( );
        }

        scope.onLoad();

      }
    }


  }
])