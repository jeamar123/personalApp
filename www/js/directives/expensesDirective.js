app.directive('expensesDirective', [
  '$http',
  '$state',
  '$stateParams',
  '$rootScope',
  'appModule',
  'ionicDatePicker',
  function directive($http,$state,$stateParams,$rootScope,appModule,ionicDatePicker) {
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

        // inside settings
        scope.isCategoryOptShow = false;
        scope.delCategoryShow = false;
        scope.addCategoryShow = false;
        scope.editCategoryShow = false;
        // 

        scope.expenses_list = [];
        scope.category_list = [];

        scope.update_category_selected = [];
        scope.delete_category_selected = [];

        scope.category_info = {
          name : null
        };

        scope.weekRange = [];

        scope.statistics = {
          income : "1000.00",
          expenses : "700.00",
          savings : "300.00"
        }

        scope.summary_month_selected = moment().format( 'MMMM YYYY' );
        scope.exp_list_month_selected = moment().format( 'MMMM YYYY' );

        var summaryDatePickerObj;

        scope.expenses_dates = [
          {
            date : '01-01-18',
            category : 'Fare',
            desc : 'fare to office',
            value : 19
          },
          {
            date : '01-01-18',
            category : 'Fare',
            desc : 'fare to home',
            value : 36
          },
          {
            date : '01-08-18',
            category : 'Food',
            desc : 'Dinner',
            value : 200
          },
          {
            date : '01-09-18',
            category : 'Fare',
            desc : 'fare to gaisano',
            value : 6
          },
          {
            date : '01-09-18',
            category : 'Fare',
            desc : 'fare to gaisano',
            value : 6
          },
          {
            date : '01-15-18',
            category : 'Personal',
            desc : 't-shirt',
            value : 149
          },
        ];

        scope.toggleCatOpt = ( ) =>{
          scope.delCategoryShow = false;
          scope.addCategoryShow = false;
          scope.editCategoryShow = false;
          if( scope.isCategoryOptShow == true ){
            scope.isCategoryOptShow = false;
          }else{
            scope.isCategoryOptShow = true;
          }
        }

        scope.toggleEditIncome = ( ) =>{
          if( scope.isEditIncomeShown == true ){
            scope.isEditIncomeShown = false;
          }else{
            scope.isEditIncomeShown = true;
          }
        }

        scope.resetCategoryActive = ( ) =>{
          angular.forEach( scope.category_list, function( value, key ){
            value.active = false;
          });
        }

        scope.toggleCategory = ( cat ) =>{
          // console.log(cat);
          if( !scope.isCategoryOptShow ){
            if( cat.show == true ){
              cat.show = false;
            }else{
              cat.show = true;
            }
          }

          if( scope.delCategoryShow ){
            var index = $.inArray( cat, scope.delete_category_selected );

            if( index < 0 ){
              cat.active = true;
              scope.delete_category_selected.push( cat );
            }else{
              cat.active = false;
              scope.delete_category_selected.splice( index, 1 );
            }
          }

          if( scope.editCategoryShow ){
            var index = $.inArray( cat, scope.update_category_selected );
            scope.resetCategoryActive();

            if( index < 0 ){
              cat.active = true;
              scope.update_category_selected = [];
              scope.update_category_selected.push( cat );
              scope.category_info.name = cat.category_name;

              setTimeout(function() {
                $( "#category_input2" ).get(0).focus();
              }, 200);
            }else{
              cat.active = false;
              scope.update_category_selected.splice( index, 1 );
              scope.category_info.name = null;
            }
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
            scope.filterExpensesByDate( );
          }
        }

        scope.toggleListItems = ( list ) =>{
          if( list.showList == true ){
            list.showList = false;
          }else{
            list.showList = true;
          }
        }

        scope.toggleDeleteCategory = ( ) =>{
          scope.resetCategoryActive();
          scope.addCategoryShow = false;
          scope.editCategoryShow = false;
          scope.delete_category_selected = [];
          scope.update_category_selected = [];
          if( scope.delCategoryShow == false ){
            scope.delCategoryShow = true;
          }else{
            scope.delCategoryShow = false;
          }
        }

        scope.toggleAddCategory = ( ) =>{
          scope.resetCategoryActive();
          scope.delCategoryShow = false;
          scope.editCategoryShow = false;
          scope.delete_category_selected = [];
          scope.update_category_selected = [];
          if( scope.addCategoryShow == false ){
            scope.addCategoryShow = true;
            setTimeout(function() {
              $( "#category_input" ).get(0).focus();
            }, 200);
          }else{
            scope.addCategoryShow = false;
          }
        }

        scope.toggleEditCategory = ( ) =>{
          scope.resetCategoryActive();
          scope.addCategoryShow = false;
          scope.delCategoryShow = false;
          scope.delete_category_selected = [];
          scope.update_category_selected = [];
          if( scope.editCategoryShow == false ){
            scope.editCategoryShow = true;
          }else{
            scope.editCategoryShow = false;
          }
        }

        scope.toggleSettings = ( ) =>{
          if( scope.show_settings == true ){
            scope.resetCategoryActive();

            scope.show_settings = false;
            scope.show_main = true;

            scope.isCategoryOptShow = false;
            scope.delCategoryShow = false;
            scope.addCategoryShow = false;
            scope.editCategoryShow = false;

            scope.update_category_selected = [];
            scope.delete_category_selected = [];

            scope.initializePieChart( );
          }else{
            scope.show_settings = true;
            scope.show_main = false;
          }
        }

        scope.getWeeks = ( month ) =>{
          month = moment(month, 'YYYY-MM-DD');

          var first = month.day() == 0 ? 6 : month.day()-1;
          var day = 7-first;

          var last = month.daysInMonth();
          var count = (last-day)/7;

          var weeks = [];
          weeks.push([1, day]);
          for (var i=0; i < count; i++) {
            weeks.push([(day+1), (Math.min(day+=7, last))]);

          }
          scope.weekRange = weeks;
          console.log(weeks);
          scope.filterExpensesByWeek(weeks);
        }

        scope.filterExpensesByWeek = ( weeks ) =>{

          scope.weekRange = weeks;

          angular.forEach( scope.weekRange, function( value, key ){
            console.log(value);
            angular.forEach( scope.expenses_list, function( value2, key ){
              
              var month = moment(scope.exp_list_month_selected).format('MMM');
              var year = moment(scope.exp_list_month_selected).format('YYYY');
              var start = moment( month + " " + value[0] + ", " +  year, 'MMM DD, YYYY').format('MMM DD, YYYY');
              var end = moment( month + " " + value[1] + ", " +  year, 'MMM DD, YYYY').format('MMM DD, YYYY');
              var compare = moment(value2.date).format('MMM DD, YYYY');

              // console.log(start);
              // console.log(end);
              // console.log(compare);

              var isBetweenRange = moment(compare).isBetween( moment(start).subtract(1, 'days'), moment(end).add(1, 'days') );
              
              if( isBetweenRange ){
                value.info = value2;
                value.info.start = start;
                value.info.end = end;
              }
            });
          });
        }

        scope.filterExpensesByDate = ( ) =>{
          scope.expenses_list = [];
          var temp_date = null;
          var ctr = 0;

          angular.forEach( scope.expenses_dates, function( value, key ){

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

            if( key == (scope.expenses_dates.length-1) ){
              scope.getWeeks( scope.exp_list_month_selected );
              console.log(scope.expenses_list);
            }
          });

          
        }

        scope.initializePieChart = ( ) =>{
          scope.expensesChartLabels = [];
          scope.expensesChartData = [];

          angular.forEach( scope.category_list, function( value, key ){
            // console.log(value);
            if( value.show == true ){
              scope.expensesChartLabels.push( value.category_name );
              scope.expensesChartData.push( value.value );
            }
          });

          scope.expensesChartOptions = {
            legend: {
              display: true,
              position: 'left',
              labels: {
                  // fontColor: 'rgb(255, 99, 132)'
                  fontWeight: 700,
                  boxWidth: 10,
              },

            }
          }
        }

        scope.addCategories = ( cat ) =>{
          var data = {
            category_name : cat
          }

          appModule.addCategories( data )
            .then(function(response){
              console.log(response);
              if( response.data.status ){
                scope.category_info.name = null;
                scope.fetchCategories( );
              }
            });
        }

        scope.updateCategoriesName = ( cat ) =>{
          swal({
            title: 'Confirm',
            text: 'are you sure you want to update this category?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          }, function(result){
            if( result ){
              var data = {
                category_name : cat,
                category_id : scope.update_category_selected[0].id
              }

              appModule.updateCategories( data )
                .then(function(response){
                  console.log(response);
                  if( response.data.status == true ){
                    scope.category_info.name = null;
                    scope.update_category_selected = [];
                    scope.fetchCategories( );
                  }
                });
            }
          });
        }

        scope.deleteAllSelected = ( ) =>{
          swal({
            title: 'Confirm',
            text: 'are you sure you want to delete these selected('+scope.delete_category_selected.length+') categories?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          }, function(result){
            if( result ){
              angular.forEach( scope.delete_category_selected, function( value, key ){
                scope.deleteCategories( value );

                if( (scope.delete_category_selected.length - 1) == key ){
                  setTimeout(function() {
                    scope.resetCategoryActive();
                    scope.delete_category_selected = [];
                  }, 1000);
                }
              });
            }
          });
        }

        scope.deleteCategories = ( cat ) =>{
          appModule.deleteCategories( cat.id )
            .then(function(response){
              console.log(response);
              scope.fetchCategories( );
            });
        }

        scope.fetchCategories = ( ) =>{
          appModule.getCategories()
            .then(function(response){
              // console.log(response);
              scope.category_list = response.data;

              angular.forEach( scope.category_list, function(value,key){
                value.value = '300.00';
                value.show = true;

                if( (scope.category_list.length - 1) == key ){
                  scope.initializePieChart( );
                }
              });

              
            });
        }

        scope.initializeDatePicker = ( ) =>{
          summaryDatePickerObj = {
            callback: function (val) {  
              // console.log(val);
            },
            inputDate: new Date( moment(scope.summary_month_selected).format( 'YYYY,MM,DD' ) ),      
            mondayFirst: true,          
            closeOnSelect: false,       
            templateType: 'popup',
            dateFormat: 'MMMM yyyy',
            closeLabel: 'Set',
            // titleLabel: 'Select a Date',
            // setLabel: 'Set',
            // todayLabel: 'Today',
            // weeksList: ["S", "M", "T", "W", "T", "F", "S"],
            // monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            // from: new Date(2012, 8, 1),
            // to: new Date(2018, 8, 1),
            // showTodayButton: true,
            // disableWeekdays: []       
          };
        }

        scope.toggleSummaryDatePicker = ( ) =>{
          ionicDatePicker.openDatePicker( summaryDatePickerObj );

          if( scope.show_main || scope.show_list ){
            setTimeout(function() {
              $( ".calendar_grid" ).hide();
              $( ".prev_btn_section" ).hide();
              $( ".next_btn_section" ).hide();
              $( ".select_section .col-50" ).addClass( 'col-60' ).removeClass( 'col-50' );
            }, 100);
          }
        }

        scope.setDatePicker = ( ) =>{
          var day = $( ".calendar_grid .selected_date" ).text();
          var month = $( ".month_select select" ).val();
          var year = ($( ".year_select select" ).val()).replace('number:','');
          // console.log(day);
          // console.log(month);
          // console.log(year);

          var date_selected = moment(month + " " + day + ", " + year, 'MMM D, YYYY');

          return date_selected;
        }

        scope.onLoad = ( ) =>{
          scope.initializeDatePicker( );
          scope.fetchCategories( );
        }

        scope.onLoad();



        $(document).on("click", ".button_close", function() {
          var date = scope.setDatePicker();
          scope.summary_month_selected = moment(date).format( 'MMMM YYYY' );
          $( ".sum-date" ).text( scope.summary_month_selected );
          scope.initializeDatePicker();
          // console.log(scope.summary_month_selected);
        });

      }
    }


  }
])