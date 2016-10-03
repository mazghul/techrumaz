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
		//console.log(response);
		refresh();
	});
};

$scope.remove = function(id) {
	//console.log(id);
	$http.delete('/mytask/' + id).success(function(response){
		refresh();
	});
};





	/*person1= {
		name: 'Maz',
		Email:'mazghul@gmail.com',
		Mobileno: '9751009574'
	};

	person2= {
		name: 'ghul',
		Email: 'ghulasan@gmail.com',
		Mobileno: '0562485760'
	};

	person3= {
		name: 'Saff',
		Email: 'saffghul@gmail.com',
		Mobileno: '8681918519'
	};

	var contactlist = [person1, person2, person3];
	$scope.contactlist = contactlist; */
}]);

