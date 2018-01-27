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
        scope.show_add_expenses = false;

        scope.add_success = false;
        scope.add_error = false;

        
      //--- BOTTOM OPTS ---
        scope.mainOptShow = true;
        scope.isCategoryOptShow = false;
        scope.isExpensesListOptShow = false;
      //-------------------


      //--- inside settings---
        scope.delCategoryShow = false;
        scope.addCategoryShow = false;
        scope.editCategoryShow = false;
      //------------------- 

        scope.showDropCat = false;
        scope.showSelectedWeekDays = false;
        scope.weekSelected = false;
        scope.weeksClosed = false;

        scope.selected_expenses = {};
        scope.selected_week = {};
        scope.selected_date = {};
        scope.expenses_form = {};

        scope.category_list = [];
        scope.expenses_dates = [];
        scope.update_category_selected = [];
        scope.delete_category_selected = [];

        scope.category_info = {
          name : null
        };

        scope.weekRange = [];
        scope.monthly_total = 0;

        scope.statistics = {
          budget : 1000,
          expenses : 0,
          savings : 0
        }

        scope.exp_list_month_selected = moment().format( 'MMMM YYYY' );
        scope.selected_month = moment(scope.exp_list_month_selected).format( 'MMM' );

        var month = moment(scope.exp_list_month_selected).format('MMM');
        var year = moment(scope.exp_list_month_selected).format('YYYY');

        var summaryDatePickerObj;

        scope.resetAll = ( ) => {
          scope.show_main = true;
          scope.show_settings = false;
          scope.show_list = false;
          scope.show_add_expenses = false;

          scope.add_success = false;
          scope.add_error = false;

          scope.mainOptShow = true;
          scope.isCategoryOptShow = false;
          scope.isExpensesListOptShow = false;

          scope.delCategoryShow = false;
          scope.addCategoryShow = false;
          scope.editCategoryShow = false;

          scope.showDropCat = false;
          scope.showSelectedWeekDays = false;
          scope.weeksClosed = false;
          scope.weekSelected = false;


          scope.selected_expenses = {};
          scope.selected_week = {};
          scope.selected_date = {};
          scope.expenses_form = {};

          // scope.category_list = [];
          // scope.expenses_dates = [];
          scope.update_category_selected = [];
          scope.delete_category_selected = [];

          $rootScope.$broadcast('toggleDisplayDatePicker',true);
        }

        scope.toggleChartView = ( ) =>{
          scope.show_main = true;
          scope.show_settings = false;
          scope.show_list = false;
          scope.show_add_expenses = false;

          $('body').scrollTop(0);
        }

        scope.toggleListView = ( ) =>{
          scope.show_main = false;
          scope.show_settings = false;
          scope.show_list = true;
          scope.show_add_expenses = false;
          // scope.filterExpensesByDate( );
          // scope.getWeeks( scope.exp_list_month_selected );
          scope.showAllWeeks();
          $('body').scrollTop(0);
        }

        scope.toggleSettings = ( ) =>{
          scope.show_main = false;
          scope.show_settings = true;
          scope.show_list = false;
          scope.show_add_expenses = false;

          $('body').scrollTop(0);
        }

        scope.toggleAddExpenses = ( date ) =>{
          if( scope.category_list.length > 0 ){
            scope.show_settings = false;
            scope.show_list = false;

            if( scope.show_add_expenses == true ){
              scope.show_add_expenses = false;
              scope.show_main = true;
              scope.onLoad();
            }else{
              scope.showAllWeeks();
              if( date ){
                scope.expenses_form.date = date.date;
              }
              scope.show_add_expenses = true;
              scope.show_main = false;
            }
          }else{
            swal({
              title: 'Alert',
              text: 'Please create at least one(1) Category first.',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Go',
              cancelButtonText: 'Cancel'
            }, function(result){
              if( result ){
                scope.$apply(function ( ) {
                  scope.toggleSettings();
                })
              }
            });
          }
        }

      // ---- ADD EXPENSES -----
        scope.toggleCatOptExpForm = ( ) =>{
          if( scope.showDropCat == true ){
            scope.showDropCat = false;
          }else{
            scope.showDropCat = true;
          }
        }

        scope.setSelectedCategory = ( cat ) =>{
          scope.expenses_form.category_id = cat.id;
          scope.expenses_form.category_name = cat.category_name;

          scope.toggleCatOptExpForm();
        }

        scope.submitExpenses = ( data ) =>{
          console.log(data);
          var data = {
            'date' : moment(data.date).format('YYYY-MM-DD'),
            'category_id' : data.category_id,
            'category_name' : data.category_name,
            'description' : data.desc,
            'value' : data.value,
          }

          appModule.addExpenses( data )
            .then(function(response){
              console.log(response);

              if( response.data.status == true ){
                scope.add_success = true;
                scope.add_error = false;

                scope.expenses_form = {};
                scope.fetchExpensesMonth( scope.exp_list_month_selected );
                scope.getWeeks( scope.exp_list_month_selected );
              }else{
                scope.add_success = false;
                scope.add_error = true;
              }
            });
        }

      // ----------------------



      // ---- EXPENSES LIST -----
        scope.toggleWeekDates = ( list ) =>{
          // console.log(list);
          scope.selected_weekly_total = list.weekly_total;

          if( list.showDates == true ){
            list.showDates = false;
            scope.showAllWeeks();
            scope.weekSelected = false;
          }else{
            scope.closeAllWeek( );
            list.show = true;
            list.showDates = true;
            scope.weekSelected = true;
          }
        }

        scope.showAllWeeks = ( ) =>{
          scope.weeksClosed = false;
          scope.weekSelected = false;
          scope.showSelectedWeekDays = false;
          angular.forEach( scope.weekRange, function(value,key){
            value.show = true;
          });
        }

        scope.closeAllWeek = ( ) =>{
          scope.weeksClosed = true;
          angular.forEach( scope.weekRange, function(value,key){
            value.show = false;
            value.showDates = false;
            angular.forEach( value.info, function(value2,key){
              value2.showList = false;
            });
          });
        }

        scope.toggleListItems = ( list ) =>{
          // console.log(list);
          
          scope.isExpensesListOptShow = false;
          if( list.showList == true ){
            $rootScope.$broadcast('toggleDisplayDatePicker',true);
            list.showList = false;
            scope.showSelectedWeekDays = false;
          }else{
            $rootScope.$broadcast('toggleDisplayDatePicker',false);
            list.showList = true;
            scope.showSelectedWeekDays = true;
            scope.selected_date = list;
          }
        }

        scope.toggleExpenses = ( exp ) =>{
          // console.log(exp);
          scope.mainOptShow = false;
          scope.isCategoryOptShow = false;
          scope.isExpensesListOptShow = true;
          scope.selected_expenses = exp;
        }

        
      // ----------------------



      // ---- SETTINGS -----

        scope.toggleCatOpt = ( ) =>{
          scope.delCategoryShow = false;
          scope.addCategoryShow = false;
          scope.editCategoryShow = false;
          scope.mainOptShow = false;
          if( scope.isCategoryOptShow == true ){
            scope.isCategoryOptShow = false;
            scope.mainOptShow = true;
          }else{
            scope.isCategoryOptShow = true;
          }
        }

        scope.toggleCategory = ( cat ) =>{
          // console.log(cat);

          if( scope.isCategoryOptShow == true && !scope.delCategoryShow && !scope.editCategoryShow && !scope.addCategoryShow ){
            swal({
              title: 'Alert',
              text: 'Please select an option below.',
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              cancelButtonText: 'Cancel'
            }, function(result){
              if( result ){

              }
            });
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

        scope.resetCategoryActive = ( ) =>{
          angular.forEach( scope.category_list, function( value, key ){
            value.active = false;
          });
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

        scope.deleteAllSelectedCat = ( ) =>{
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

      // -------------------

        scope.getFirstEndDate = ( month ) =>{
          var firstMonth = moment( month, "MMMM YYYY" ).format('YYYY-MM-DD');
          var lastMonth = moment( month, "MMMM YYYY" ).format('YYYY-MM-DD');

          var date1 = new Date(firstMonth);
          var date2 = new Date(lastMonth);
          var y1 = date1.getFullYear();
          var m1 = date1.getMonth();
          var y2 = date2.getFullYear();
          var m2 = date2.getMonth();
          var firstDay = new Date(y1, m1, 1);
          var lastDay = new Date(y2, m2 + 1, 0);

          firstDay = moment(firstDay).format('YYYY-MM-DD');
          lastDay = moment(lastDay).format('YYYY-MM-DD');

          // console.log(firstDay);
          // console.log(lastDay);

          return {
            start: firstDay,
            end: lastDay,
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
          // console.log(weeks);
          scope.createDatesFromWeek(weeks);
        }

        scope.createDatesFromWeek = ( weeks ) =>{
          scope.monthly_total = 0;

          angular.forEach( weeks, function(value,key){
            // console.log(value);
            value.days = [];
            value.showDates = false;
            value.show = true;
            value.weekly_total = 0;
            for (var i = value[0]; i <= value[1]; i++) {
              value.days.push({
                day : moment( month + " " + i + ", " +  year, 'MMM DD, YYYY').format('ddd'),
                date : moment( month + " " + i + ", " +  year, 'MMM DD, YYYY').format('MMMM DD, YYYY'),
                expenses : [],
                daily_total : 0,
                show_list : false
              })
            }

            if( key == (scope.weekRange.length-1) ){
              // console.log( scope.weekRange );
              scope.addExpensesByWeek( scope.weekRange );
            }
          });
        }

        scope.addExpensesByWeek = ( weeks ) =>{
          
          angular.forEach( weeks, function( value, key ){
            // console.log(value);
            angular.forEach( value.days, function( value2, key ){
              // console.log(value2);
              angular.forEach( scope.expenses_dates, function( value3, key ){
                // console.log(value3);
                if( value2.date == moment(value3.date).format('MMMM DD, YYYY') ){
                  value2.daily_total += value3.value;
                  value2.expenses.push(value3);
                }
              });

              value.weekly_total += value2.daily_total;
            });

            scope.monthly_total += value.weekly_total;
          });
        }

        scope.setDatePicker = ( ) =>{
          var day = $( ".calendar_grid .selected_date" ).text();
          var month = $( ".month_select select" ).val();
          var year = ($( ".year_select select" ).val()).replace('number:','');
          var date_selected = moment(month + " " + day + ", " + year, 'MMM D, YYYY');
          return date_selected;
        }

        scope.initializeDatePicker = ( ) =>{
          summaryDatePickerObj = {
            callback: function (val) {  
              var date = scope.setDatePicker();

              if( scope.show_main || scope.show_list ){
                $( ".sum-date" ).text( scope.exp_list_month_selected );
                scope.exp_list_month_selected = moment(date).format( 'MMMM YYYY' );
                $rootScope.$broadcast('setDatePicker', {date:scope.exp_list_month_selected} );
                scope.fetchExpensesMonth( scope.exp_list_month_selected );
                // console.log(scope.exp_list_month_selected);
              }

              if( scope.show_add_expenses ){
                scope.expenses_form.date = moment(date).format( 'MMMM DD, YYYY' );
                // console.log(scope.expenses_form.date);
              }
              
              scope.initializeDatePicker();
            },
            inputDate: ( scope.exp_list_month_selected != moment().format( 'MMMM YYYY' ) ) ? new Date( moment(scope.exp_list_month_selected).format( 'YYYY,MM,DD' ) ) : new Date( moment( ).format( 'YYYY,MM,DD' ) ),      
            // inputDate: new Date( moment(scope.exp_list_month_selected).format( 'YYYY,MM,DD' ) ),      
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

        scope.initializePieChart = ( ) =>{
          scope.expensesChartLabels = [];
          scope.expensesChartData = [];

          angular.forEach( scope.category_list, function( value, key ){
            // console.log(value);
            if( value.show == true ){
              scope.expensesChartLabels.push( value.category_name );
              scope.expensesChartData.push( value.value );
            }
            // console.log(scope.expensesChartLabels);
            // console.log(scope.expensesChartData);
          });

          scope.expensesChartOptions = {
            legend: {
              display: true,
              position: 'left',
              labels: {
                  // fontColor: 'rgb(255, 99, 132)'
                  fontStyle: 'bold',
                  fontSize: 14,
                  boxWidth: 10,
              },
            },
          }
        }

        scope.fetchCategories = ( ) =>{
          appModule.getCategories()
            .then(function(response){
              // console.log(response);
              scope.category_list = response.data;

              angular.forEach( scope.category_list, function(value,key){
                value.value = 0;
                value.show = true;

                if( (scope.category_list.length - 1) == key ){
                  scope.initializePieChart( );
                }
              });
            });
        }

        scope.fetchExpensesMonth = ( month ) =>{
          var data = scope.getFirstEndDate( month );

          appModule.getExpensesPerMonth( data )
            .then(function(response){
              console.log(response);
              scope.expenses_dates = response.data;
              scope.statistics.expenses = 0;
              scope.statistics.savings = 0;

              angular.forEach( scope.expenses_dates, function( value, key ){
                // console.log(value);
                var cat_index = $.inArray( value.category, scope.expensesChartLabels);

                scope.expensesChartData[cat_index] += value.value; 
                scope.statistics.expenses += value.value;
                scope.statistics.savings = scope.statistics.budget - scope.statistics.expenses;

                if( (scope.expenses_dates.length - 1) == key ){
                  scope.getWeeks( scope.exp_list_month_selected );
                }
              });

              if( scope.expenses_dates.length == 0 ){
                scope.getWeeks( scope.exp_list_month_selected );
              }
            });
        }

        scope.onLoad = ( ) =>{
          scope.resetAll( );
          scope.initializeDatePicker( );
          scope.fetchCategories( );
          scope.fetchExpensesMonth( scope.exp_list_month_selected );
        }

        scope.onLoad();

        scope.$on( 'toggleSummaryDatePicker', ( evt, data )  => {
          scope.toggleSummaryDatePicker( );
        })

      }
    }


  }
])