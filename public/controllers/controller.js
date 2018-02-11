var myApp = angular.module('myApp',[]);
myApp.controller('AppCntl',['$scope','$http',
	function ($scope,$http){

//console.log(" Hello World from controller");
var refresh =function(){
$http.get('/mytask').success(function(response) {
	//console.log("I got the data I requested");
	$scope.contactlist = response;
	$scope.contact ="";
	//$scope.file ="";

});
};

refresh();

$scope.addContact = function() {
	console.log($scope.contact);
	$http.post('/mytask',$scope.contact).success(function(response){
		console.log(response);
		refresh();
	});
};

$scope.remove = function(id) {
	console.log(id);
	$http.delete('/mytask/' + id.$oid).success(function(response){
		refresh();
	});
};
}]);