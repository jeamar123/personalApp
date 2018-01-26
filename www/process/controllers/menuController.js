app.controller('AppCtrl', function( $state, $scope , $rootScope ){

	// console.log( $state );

	$scope.current_page = $state.current.name;

	$scope.summary_month_selected = moment().format( 'MMMM YYYY' );
	$scope.showDatePicker = true;

	$scope.$on( 'setDatePicker', ( evt, data )  => {
		$scope.summary_month_selected = data.date;
  });

  $scope.$on( 'toggleDisplayDatePicker', ( evt, data )  => {
		$scope.showDatePicker = data;
  })


	
	$scope.toggleSummaryDatePicker = ( ) => {
		$rootScope.$broadcast('toggleSummaryDatePicker');
	}

	$scope.onLoad = ( ) => {

	}

	$scope.onLoad();

});
