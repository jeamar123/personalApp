app.controller('LoginCtrl', function( $state, $scope , $rootScope){

	$scope.goLogin = ( ) => {
		$state.go('app.wall');
	}
	
	$scope.onLoad = ( ) => {

	}

	$scope.onLoad();

});
