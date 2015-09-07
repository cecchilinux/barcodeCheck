angular.module('starter.controllers', [])

.controller('ScanCtrl', function($scope, $http, $ionicPopup) {
	//$scope.disabled = false;
    $scope.message = '';
    $scope.click = function() {
    	//$scope.disabled = true; //disabilita
    	console.log("stampa 1");
    	if(checkConnection()){
    		$scope.disabled = true;
    		console.log("apertura scanner");
    		$scope.message = '';
        	cordova.plugins.barcodeScanner.scan(
    			function (result) {
    				
    				if(result.cancelled == false){
    					if(result.format == "DATA_MATRIX"){
    						var jsonToSend = result.text;
            				
            				validate(jsonToSend);
        				} else {
        					console.log("formato codice a barre non riconosciuto");
        					showAlert2("Errore",'templates/popupCodeFormat.html');
        					$scope.disabled = false;
        				}
    				}else{
    					console.log("lettura annullata");
    					showAlert2("Errore",'templates/popupReadProblem.html');
    					$scope.disabled = false;
    				}
    				
    			}, 
    			function (error) {
    				console.log("Errore scansione: " + error);
    				showAlert2("Errore",'templates/popupReadProblem.html');
    				$scope.disabled = false;
    			}
    		);
    	} else {  //dispositivo non connesso
    		console.log("Errore connessione");
    		showAlert2("Errore",'templates/popupNetwork.html');
    	}	
    	
    	console.log("stampa 3");
	}

    $scope.clear = function() {
        $scope.message = '';
    }
    
    validate = function(textJSON){
    	console.log("stampa 2");
    	console.log(textJSON);
    	$scope.disabled = true;
    	$http.post('http://www.iubar.it/extranet/api/validazione-cedolino', textJSON).
		  then(function(response) {
		     console.log("success");
		     console.log(angular.toJson(response));
		     $scope.data = response.data.response;
		     //alert(response.data.response);
		   
		     if(response.data.response == true){
		    	//showAlert(true);
		    	showAlert2("risultato",'templates/popupTrue.html');
		    	$scope.message = '<img src="img/success.png" alt="" /><h4>Documento valido</h4>';
		     }else{
		    	showAlert2("risultato",'templates/popupFalse.html');
		    	$scope.message = '<img src="img/error.png" alt="" /><h4>Documento non valido</h4>';
		     }
		     $scope.disabled = false;
		     
		  }, function(response) {
			  //$scope.data = "errore " + response.status + " " +response.statusText;
			  console.error(response.status);
			  console.error(response.statusText);
			  console.log("Errore connessione");
			  showAlert2("Errore",'templates/popupNetworkIubar.html');
			  $scope.disabled = false;
		  });
    		
    }
    
    showAlert2 = function(title, templateUrl){
    		var alertPopup = $ionicPopup.alert({
  			  title: title,
  	          templateUrl: templateUrl,
  	          scope: $scope,
  	          cssClass: 'resultPopup',
      	      okText: 'Chiudi',
      	      okType: 'button-assertive'
  	      });
    }
    
    checkConnection = function() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        return states[networkState] == states[Connection.WIFI];
        //alert('Connection type: ' + states[networkState]);
    }
    
    $scope.popupInfo = function(title, template){
    	var alertPopup = $ionicPopup.alert({
			  title: "info",
  	          templateUrl: 'templates/popupInfo.html',
  	          scope: $scope,
  	          cssClass: 'resultPopup',
      	      okText: 'Chiudi',
      	      okType: 'button-assertive'
	      });
    }
})

